// app/api/newsletter/unsubscribe/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token de désinscription manquant" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Abonné non trouvé ou déjà désinscrit" },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { isActive: false },
    });

    // Rediriger vers une page de confirmation
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      new URL(`/fr/communaute/newsletter-unsubscribed`, appUrl)
    );
  } catch (error) {
    console.error("Erreur désinscription newsletter:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}