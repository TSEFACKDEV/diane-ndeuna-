// app/api/blog/[slug]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import * as yup from "yup";

const blogPostUpdateSchema = yup.object({
  titleFr: yup.string().trim().optional(),
  titleEn: yup.string().trim().optional(),
  excerptFr: yup.string().trim().optional(),
  excerptEn: yup.string().trim().optional(),
  contentFr: yup.string().trim().optional(),
  contentEn: yup.string().trim().optional(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
  isPublished: yup.boolean().optional(),
  publishedAt: yup.date().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { fullName: true },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Article non trouvé" }, { status: 404 });
  }

  if (!post.isPublished && !isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  return NextResponse.json(post, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { slug } = await params;
  try {
    const body = await request.json();
    const data = await blogPostUpdateSchema.validate(body, { abortEarly: false });

    const updated = await prisma.blogPost.update({
      where: { slug },
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
    console.error("Erreur mise à jour article:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { slug } = await params;
  try {
    await prisma.blogPost.delete({ where: { slug } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression article:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}