import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildCloudinaryDownloadUrl } from "@/lib/cloudinary";

import type { ApiErrorResponse } from "@/types/auth";
import { EcosystemEntityCode } from "@/lib/generated/prisma/enums";

interface BrochureResponse {
  downloadUrl: string;
  available: boolean;
}

function isValidCode(code: string): code is EcosystemEntityCode {
  return Object.values(EcosystemEntityCode).includes(code as EcosystemEntityCode);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  const { code } = await params;

  if (!isValidCode(code)) {
    const response: ApiErrorResponse = { error: "Entité écosystème invalide" };
    return NextResponse.json(response, { status: 400 });
  }

  const entity = await prisma.ecosystemEntity.findUnique({
    where: { code },
  });

  if (!entity || !entity.brochureUrl) {
    const response: BrochureResponse = { downloadUrl: "", available: false };
    return NextResponse.json(response, { status: 200 });
  }

  const downloadUrl = buildCloudinaryDownloadUrl({
    publicId: entity.brochureUrl,
    filename: `brochure-${code.toLowerCase().replace("_", "-")}.pdf`,
  });

  const response: BrochureResponse = { downloadUrl, available: true };
  return NextResponse.json(response, { status: 200 });
}