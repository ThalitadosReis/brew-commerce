import type { IShippingAddress } from "@/models/Order";
import type { OrderEmailDetails } from "@/types/email";

const renderShippingAddress = (shippingAddress?: IShippingAddress | null) => {
  if (!shippingAddress) return "";

  const parts = [
    shippingAddress.name,
    shippingAddress.line1,
    shippingAddress.line2,
    [shippingAddress.postal_code, shippingAddress.city]
      .filter(Boolean)
      .join(" ")
      .trim(),
    shippingAddress.state,
    shippingAddress.country,
  ]
    .filter((part) => part && part.trim().length > 0)
    .map((part) => part!.trim());

  if (parts.length === 0) return "";

  const lines = parts.map((part) => `<p style="margin: 0;">${part}</p>`).join("");

  return `
    <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Shipping Address</p>
      ${lines}
    </div>
  `;
};

export const buildOrderConfirmationHtml = (
  details: OrderEmailDetails
): string => {
  const {
    orderId,
    customerName,
    items,
    subtotal,
    shipping,
    total,
    orderDate,
    shippingAddress,
  } = details;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">
          ${item.quantity} x ${
        item.size || "default"
      } - CHF ${item.price.toFixed(2)}
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        CHF ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #000; color: #fff; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">BREW</h1>
          <p style="margin: 10px 0 0; font-size: 14px;">Premium Coffee</p>
        </div>

        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="margin-top: 0;">Order Confirmation</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! We've received your payment and are preparing your items for shipment.</p>

          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Order Number</p>
            <p style="margin: 0; font-family: monospace; font-size: 12px;">${orderId}</p>
          </div>

          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Order Date</p>
            <p style="margin: 0;">${orderDate}</p>
          </div>

          ${renderShippingAddress(shippingAddress)}

          <h3 style="margin-top: 30px;">Order Details</h3>
          <table style="width: 100%; background-color: #fff; border: 1px solid #e5e7eb; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Subtotal</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">CHF ${subtotal.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Shipping</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${
                shipping === 0 ? "Free" : `CHF ${shipping.toFixed(2)}`
              }</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; font-size: 18px;">Total</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px;">CHF ${total.toFixed(
                2
              )}</td>
            </tr>
          </table>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            You will receive another email with tracking information once your order ships.
          </p>
        </div>

        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>If you have any questions, please contact us at support@brew.com</p>
          <p>&copy; 2024 BREW. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
};

export const buildAdminNotificationHtml = (
  details: OrderEmailDetails
): string => {
  const {
    orderId,
    customerName,
    customerEmail,
    items,
    subtotal,
    shipping,
    total,
    orderDate,
    shippingAddress,
  } = details;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${
        item.name
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${
        item.size || "default"
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">CHF ${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #000; color: #fff; padding: 20px;">
          <h1 style="margin: 0; font-size: 24px;">🎉 New Order Received</h1>
        </div>

        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="margin-top: 0;">Order #${orderId.slice(0, 8)}</h2>

          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #000;">
            <p style="margin: 0 0 8px;"><strong>Customer:</strong> ${customerName}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${customerEmail}</p>
            <p style="margin: 0;"><strong>Order Date:</strong> ${orderDate}</p>
          </div>

          ${renderShippingAddress(shippingAddress)}

          <h3>Order Items</h3>
          <table style="width: 100%; background-color: #fff; border: 1px solid #e5e7eb; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Size</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 12px; border-top: 2px solid #e5e7eb;">Subtotal</td>
                <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;">CHF ${subtotal.toFixed(
                  2
                )}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 12px;">Shipping</td>
                <td style="padding: 12px; text-align: right;">${
                  shipping === 0 ? "Free" : `CHF ${shipping.toFixed(2)}`
                }</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 12px; font-weight: bold; font-size: 16px; border-top: 2px solid #e5e7eb;">Total</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px; border-top: 2px solid #e5e7eb;">CHF ${total.toFixed(
                  2
                )}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">⚡ Action required: Process this order in the admin dashboard.</p>
          </div>
        </div>

        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>This is an automated notification from your BREW store.</p>
        </div>
      </body>
    </html>
  `;
};
