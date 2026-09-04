import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const RECIPIENT_EMAIL = "pacxoneinternational@gmail.com";

function createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
}

function getInquiryDetails({ name, company, phone, email, productName, message }) {
    return [
        `Name: ${name}`,
        `Company: ${company || "N/A"}`,
        `Phone: ${phone || "N/A"}`,
        `Email: ${email}`,
        `Product: ${productName || "N/A"}`,
        "",
        "Message:",
        message,
    ].join("\n");
}

export async function sendQuoteNotification({
    name,
    company,
    phone,
    email,
    productName,
    message,
}) {
    const transporter = createTransporter();
    if (!transporter) {
        return;
    }

    const user = process.env.SMTP_USER;

    const subject = productName
        ? `New quote request: ${productName}`
        : "New quote request from website";

    const text = [
        "New website inquiry received.",
        "",
        getInquiryDetails({ name, company, phone, email, productName, message }),
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

export async function sendCustomerConfirmation({
    name,
    email,
    productName,
    message,
}) {
    const transporter = createTransporter();
    if (!transporter) {
        return;
    }

    const productText = productName || "your requested products";
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        replyTo: RECIPIENT_EMAIL,
        subject: "We received your inquiry — Pacxone International",
        text: [
            `Hello ${name},`,
            "",
            `Thank you for contacting Pacxone International about ${productText}.`,
            "We have received your inquiry and our team will respond within one business day.",
            "",
            "Your message:",
            message,
            "",
            "Pacxone International",
        ].join("\n"),
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f;">
        <h2>Thank you for contacting Pacxone International</h2>
        <p>Hello ${name},</p>
        <p>We received your inquiry about <strong>${productText}</strong>.</p>
        <p>Our team will respond within one business day.</p>
        <p><strong>Your message:</strong></p>
        <div style="padding: 12px; background: #f5f5f5; border-radius: 8px;">${message.replace(/\n/g, "<br />")}</div>
        <p>Pacxone International</p>
      </div>
    `,
    });
}
