// app/api/ecosystem/[code]/route.ts (nouveau fichier)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import * as yup from "yup";
import { EcosystemEntityCode } from "@/lib/generated/prisma/browser";


const updateSchema = yup.object({
  brochureUrl: yup.string().trim().nullable(),
});

function isValidCode(code: string): code is EcosystemEntityCode {
  return Object.values(EcosystemEntityCode).includes(code as EcosystemEntityCode);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { code } = await params;

  if (!isValidCode(code)) {
    return NextResponse.json({ error: "Entité invalide" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = await updateSchema.validate(body, { abortEarly: false });

    const updated = await prisma.ecosystemEntity.update({
      where: { code },
      data: {
        brochureUrl: data.brochureUrl,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        { error: "Données invalides", fieldErrors: error.errors },
        { status: 400 }
      );
    }
    console.error("Erreur mise à jour entité:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}