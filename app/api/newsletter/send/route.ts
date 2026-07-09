// app/api/newsletter/send/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { sendNewsletterBroadcast } from "@/lib/email";
import * as yup from "yup";

const broadcastSchema = yup.object({
  subject: yup.string().trim().required("Le sujet est requis"),
  content: yup.string().trim().required("Le contenu est requis"),
  fromName: yup.string().trim().optional(),
  testEmail: yup.string().trim().email().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = await broadcastSchema.validate(body, { abortEarly: false });

    // Récupérer les abonnés actifs
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "Aucun abonné actif à qui envoyer la newsletter" },
        { status: 400 }
      );
    }

    // Si un email de test est fourni, n'envoyer qu'à celui-ci
    const recipients = data.testEmail
      ? [{ email: data.testEmail, fullName: null }]
      : subscribers.map((sub) => ({
          email: sub.email,
          fullName: sub.fullName,
        }));

    const result = await sendNewsletterBroadcast({
      subject: data.subject,
      content: data.content,
      recipients,
      fromName: data.fromName || "Diane NDEUNA",
    });

    return NextResponse.json(
      {
        success: true,
        sent: result.success,
        failed: result.failed,
        total: recipients.length,
        testMode: !!data.testEmail,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      return NextResponse.json({ error: "Données invalides", fieldErrors }, { status: 400 });
    }
    console.error("Erreur envoi newsletter:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}