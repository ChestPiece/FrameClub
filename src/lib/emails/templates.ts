import type { ContactSubmission, OrderRecord } from "../db/types";

const baseStyles = `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0F0D0D; color: #F0EDED; margin: 0; padding: 20px; }
  .container { max-w-[600px] margin: 0 auto; background-color: #1A1715; border: 1px solid #3D3030; padding: 40px; }
  h1 { font-family: Impact, sans-serif; text-transform: uppercase; letter-spacing: 2px; font-size: 32px; margin-top: 0; color: #F0EDED; }
  h2 { font-size: 20px; text-transform: uppercase; color: #7A7070; letter-spacing: 1px; border-bottom: 1px solid #3D3030; padding-bottom: 10px; margin-top: 30px; }
  p { font-size: 16px; line-height: 1.6; color: #d1d1d1; }
  .details-box { background-color: #030303; border: 1px solid #3D3030; padding: 20px; margin-top: 20px; }
  .detail-row { margin-bottom: 10px; font-size: 14px; }
  .detail-label { color: #7A7070; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; display: block; margin-bottom: 4px; }
  .detail-value { color: #F0EDED; font-weight: bold; }
  .footer { margin-top: 40px; padding-top: 20px; border-t: 1px solid #3D3030; font-size: 12px; color: #7A7070; text-align: center; text-transform: uppercase; letter-spacing: 2px; }
  .accent { color: #D4B8B8; }
`;

function wrapEmail(content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          ${content}
          <div class="footer">
            © ${new Date().getFullYear()} The Frame Club. Engineered Perfection.
          </div>
        </div>
      </body>
    </html>
  `;
}

export function orderConfirmationTemplate(order: OrderRecord, productName: string) {
  const content = `
    <p class="detail-label" style="margin-bottom: 20px;">Order Confirmation</p>
    <h1>Order Received</h1>
    <p>Hi ${order.customerName},</p>
    <p>Your request has been captured. We are preparing to build your custom frame.</p>
    
    <div class="details-box">
      <div class="detail-row">
        <span class="detail-label">Order Number</span>
        <span class="detail-value accent">${order.orderNumber}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Car Model</span>
        <span class="detail-value">${productName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Background Design</span>
        <span class="detail-value">${order.customization.background}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Total Paid</span>
        <span class="detail-value">Rs. ${order.price.toLocaleString("en-PK")}</span>
      </div>
    </div>

    <h2>Delivery Details</h2>
    <div class="details-box">
      <div class="detail-row">
        <span class="detail-label">Address</span>
        <span class="detail-value">${order.customerAddress}, ${order.customerCity}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Estimated Time</span>
        <span class="detail-value">7-10 working days</span>
      </div>
    </div>
  `;
  return wrapEmail(content);
}

export function statusUpdateTemplate(order: OrderRecord, productName: string, statusLabel: string) {
  const content = `
    <p class="detail-label" style="margin-bottom: 20px;">Order Status Update</p>
    <h1>Order ${statusLabel}</h1>
    <p>Hi ${order.customerName},</p>
    <p>The status of your frame order <strong>${order.orderNumber}</strong> for the <strong>${productName}</strong> has been updated to:</p>
    
    <div class="details-box" style="text-align: center; padding: 30px;">
      <span class="detail-value accent" style="font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">
        ${statusLabel}
      </span>
    </div>

    <p style="margin-top: 30px;">If you have any questions, you can reply directly to this email.</p>
  `;
  return wrapEmail(content);
}

export function customFrameInquiryTemplate(submission: ContactSubmission) {
  const meta = submission.meta ?? {};
  const row = (label: string, value: string | undefined | null) =>
    value
      ? `<div class="detail-row"><span class="detail-label">${label}</span><span class="detail-value">${value}</span></div>`
      : "";
  const content = `
    <p class="detail-label" style="margin-bottom: 20px;">Football Frame Inquiry</p>
    <h1>New Custom Brief</h1>
    <div class="details-box">
      <div class="detail-row">
        <span class="detail-label">From</span>
        <span class="detail-value">${submission.name} &lt;${submission.email}&gt;</span>
      </div>
      ${row("Team", meta.team ?? null)}
      ${row("Player", meta.playerName ?? null)}
      ${row("Jersey #", meta.jerseyNumber ?? null)}
      ${row("Frame size", meta.frameSize ?? null)}
      ${row("Reference", meta.referenceUrl ?? null)}
    </div>
    <h2>Brief</h2>
    <div class="details-box">
      <pre class="detail-value" style="white-space: pre-wrap; font-family: inherit; margin: 0;">${submission.message}</pre>
    </div>
  `;
  return wrapEmail(content);
}

export function adminNewOrderTemplate(order: OrderRecord, productName: string) {
  const content = `
    <p class="detail-label" style="margin-bottom: 20px;">Admin Alert</p>
    <h1>New Order: ${order.orderNumber}</h1>
    
    <div class="details-box">
      <div class="detail-row">
        <span class="detail-label">Customer</span>
        <span class="detail-value">${order.customerName} (${order.customerEmail} / ${order.customerPhone})</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Delivery Address</span>
        <span class="detail-value">${order.customerAddress}, ${order.customerCity}</span>
      </div>
    </div>

    <h2>Order Configuration</h2>
    <div class="details-box">
      <div class="detail-row">
        <span class="detail-label">Car Model</span>
        <span class="detail-value accent">${productName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Background</span>
        <span class="detail-value">${order.customization.background}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Notes</span>
        <span class="detail-value">${order.customization.notes || "None"}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value">${order.paymentStatus.toUpperCase()} / ${order.orderStatus.toUpperCase()}</span>
      </div>
    </div>
  `;
  return wrapEmail(content);
}