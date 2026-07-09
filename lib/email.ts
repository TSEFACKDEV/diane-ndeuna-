// lib/email.ts
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "Diane NDEUNA <contact@dianendeuna.com>";

if (!SMTP_USER || !SMTP_PASS) {
  console.warn("⚠️ Variables SMTP non configurées. Les emails ne seront pas envoyés.");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

export interface ContactEmailData {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', sans-serif; background: #FAF7F2; padding: 40px; color: #3D3D3D; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .header { border-bottom: 2px solid #C9A96E; padding-bottom: 20px; margin-bottom: 24px; }
        .title { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #6B1E3C; margin: 0; }
        .field { margin-bottom: 16px; }
        .field-label { font-weight: 600; font-size: 13px; color: #6B1E3C; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px; }
        .field-value { font-size: 15px; color: #3D3D3D; background: #FAF7F2; padding: 8px 12px; border-radius: 6px; }
        .message-box { background: #FAF7F2; padding: 16px; border-radius: 8px; border-left: 4px solid #C9A96E; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E8E0D6; font-size: 12px; color: #6B6B6B; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">Nouveau message de contact</h1>
        </div>
        <div class="field">
          <span class="field-label">Nom complet</span>
          <div class="field-value">${data.fullName}</div>
        </div>
        <div class="field">
          <span class="field-label">Email</span>
          <div class="field-value">${data.email}</div>
        </div>
        ${data.phone ? `<div class="field"><span class="field-label">Téléphone</span><div class="field-value">${data.phone}</div></div>` : ""}
        ${data.organization ? `<div class="field"><span class="field-label">Organisation</span><div class="field-value">${data.organization}</div></div>` : ""}
        <div class="field">
          <span class="field-label">Sujet</span>
          <div class="field-value">${data.subject}</div>
        </div>
        <div class="field">
          <span class="field-label">Message</span>
          <div class="message-box">${data.message.replace(/\n/g, "<br>")}</div>
        </div>
        <div class="footer">
          Ce message a été envoyé depuis le site diane-ndeuna.com
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: SMTP_FROM,
    to: "contact@heritage-expertise.com",
    cc: "contact@dianendeuna.com",
    replyTo: data.email,
    subject: `[Site] ${data.subject}`,
    text: `
      Nom: ${data.fullName}
      Email: ${data.email}
      Téléphone: ${data.phone || "Non renseigné"}
      Organisation: ${data.organization || "Non renseignée"}
      Sujet: ${data.subject}
      Message: ${data.message}
    `,
    html,
  });
}

export interface NewsletterConfirmationData {
  email: string;
  fullName?: string | null;
  unsubscribeToken: string;
}

export async function sendNewsletterConfirmation(
  data: NewsletterConfirmationData
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', sans-serif; background: #FAF7F2; padding: 40px; color: #3D3D3D; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .header { border-bottom: 2px solid #C9A96E; padding-bottom: 20px; margin-bottom: 24px; }
        .title { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #6B1E3C; margin: 0; }
        .greeting { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #6B1E3C; }
        .content { font-size: 15px; line-height: 1.7; color: #3D3D3D; }
        .button { display: inline-block; background: #6B1E3C; color: #FFFFFF !important; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E8E0D6; font-size: 12px; color: #6B6B6B; text-align: center; }
        .unsubscribe { font-size: 12px; color: #6B6B6B; margin-top: 16px; }
        .unsubscribe a { color: #6B1E3C; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">Diane NDEUNA — Newsletter</h1>
        </div>
        <p class="greeting">Bonjour${data.fullName ? " " + data.fullName : ""},</p>
        <div class="content">
          <p>Merci de vous être abonné(e) à la newsletter de Diane NDEUNA !</p>
          <p>Vous recevrez chaque mois :</p>
          <ul>
            <li>L'actualité de l'entrepreneuriat féminin en Afrique</li>
            <li>Des conseils exclusifs de Diane NDEUNA</li>
            <li>Les histoires inspirantes de femmes leaders</li>
            <li>Les appels à projets et consultations</li>
            <li>Le calendrier des événements à venir</li>
          </ul>
          <p>Nous sommes ravis de vous compter parmi notre communauté.</p>
          <a href="${appUrl}" class="button">Découvrir le site</a>
        </div>
        <div class="unsubscribe">
          <p>Vous pouvez vous désinscrire à tout moment en cliquant sur <a href="${appUrl}/api/newsletter/unsubscribe?token=${data.unsubscribeToken}">ce lien</a>.</p>
        </div>
        <div class="footer">
          © 2026 — Diane NDEUNA — Tous droits réservés.
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: SMTP_FROM,
    to: data.email,
    subject: "✅ Bienvenue dans la newsletter de Diane NDEUNA",
    text: `
      Merci de vous être abonné(e) à la newsletter de Diane NDEUNA !
      Vous recevrez chaque mois : actualités, conseils, histoires, appels à projets et événements.
      Pour vous désinscrire : ${appUrl}/api/newsletter/unsubscribe?token=${data.unsubscribeToken}
    `,
    html,
  });
}

export interface NewsletterBroadcastData {
  subject: string;
  content: string;
  recipients: Array<{ email: string; fullName?: string | null }>;
  fromName?: string;
}

export async function sendNewsletterBroadcast(
  data: NewsletterBroadcastData
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const recipient of data.recipients) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', sans-serif; background: #FAF7F2; padding: 40px; color: #3D3D3D; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
            .header { border-bottom: 2px solid #C9A96E; padding-bottom: 20px; margin-bottom: 24px; }
            .title { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #6B1E3C; margin: 0; }
            .content { font-size: 15px; line-height: 1.8; color: #3D3D3D; }
            .content p { margin-bottom: 16px; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E8E0D6; font-size: 12px; color: #6B6B6B; text-align: center; }
            .signature { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #6B1E3C; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Diane NDEUNA — Newsletter</h1>
            </div>
            <div class="content">
              ${data.content}
            </div>
            <p class="signature">Diane NDEUNA</p>
            <div class="footer">
              © 2026 — Diane NDEUNA — Tous droits réservés.<br>
              Vous recevez cet email car vous êtes inscrit(e) à notre newsletter.
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: data.fromName ? `${data.fromName} <${SMTP_FROM}>` : SMTP_FROM,
        to: recipient.email,
        subject: data.subject,
        text: data.content.replace(/<[^>]*>/g, ""),
        html,
      });

      success++;
    } catch (error) {
      console.error(`Erreur envoi à ${recipient.email}:`, error);
      failed++;
    }
  }

  return { success, failed };
}