import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message }: ContactFormData =
      await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate field types
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.error("Missing email configuration environment variables");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea;">
          <h2 style="color: #1f2937; margin-bottom: 10px;">New Contact Form Submission</h2>
          <p style="margin: 4px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 4px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 8px 0 4px;"><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 10px;">${message.replace(
            /\n/g,
            "<br>"
          )}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;" />
          <p style="font-size: 12px; color: #777;">This email was generated automatically by Brew Commerce Contact Form.</p>
        </div>
      `,
      replyTo: email,
    };

    // Email to user (confirmation)
    const userMailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting Brew Commerce",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea;">
          <h2 style="color: #1f2937; margin-bottom: 10px;">Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you within one business day.</p>
          <div style="margin: 16px 0; padding: 12px; background: #f3f4f6; border-radius: 4px;">
            <strong>Your message:</strong>
            <p style="margin-top: 6px;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p>Best regards,<br><strong>The Brew Commerce Team</strong></p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;" />
          <p style="font-size: 12px; color: #777;">If you did not submit this form, please ignore this email.</p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
