// lib/cloudinary.ts — REMPLACE le fichier existant
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
}

export interface BuildDownloadUrlOptions {
  publicId: string;
  format?: "pdf" | "jpg" | "png" | "webp";
  filename?: string;
  transformation?: Record<string, string | number>;
}

export function buildCloudinaryDownloadUrl({
  publicId,
  format = "pdf",
  filename,
  transformation,
}: BuildDownloadUrlOptions): string {
  const options: Record<string, unknown> = {
    resource_type: "image",
    type: "upload",
    format,
    secure: true,
  };

  if (filename) {
    options.flags = `attachment:${filename}`;
  } else {
    options.flags = "attachment";
  }

  if (transformation) {
    options.transformation = [transformation];
  }

  return cloudinary.utils.url(publicId, options);
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    resourceType?: "image" | "raw" | "auto";
    tags?: string[];
    transformation?: Record<string, string | number>;
  } = {}
): Promise<UploadResult> {
  const uploadOptions: UploadApiOptions = {
    folder: options.folder || "diane-ndeuna",
    resource_type: options.resourceType || "auto",
    tags: options.tags || [],
  };

  if (options.publicId) {
    uploadOptions.public_id = options.publicId;
  }

  if (options.transformation) {
    uploadOptions.transformation = [options.transformation];
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Erreur lors de l'upload"));
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format || "unknown",
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error || (result && result.result !== "ok")) {
        reject(error || new Error(`Erreur suppression: ${result?.result || "unknown"}`));
        return;
      }
      resolve();
    });
  });
}

export async function deleteMultipleFromCloudinary(publicIds: string[]): Promise<void> {
  for (const publicId of publicIds) {
    await deleteFromCloudinary(publicId);
  }
}

export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:[a-z]+)$/);
  return match ? match[1] : null;
}

export { cloudinary };