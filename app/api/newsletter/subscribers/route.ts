// app/api/newsletter/subscribers/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const isActive = searchParams.get("active");
  const where =
    isActive !== null
      ? { isActive: isActive === "true" }
      : {};

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where,
    orderBy: { subscribedAt: "desc" },
  });

  return NextResponse.json(subscribers, { status: 200 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression abonné:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}