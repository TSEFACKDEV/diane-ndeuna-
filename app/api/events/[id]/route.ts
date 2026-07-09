// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import * as yup from "yup";
import { EventStatus } from "@/lib/generated/prisma/browser";


const eventUpdateSchema = yup.object({
  titleFr: yup.string().trim().optional(),
  titleEn: yup.string().trim().optional(),
  descriptionFr: yup.string().trim().optional(),
  descriptionEn: yup.string().trim().optional(),
  location: yup.string().trim().optional(),
  startDate: yup.date().optional(),
  endDate: yup.date().optional(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
  status: yup.mixed<EventStatus>().oneOf(Object.values(EventStatus)).optional(),
  isFeatured: yup.boolean().optional(),
  registrationUrl: yup.string().trim().url().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
  }

  return NextResponse.json(event, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const data = await eventUpdateSchema.validate(body, { abortEarly: false });

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      return NextResponse.json({ error: "Données invalides", fieldErrors }, { status: 400 });
    }
    console.error("Erreur mise à jour événement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression événement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}