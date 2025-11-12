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

  const lines = parts
    .map((part) => `<p style="margin: 0;">${part}</p>`)
    .join("");

  return `
    <div style="background: #ffffff; padding: 24px; margin: 24px 0; border: 1px solid #e3e3e3;">
      <p style="margin: 0 0 12px; color: #5e5e5e; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">
        Shipping Address
      </p>
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
          <td style="padding: 18px 0; border-bottom: 1px solid #e0e0e0;">
            <div style="font-weight: 600; color: #151515;">${item.name}</div>
            <div style="font-size: 13px; color: #5d5d5d; letter-spacing: 0.03em;">
              ${item.quantity} × ${
        item.size || "default"
      } · CHF ${item.price.toFixed(2)}
            </div>
          </td>
          <td style="padding: 18px 0; border-bottom: 1px solid #e0e0e0; text-align: right; color: #151515;">
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
      <body style="margin: 0; padding: 40px 0; background: #f4f4f4; font-family: 'Helvetica Neue', 'Segoe UI', sans-serif; color: #1b1b1b;">
        <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 640px; margin: 0 auto; background: #ffffff; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);">
          <tr>
            <td style="background: linear-gradient(135deg, #040404, #1b1b1b); padding: 48px 28px; text-align: center; color: #f6f6f6;">
              <p style="margin: 0; letter-spacing: 0.45em; font-size: 12px; text-transform: uppercase; color: rgba(255,255,255,0.65);">
                Brew
              </p>
              <h1 style="margin: 16px 0 8px; font-size: 32px; letter-spacing: 0.24em; font-weight: 500;">ORDER</h1>
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.78);">Your curated selection is on its way.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 48px 52px 12px;">
              <p style="margin: 0 0 4px; font-size: 13px; letter-spacing: 0.08em; color: #5e5e5e; text-transform: uppercase;">Hello ${customerName},</p>
              <h2 style="margin: 0 0 16px; font-size: 26px; font-weight: 500;">Thank you for choosing Brew.</h2>
              <p style="margin: 0 0 32px; color: #4c4c4c; font-size: 15px; line-height: 1.7;">
                We’ve carefully packed your order and will send tracking details the moment it leaves our roastery.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 18px 0;">
                    <p style="margin: 0 0 4px; color: #5e5e5e; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;">Order No.</p>
                    <p style="margin: 0; font-size: 18px; letter-spacing: 0.08em; color: #151515;">${orderId}</p>
                  </td>
                  <td style="padding: 18px 0; text-align: right;">
                    <p style="margin: 0 0 4px; color: #5e5e5e; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;">Date</p>
                    <p style="margin: 0; font-size: 16px; color: #151515;">${orderDate}</p>
                  </td>
                </tr>
              </table>

              ${renderShippingAddress(shippingAddress)}

              <div style="margin: 36px 0 16px;">
                <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #5e5e5e;">
                  Order Details
                </p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;">
              </div>

              <div style="border: 1px solid #e0e0e0; overflow: hidden;">
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse: collapse;">
                  ${itemsHtml}
                  <tr>
                    <td style="padding: 14px 0; border-top: 1px solid #e0e0e0; color: #4c4c4c;">Subtotal</td>
                    <td style="padding: 14px 0; border-top: 1px solid #e0e0e0; text-align: right; font-weight: 500; color: #111111;">CHF ${subtotal.toFixed(
                      2
                    )}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #4c4c4c;">Shipping</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: 500; color: #111111;">${
                      shipping === 0
                        ? "Complimentary"
                        : `CHF ${shipping.toFixed(2)}`
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 18px 0; border-top: 1px solid #e0e0e0; color: #111111; font-size: 18px; font-weight: 600;">Total</td>
                    <td style="padding: 18px 0; border-top: 1px solid #e0e0e0; text-align: right; font-size: 20px; font-weight: 600; color: #000000;">CHF ${total.toFixed(
                      2
                    )}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 40px; background: #f7f7f7; text-align: center; color: #5f5f5f; font-size: 12px;">
              <p style="margin: 0 0 4px;">Need assistance? <a href="mailto:support@brew.com" style="color: #111111; text-decoration: none;">support@brew.com</a></p>
              <p style="margin: 0;">© ${new Date().getFullYear()} Brew Commerce · Crafted with care</p>
            </td>
          </tr>
        </table>
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
        </div>

        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>This is an automated notification from your BREW store.</p>
        </div>
      </body>
    </html>
  `;
};
