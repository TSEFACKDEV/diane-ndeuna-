// app/api/blog/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import * as yup from "yup";

const blogPostCreateSchema = yup.object({
  slug: yup.string().trim().required(),
  titleFr: yup.string().trim().required(),
  titleEn: yup.string().trim().required(),
  excerptFr: yup.string().trim().required(),
  excerptEn: yup.string().trim().required(),
  contentFr: yup.string().trim().required(),
  contentEn: yup.string().trim().required(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
  isPublished: yup.boolean().optional(),
  publishedAt: yup.date().optional(),
});

// GET (liste des articles publiés, ou tous pour admin)
export async function GET(): Promise<NextResponse> {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const where = isAdmin ? {} : { isPublished: true };

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    include: {
      author: {
        select: { fullName: true },
      },
    },
  });

  return NextResponse.json(posts, { status: 200 });
}

// POST (création, admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = await blogPostCreateSchema.validate(body, { abortEarly: false });

    const post = await prisma.blogPost.create({
      data: {
        slug: data.slug,
        titleFr: data.titleFr,
        titleEn: data.titleEn,
        excerptFr: data.excerptFr,
        excerptEn: data.excerptEn,
        contentFr: data.contentFr,
        contentEn: data.contentEn,
        coverImageUrl: data.coverImageUrl ?? null,
        isPublished: data.isPublished ?? false,
        publishedAt: data.publishedAt ?? (data.isPublished ? new Date() : null),
        authorId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      return NextResponse.json({ error: "Données invalides", fieldErrors }, { status: 400 });
    }
    console.error("Erreur création article:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}