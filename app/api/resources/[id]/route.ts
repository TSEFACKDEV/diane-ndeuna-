// app/api/resources/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import * as yup from "yup";
import { ResourceType } from "@/lib/generated/prisma/browser";


const resourceUpdateSchema = yup.object({
  type: yup.mixed<ResourceType>().oneOf(Object.values(ResourceType)).optional(),
  titleFr: yup.string().trim().optional(),
  titleEn: yup.string().trim().optional(),
  descriptionFr: yup.string().trim().optional(),
  descriptionEn: yup.string().trim().optional(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
  fileUrl: yup.string().trim().url().optional().nullable(),
  externalUrl: yup.string().trim().url().optional().nullable(),
  author: yup.string().trim().optional().nullable(),
  isFeatured: yup.boolean().optional(),
});

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
    const data = await resourceUpdateSchema.validate(body, { abortEarly: false });

    const updated = await prisma.resource.update({
      where: { id },
      data,
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
    console.error("Erreur mise à jour ressource:", error);
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
    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression ressource:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}