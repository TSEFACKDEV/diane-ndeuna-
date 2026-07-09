"use client";

import { type ReactNode, useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { IoDownloadOutline } from "react-icons/io5";

interface BrochureDownloadButtonProps {
  code: string;
}

interface BrochureResponse {
  downloadUrl: string;
  available: boolean;
}

export function BrochureDownloadButton({ code }: BrochureDownloadButtonProps): ReactNode {
  const t = useTranslations("ecosystem.detail");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notAvailable, setNotAvailable] = useState<boolean>(false);

  async function handleDownload(): Promise<void> {
    setIsLoading(true);
    setNotAvailable(false);
    try {
      const { data } = await axios.get<BrochureResponse>(`/api/ecosystem/${code}/brochure`);
      if (data.available && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        setNotAvailable(true);
      }
    } catch {
      setNotAvailable(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button variant="secondary" onClick={handleDownload} isLoading={isLoading}>
        <IoDownloadOutline size={18} />
        {t("downloadBrochure")}
      </Button>
      {notAvailable ? (
        <p className="mt-2 font-body text-xs text-slate-light">
          {t("brochureUnavailable")}
        </p>
      ) : null}
    </div>
  );
}