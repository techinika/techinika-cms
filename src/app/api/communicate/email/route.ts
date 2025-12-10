import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      receiver,
      cc = [],
      subject = "Application Update",
      company = "Our Company",
      name = "Applicant",
      message,
    } = body;

    if (!receiver || !message) {
      return NextResponse.json(
        { error: "Receiver and message are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${company}" <${process.env.EMAIL_USERNAME}>`,
      to: receiver,
      cc: cc.length ? cc : undefined,
      subject,
      html: `
        <html>
        <body style="font-family: Arial; background: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin:auto; background:white; border-radius:8px; overflow:hidden;">

            <div style="background:#3182ce; padding:20px; color:white; text-align:center;">
              <h2 style="margin:0; font-size:22px;">${company}</h2>
            </div>

            <div style="padding:20px; color:#374151; line-height:1.6;">
              <p>Dear <strong>${name}</strong>,</p>

              <p>${message}</p>

              <p>Best regards,<br />${company} Team</p>
            </div>

            <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
              © ${new Date().getFullYear()} Techinika. All rights reserved.  
              <br />
              <a href="https://techinika.com/privacy" style="color:#2563eb;">Privacy Policy</a>
            </div>

          </div>
        </body>
      </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
