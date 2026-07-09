// app/api/resources/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { ApiErrorResponse } from "@/types/auth";
import * as yup from "yup";
import { ResourceType } from "@/lib/generated/prisma/enums";


const resourceCreateSchema = yup.object({
  type: yup.mixed<ResourceType>().oneOf(Object.values(ResourceType)).required(),
  titleFr: yup.string().trim().required(),
  titleEn: yup.string().trim().required(),
  descriptionFr: yup.string().trim().required(),
  descriptionEn: yup.string().trim().required(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
  fileUrl: yup.string().trim().url().optional().nullable(),
  externalUrl: yup.string().trim().url().optional().nullable(),
  author: yup.string().trim().optional().nullable(),
  isFeatured: yup.boolean().optional(),
});

// GET (liste avec filtre type)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const typeParam = request.nextUrl.searchParams.get("type");
  const where = typeParam && typeParam !== "ALL" ? { type: typeParam as ResourceType } : {};

  const resources = await prisma.resource.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources, { status: 200 });
}

// POST (création, admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    const response: ApiErrorResponse = { error: "Non autorisé" };
    return NextResponse.json(response, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = await resourceCreateSchema.validate(body, { abortEarly: false });

    const resource = await prisma.resource.create({
      data: {
        type: data.type,
        titleFr: data.titleFr,
        titleEn: data.titleEn,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        coverImageUrl: data.coverImageUrl ?? null,
        fileUrl: data.fileUrl ?? null,
        externalUrl: data.externalUrl ?? null,
        author: data.author ?? null,
        isFeatured: data.isFeatured ?? false,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      return NextResponse.json({ error: "Données invalides", fieldErrors }, { status: 400 });
    }
    console.error("Erreur création ressource:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}