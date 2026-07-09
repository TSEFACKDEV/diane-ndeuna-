"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { FileUpload } from "@/components/ui/FileUpload";
import { Card } from "@/components/ui/Card";
import { IoDownloadOutline } from "react-icons/io5";

interface EcosystemBrochureUploadProps {
  entityCode: string;
  entityName: string;
  currentBrochureUrl?: string | null;
  currentBrochurePublicId?: string | null;
  onUpdate: () => void;
}

export function EcosystemBrochureUpload({
  entityCode,
  entityName,
  currentBrochureUrl,
  currentBrochurePublicId,
  onUpdate,
}: EcosystemBrochureUploadProps): ReactNode {
  const t = useTranslations("admin.ecosystem");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = async (url: string, publicId: string): Promise<void> => {
    setIsSaving(true);
    setError(null);
    try {
      await axios.put(`/api/ecosystem/${entityCode}`, {
        brochureUrl: publicId,
      });
      onUpdate();
    } catch {
      setError(t("updateError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card variant="bordered" className="p-6">
      <h3 className="font-serif text-lg font-semibold text-black">
        {t("brochure.title", { name: entityName })}
      </h3>
      <p className="mt-2 font-body text-sm text-slate-light">
        {t("brochure.description")}
      </p>

      {currentBrochureUrl ? (
        <div className="mt-4 flex items-center gap-4 rounded-lg bg-green-50 p-4">
          <IoDownloadOutline size={24} className="text-success" />
          <div className="flex-1">
            <p className="font-body text-sm font-medium text-slate">
              {t("brochure.current")}
            </p>
            <p className="font-body text-xs text-slate-light truncate">
              {currentBrochurePublicId || currentBrochureUrl}
            </p>
          </div>
          <a
            href={currentBrochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {t("brochure.download")}
          </a>
        </div>
      ) : null}

      <div className="mt-4">
        <FileUpload
          label={t("brochure.uploadLabel")}
          folder="diane-ndeuna/brochures"
          existingUrl={currentBrochureUrl}
          existingPublicId={currentBrochurePublicId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(err) => setError(err)}
          accept="pdf"
          maxSize={20}
        />
      </div>

      {error ? <p className="mt-3 font-body text-sm text-error">{error}</p> : null}
      {isSaving ? (
        <p className="mt-3 font-body text-sm text-slate-light">{t("saving")}</p>
      ) : null}
    </Card>
  );
}