// components/ui/FileUpload.tsx
"use client";

import { type ReactNode, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { cn } from "@/lib/utils";
import { IoCloudUpload, IoClose, IoDocumentText } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";

interface FileUploadProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  existingUrl?: string | null;
  existingPublicId?: string | null;
  label?: string;
  accept?: "image" | "pdf" | "all";
  maxSize?: number; // en MB
  className?: string;
}

export function FileUpload({
  onUploadSuccess,
  onUploadError,
  folder = "diane-ndeuna",
  existingUrl,
  existingPublicId,
  label,
  accept = "image",
  maxSize = 10,
  className,
}: FileUploadProps): ReactNode {
  const t = useTranslations("common.fileUpload");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [publicId, setPublicId] = useState<string | null>(existingPublicId || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSize * 1024 * 1024;

  const acceptTypes = {
    image: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    pdf: {
      "application/pdf": [".pdf"],
    },
    all: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
    },
  };

  const isImage = (file: File): boolean => file.type.startsWith("image/");
  const isPdf = (file: File): boolean => file.type === "application/pdf";

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);

      // Vérification taille
      if (file.size > maxSizeBytes) {
        const msg = `Le fichier dépasse ${maxSize} MB`;
        setError(msg);
        onUploadError?.(msg);
        return;
      }

      // Preview locale (pour les images)
      if (isImage(file)) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (isPdf(file)) {
        setPreview("/pdf-placeholder.svg");
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const { data } = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPublicId(data.publicId);
        setPreview(data.url);
        onUploadSuccess(data.url, data.publicId);
      } catch (err) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error || t("error")
          : t("error");
        setError(msg);
        onUploadError?.(msg);
        // Réinitialiser la preview en cas d'erreur
        if (preview && !existingUrl) {
          setPreview(null);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [folder, maxSizeBytes, maxSize, onUploadSuccess, onUploadError, preview, existingUrl, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes[accept],
    maxSize: maxSizeBytes,
    multiple: false,
  });

  const handleRemove = async (): Promise<void> => {
    if (publicId) {
      try {
        await axios.delete("/api/upload", { data: { publicId } });
      } catch (err) {
        console.error("Erreur suppression:", err);
      }
    }
    setPreview(null);
    setPublicId(null);
    onUploadSuccess("", "");
  };

  const isFilePdf = preview?.endsWith(".pdf") || preview === "/pdf-placeholder.svg";

  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <label className="block font-sans text-sm font-medium text-slate">
          {label}
        </label>
      ) : null}

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-lg border border-border bg-cream"
          >
            {isFilePdf ? (
              <div className="flex items-center gap-4 p-4">
                <IoDocumentText size={40} className="text-error" />
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-slate">
                    {t("pdfUploaded")}
                  </p>
                  <p className="font-body text-xs text-slate-light">
                    {publicId || t("fileReady")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={t("preview")}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
              aria-label={t("remove")}
            >
              <IoClose size={18} />
            </button>
          </motion.div>
        ) : (
          /* Encapsulation du dropzone dans un div standard pour éviter le conflit de types avec motion */
          <div key="dropzone" {...getRootProps()}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-cream hover:border-primary/50 hover:bg-cream-dark",
                isUploading && "pointer-events-none opacity-60"
              )}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
                ) : (
                  <IoCloudUpload size={36} className="text-slate-light" />
                )}
                <p className="font-body text-sm text-slate-light">
                  {isDragActive ? t("dropHere") : t("dragDrop")}
                </p>
                <p className="font-body text-xs text-slate-light">
                  {t("formats", { maxSize })}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("browse")}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {error ? <p className="font-body text-sm text-error">{error}</p> : null}
    </div>
  );
}