import { NextResponse } from "next/server";
import { applyWebhook } from "@/lib/db/services";
import { assertPayfastSigningConfigured, verifyPayFastSignature } from "@/lib/payment/payfast";
import { getProductBySlug } from "@/lib/shop/data";
import { sendAdminNotification, sendOrderConfirmation } from "@/lib/emails/send";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let serviceClient;

  try {
    serviceClient = await createServiceClient();
    assertPayfastSigningConfigured();
  } catch (error) {
    console.error("Webhook configuration error:", error);
    return new NextResponse("Webhook Configuration Error", { status: 500 });
  }

  const formData = await request.formData().catch(() => null);

  // PayFast ITN requires plain text responses — not JSON envelopes.
  if (!formData) {
    return new NextResponse("Invalid Request", { status: 400 });
  }

  // Convert formData to a plain object
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  // Verify the signature
  const isValid = verifyPayFastSignature(data);
  if (!isValid) {
    console.error("PayFast signature verification failed", {
      m_payment_id: data.m_payment_id,
      payment_status: data.payment_status,
    });
    return new NextResponse("Invalid Signature", { status: 400 });
  }

  const paymentStatus = data.payment_status === "COMPLETE" ? "paid" : "failed";
  const orderId = data.m_payment_id;
  const paymentId = data.pf_payment_id || data.payment_id || "";

  if (!orderId) {
    return new NextResponse("Missing m_payment_id", { status: 400 });
  }

  // Idempotency: reject already-processed payment IDs
  if (paymentId) {
    const { data: existing } = await serviceClient
      .from("orders")
      .select("id")
      .eq("payfast_payment_id", paymentId)
      .maybeSingle();
    if (existing) {
      console.log("PayFast webhook: duplicate pf_payment_id, ignoring", { paymentId, orderId });
      return new NextResponse("OK", { status: 200 });
    }
  }

  const { data: currentOrder, error: orderError } = await serviceClient
    .from("orders")
    .select("price")
    .eq("id", orderId)
    .single();

  if (orderError || !currentOrder) {
    return new NextResponse("Order Not Found", { status: 404 });
  }

  const paidAmountRaw = data.amount_gross || data.amount || "";
  const paidAmount = Number(paidAmountRaw);
  const expectedAmount = Number(currentOrder.price);

  if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - expectedAmount) > 0.01) {
    console.error("PayFast amount mismatch", {
      orderId,
      paidAmountRaw,
      expectedAmount,
    });
    return new NextResponse("Amount Mismatch", { status: 400 });
  }

  const result = await applyWebhook({
    orderId,
    paymentStatus,
    paymentId,
  }, {
    supabaseClient: serviceClient,
  });

  if ("error" in result || !result.data) {
    console.error("Webhook processing failed:", result.error);
    return new NextResponse("Processing Failed", { status: 500 });
  }

  const order = result.data;
  const shouldSendPaymentEmails =
    paymentStatus === "paid" && result.previousPaymentStatus !== "paid";

  // Send emails if payment is complete
  if (shouldSendPaymentEmails) {
    const product = await getProductBySlug(order.productSlug);
    const productName = product?.name || order.productSlug;

    await Promise.all([
      sendOrderConfirmation(order, productName),
      sendAdminNotification(order, productName),
    ]).catch((err) => {
      console.error("PayFast webhook: payment confirmation emails failed", {
        orderId,
        error: err instanceof Error ? err.message : String(err),
      });
    });
  }

  // PayFast ITN expects plain text "OK", not JSON — do not convert to ok() envelope.
  return new NextResponse("OK", { status: 200 });
}