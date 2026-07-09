// app/api/upload/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import type { ApiErrorResponse } from "@/types/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC_TYPES = ["application/pdf"];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    const response: ApiErrorResponse = { error: "Non autorisé" };
    return NextResponse.json(response, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "diane-ndeuna";
    const publicId = (formData.get("publicId") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Vérification de la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Le fichier dépasse la taille maximale de ${MAX_FILE_SIZE / 1024 / 1024} MB` },
        { status: 400 }
      );
    }

    // Vérification du type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isPdf = ALLOWED_DOC_TYPES.includes(file.type);

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Type de fichier non supporté. Utilisez JPEG, PNG, WEBP, GIF ou PDF." },
        { status: 400 }
      );
    }

    const resourceType = isPdf ? "raw" : "image";

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadToCloudinary(buffer, {
      folder,
      publicId,
      resourceType,
      tags: [`user:${user.id}`, folder],
      transformation: isImage
        ? { quality: "auto", fetch_format: "auto" }
        : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        publicId: result.publicId,
        url: result.secureUrl,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    );
  }
}

// app/api/upload/route.ts (ajouter la méthode DELETE)
// À ajouter dans le même fichier après la méthode POST

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json({ error: "publicId requis" }, { status: 400 });
    }

    await deleteFromCloudinary(publicId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    );
  }
}