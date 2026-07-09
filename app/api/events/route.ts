// app/api/events/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import * as yup from "yup";
import { EventStatus } from "@/lib/generated/prisma/enums";


const eventCreateSchema = yup.object({
  titleFr: yup.string().trim().required(),
  titleEn: yup.string().trim().required(),
  descriptionFr: yup.string().trim().required(),
  descriptionEn: yup.string().trim().required(),
  location: yup.string().trim().required(),
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
  status: yup.mixed<EventStatus>().oneOf(Object.values(EventStatus)).default(EventStatus.UPCOMING),
  isFeatured: yup.boolean().optional(),
  registrationUrl: yup.string().trim().url().optional().nullable(),
});

// GET (liste avec filtres)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const statusParam = request.nextUrl.searchParams.get("status");
  const where = statusParam && statusParam !== "ALL" ? { status: statusParam as EventStatus } : {};

  const events = await prisma.event.findMany({
    where,
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(events, { status: 200 });
}

// POST (création, admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = await eventCreateSchema.validate(body, { abortEarly: false });

    const event = await prisma.event.create({
      data: {
        titleFr: data.titleFr,
        titleEn: data.titleEn,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        coverImageUrl: data.coverImageUrl ?? null,
        status: data.status,
        isFeatured: data.isFeatured ?? false,
        registrationUrl: data.registrationUrl ?? null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      return NextResponse.json({ error: "Données invalides", fieldErrors }, { status: 400 });
    }
    console.error("Erreur création événement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}