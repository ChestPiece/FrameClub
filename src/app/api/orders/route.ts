import { fail, ok, parseJsonBody } from "@/lib/http/api-envelope";
import { createOrderAccessToken } from "@/lib/payment/order-access-token";
import { createOrder } from "@/lib/db/services";
import {
  assertPayfastSigningConfigured,
  generatePayFastSignature,
  getPayFastUrl,
  payfastConfig,
} from "@/lib/payment/payfast";
import { isNonEmpty } from "@/lib/utils";

type OrderPayload = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  productSlug?: string;
  background?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const payload = await parseJsonBody<OrderPayload>(request);

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (
    !isNonEmpty(payload.customerName) ||
    !isNonEmpty(payload.customerEmail) ||
    !isNonEmpty(payload.customerPhone) ||
    !isNonEmpty(payload.customerAddress) ||
    !isNonEmpty(payload.customerCity) ||
    !isNonEmpty(payload.productSlug) ||
    !isNonEmpty(payload.background)
  ) {
    return fail("VALIDATION_ERROR", "Missing required order fields.", 422);
  }

  try {
    assertPayfastSigningConfigured();
  } catch (err) {
    console.error("PayFast configuration:", err);
    return fail("PAYFAST_CONFIG", "Payment gateway is not configured.", 500);
  }

  const result = await createOrder({
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    customerAddress: payload.customerAddress,
    customerCity: payload.customerCity,
    productSlug: payload.productSlug,
    background: payload.background,
    notes: payload.notes ?? "",
  });

  if ("error" in result && result.error) {
    return fail(result.error, "The selected product could not be found or order creation failed.", 400);
  }

  const order = result.data;
  
  if (!order) {
    return fail("UNKNOWN_ERROR", "Order creation failed silently.", 500);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not configured.");
    return fail("CONFIG_ERROR", "Payment gateway is not configured.", 500);
  }

  const orderAccessToken = createOrderAccessToken(order.id);

  const payfastData: Record<string, string> = {
    merchant_id: payfastConfig.merchantId,
    merchant_key: payfastConfig.merchantKey,
    return_url: `${siteUrl}/order/${order.id}?token=${encodeURIComponent(orderAccessToken)}`,
    cancel_url: `${siteUrl}/checkout?slug=${order.productSlug}&cancel=true`,
    notify_url: `${siteUrl}/api/payfast/webhook`,
    name_first: payload.customerName.split(" ")[0] || payload.customerName,
    name_last: payload.customerName.split(" ").slice(1).join(" ") || "",
    email_address: payload.customerEmail,
    m_payment_id: order.id,
    amount: order.price.toFixed(2),
    item_name: `Frame Club - ${order.productSlug}`,
  };

  const signature = generatePayFastSignature(payfastData);
  payfastData.signature = signature;

  return ok(
    {
      order,
      orderAccessToken,
      payfastUrl: getPayFastUrl(),
      payfastData,
    },
    201
  );
}