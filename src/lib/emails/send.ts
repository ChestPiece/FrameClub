import { Resend } from "resend";
import {
  orderConfirmationTemplate,
  statusUpdateTemplate,
  adminNewOrderTemplate,
} from "./templates";
import type { OrderRecord } from "../db/types";
import { ORDER_STATUS_LABELS } from "../db/labels";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = "Frame Club <orders@frameclub.pk>";

function requireAdminEmail(): string {
  const raw = process.env.ADMIN_EMAIL?.trim();
  if (!raw) {
    throw new Error("ADMIN_EMAIL must be set to send admin notifications.");
  }
  return raw;
}

export async function sendOrderConfirmation(order: OrderRecord, productName: string) {
  if (!resend) {
    console.log("Mock sending order confirmation to:", order.customerEmail);
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Order Received: ${order.orderNumber} - Frame Club`,
      html: orderConfirmationTemplate(order, productName),
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
    return { success: false, error };
  }
}

export async function sendStatusUpdate(order: OrderRecord, productName: string) {
  if (!resend) {
    console.log("Mock sending status update to:", order.customerEmail, order.orderStatus);
    return { success: true };
  }

  const statusLabel = ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Order Update: ${statusLabel} - Frame Club`,
      html: statusUpdateTemplate(order, productName, statusLabel),
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send status update:", error);
    return { success: false, error };
  }
}

export async function sendAdminNotification(order: OrderRecord, productName: string) {
  if (!resend) {
    console.log("Mock sending admin notification for order:", order.orderNumber);
    return { success: true };
  }

  try {
    const adminEmail = requireAdminEmail();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `New Order: ${order.orderNumber}`,
      html: adminNewOrderTemplate(order, productName),
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error };
  }
}