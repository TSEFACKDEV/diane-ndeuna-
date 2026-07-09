// app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterConfirmation } from "@/lib/email";
import { newsletterSchema } from "@/lib/validation/newsletter";
import type { ApiErrorResponse } from "@/types/auth";
import * as yup from "yup";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = await newsletterSchema.validate(body, { abortEarly: false });

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      if (!existing.isActive) {
        // Réactiver l'abonné
        const reactivated = await prisma.newsletterSubscriber.update({
          where: { email: data.email.toLowerCase() },
          data: {
            isActive: true,
            unsubscribeToken: crypto.randomUUID(),
            fullName: data.fullName || existing.fullName,
          },
        });

        // Envoyer une nouvelle confirmation
        try {
          await sendNewsletterConfirmation({
            email: reactivated.email,
            fullName: reactivated.fullName,
            unsubscribeToken: reactivated.unsubscribeToken,
          });
        } catch (emailError) {
          console.error("Erreur envoi email confirmation:", emailError);
        }

        return NextResponse.json(
          { success: true, message: "Abonnement réactivé" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "Cette adresse e-mail est déjà abonnée" },
        { status: 409 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: data.email.toLowerCase(),
        fullName: data.fullName || null,
        unsubscribeToken: crypto.randomUUID(),
        isActive: true,
      },
    });

    // Envoyer l'email de confirmation
    try {
      await sendNewsletterConfirmation({
        email: subscriber.email,
        fullName: subscriber.fullName,
        unsubscribeToken: subscriber.unsubscribeToken,
      });
    } catch (emailError) {
      console.error("Erreur envoi email confirmation:", emailError);
      // On ne bloque pas la réponse, le subscriber est déjà en base
    }

    return NextResponse.json(
      { success: true, message: "Inscription réussie" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      const response: ApiErrorResponse = {
        error: "Données invalides",
        fieldErrors,
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.error("Erreur inscription newsletter:", error);
    return NextResponse.json(
      { error: "Erreur serveur, veuillez réessayer" },
      { status: 500 }
    );
  }
}