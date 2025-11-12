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

    const messageHtml = message.replace(/\n/g, "<br>");

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin: 0; padding: 36px 0; background: #f2f2f2; font-family: 'Helvetica Neue', 'Segoe UI', sans-serif; color: #1c1c1c;">
            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 640px; margin: 0 auto; background: #ffffff; overflow: hidden; box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);">
              <tr>
                <td style="background: linear-gradient(135deg, #050505, #1a1a1a); padding: 40px 32px; color: #f6f6f6; text-align: center;">
                  <p style="margin: 0; letter-spacing: 0.4em; font-size: 11px; text-transform: uppercase; color: rgba(255,255,255,0.65);">Brew commerce</p>
                  <h1 style="margin: 16px 0 4px; font-size: 30px; font-weight: 500; letter-spacing: 0.22em;">NEW INQUIRY</h1>
                  <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.75);">A guest just reached out through your contact form.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 44px 48px;">
                  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="margin-bottom: 28px;">
                    <tr>
                      <td style="padding-bottom: 20px;">
                        <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #5e5e5e;">From</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #111111;">${name}</p>
                        <p style="margin: 4px 0 0; color: #3c3c3c;">${email}</p>
                      </td>
                      <td style="padding-bottom: 20px; text-align: right;">
                        <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #5e5e5e;">Subject</p>
                        <p style="margin: 0; font-size: 16px; color: #111111;">${subject}</p>
                      </td>
                    </tr>
                  </table>
                  <div style="padding: 28px; border: 1px solid #dcdcdc; background: #fafafa;">
                    <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.4em; text-transform: uppercase; color: #5e5e5e;">Message</p>
                    <p style="margin: 0; line-height: 1.7; color: #2b2b2b;">${messageHtml}</p>
                  </div>
                  <p style="margin: 28px 0 0; font-size: 13px; color: #5e5e5e;">
                    Reply directly to this email to continue the conversation.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px 40px; background: #f7f7f7; text-align: center; color: #5e5e5e; font-size: 12px;">
                  <p style="margin: 0 0 4px;">This alert was generated by the Brew Commerce contact form.</p>
                  <p style="margin: 0;">${new Date().getFullYear()} © Brew Commerce</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      replyTo: email,
    };

    // Email to user (confirmation)
    const userMailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting Brew Commerce",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin: 0; padding: 36px 0; background: #f4f4f4; font-family: 'Helvetica Neue', 'Segoe UI', sans-serif; color: #1c1c1c;">
            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 620px; margin: 0 auto; background: #ffffff; overflow: hidden; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);">
              <tr>
                <td style="background: linear-gradient(135deg, #050505, #1a1a1a); padding: 40px 34px; text-align: center; color: #f6f6f6;">
                  <p style="margin: 0; letter-spacing: 0.4em; font-size: 11px; text-transform: uppercase; color: rgba(255,255,255,0.65);">Brew commerce</p>
                  <h1 style="margin: 16px 0 6px; font-size: 30px; font-weight: 500; letter-spacing: 0.24em;">WE HEARD YOU</h1>
                  <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.78);">Thanks for taking a moment to connect.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 44px 46px;">
                  <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase; color: #5e5e5e;">Hello ${name}</p>
                  <h2 style="margin: 0 0 18px; font-size: 26px; font-weight: 500;">Thanks for writing to us.</h2>
                  <p style="margin: 0 0 26px; color: #4c4c4c; font-size: 15px; line-height: 1.7;">
                    Your note is already in the hands of our concierge team. Expect a thoughtful reply within one business day.
                  </p>
                  <div style="padding: 24px; border: 1px solid #dcdcdc; background: #fafafa;">
                    <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.35em; text-transform: uppercase; color: #5e5e5e;">Your Message</p>
                    <p style="margin: 0; line-height: 1.7; color: #2b2b2b;">${messageHtml}</p>
                  </div>
                  <p style="margin: 30px 0 0; color: #5e5e5e; font-size: 13px;">
                    If you need to add anything, simply reply to this email and we’ll append it to your request.
                  </p>
                  <p style="margin: 18px 0 0; font-weight: 600; color: #111111;">— The Brew Commerce Team</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 26px 38px; background: #f7f7f7; text-align: center; color: #5e5e5e; font-size: 12px;">
                  <p style="margin: 0 0 4px;">Received in error? Please ignore this email.</p>
                  <p style="margin: 0;">${new Date().getFullYear()} © Brew Commerce · Crafted with care</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
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
