import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const RECIPIENT_EMAIL = "pacxoneinternational@gmail.com";

export async function sendQuoteNotification({
    name,
    company,
    phone,
    email,
    productName,
    message,
}) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });

    const subject = productName
        ? `New quote request: ${productName}`
        : "New quote request from website";

    const text = [
        "New website inquiry received.",
        "",
        `Name: ${name}`,
        `Company: ${company || "N/A"}`,
        `Phone: ${phone || "N/A"}`,
        `Email: ${email}`,
        `Product: ${productName || "N/A"}`,
        "",
        "Message:",
        message,
    ].join("\n");

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f;">
      <h2 style="margin-bottom: 12px;">New website inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || "N/A"}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Product:</strong> ${productName || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 12px; background: #f5f5f5; border-radius: 8px;">${message.replace(/\n/g, "<br />")}</div>
    </div>
  `;

    await transporter.sendMail({
        from: user,
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject,
        text,
        html,
    });
}
