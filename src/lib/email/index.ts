import { createTransport } from "nodemailer";
import type { OrderEmailDetails } from "@/types/email";
import {
  buildOrderConfirmationHtml,
  buildAdminNotificationHtml,
} from "./templates";

interface SendOrderEmailParams {
  to: string;
  orderDetails: OrderEmailDetails;
}

const transporter = createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderConfirmationEmail({
  to,
  orderDetails,
}: SendOrderEmailParams) {
  const html = buildOrderConfirmationHtml(orderDetails);

  await transporter.sendMail({
    from: `"BREW Coffee" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Order Confirmation - #${orderDetails.orderId.slice(0, 8)}`,
    html,
  });
}

export async function sendAdminOrderNotification({
  orderDetails,
}: Omit<SendOrderEmailParams, "to">) {
  const adminEmail = process.env.EMAIL_TO || process.env.EMAIL_USER;
  if (!adminEmail) {
    console.warn("Admin email not configured");
    return;
  }

  const html = buildAdminNotificationHtml(orderDetails);

  await transporter.sendMail({
    from: `"BREW Admin" <${process.env.EMAIL_FROM}>`,
    to: adminEmail,
    subject: `🎉 New Order - #${orderDetails.orderId.slice(0, 8)} - CHF ${orderDetails.total.toFixed(
      2
    )}`,
    html,
  });
}
