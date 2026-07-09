// app/api/contact/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";
import { ContactStatus } from "@/lib/generated/prisma/browser";
import { getCurrentUser } from "@/lib/session";


const contactSchema = yup.object({
  fullName: yup.string().trim().min(2).required(),
  email: yup.string().trim().email().required(),
  phone: yup.string().trim().optional(),
  organization: yup.string().trim().optional(),
  subject: yup.string().trim().min(5).required(),
  message: yup.string().trim().min(20).required(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = await contactSchema.validate(body, { abortEarly: false });

    // Sauvegarde en base
    await prisma.contactMessage.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        organization: data.organization || null,
        subject: data.subject,
        message: data.message,
        status: ContactStatus.NEW,
      },
    });

    // Envoi d'email via Nodemailer
    try {
      await sendContactEmail(data);
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      // On ne bloque pas la réponse, le message est déjà en base
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      return NextResponse.json({ error: "Données invalides", fieldErrors }, { status: 400 });
    }
    console.error("Erreur contact:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// app/api/contact/route.ts (ajouter la méthode GET en plus de POST)
// A rajouter dans le fichier existant app/api/contact/route.ts

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const statusParam = request.nextUrl.searchParams.get("status");
  const where = statusParam ? { status: statusParam as ContactStatus } : {};

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages, { status: 200 });
}

// PATCH pour mettre à jour le statut (admin)
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID et status requis" }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Erreur mise à jour statut contact:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}