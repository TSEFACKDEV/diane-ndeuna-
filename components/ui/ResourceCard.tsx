// components/ui/ResourceCard.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IoDocumentText, IoBook, IoVideocam, IoMic, IoLink } from "react-icons/io5";
import { ResourceType } from "@/lib/generated/prisma/browser";


interface ResourceCardProps {
  title: string;
  description: string;
  type: ResourceType;
  coverImageUrl?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
  author?: string | null;
  isFeatured?: boolean;
}

const typeIconMap: Record<ResourceType, ReactNode> = {
  ARTICLE: <IoDocumentText className="text-primary" size={18} />,
  BOOK_GUIDE: <IoBook className="text-primary" size={18} />,
  VIDEO: <IoVideocam className="text-primary" size={18} />,
  PODCAST: <IoMic className="text-primary" size={18} />,
  EXTERNAL_LINK: <IoLink className="text-primary" size={18} />,
};

const typeLabelMap: Record<ResourceType, string> = {
  ARTICLE: "Article",
  BOOK_GUIDE: "Livre / Guide",
  VIDEO: "Vidéo",
  PODCAST: "Podcast",
  EXTERNAL_LINK: "Lien externe",
};

export function ResourceCard({
  title,
  description,
  type,
  coverImageUrl,
  fileUrl,
  externalUrl,
  author,
  isFeatured,
}: ResourceCardProps): ReactNode {
  const t = useTranslations("resources");

  const href = fileUrl ? fileUrl : externalUrl ? externalUrl : "#";

  return (
    <Card variant="bordered" hoverable className="h-full flex flex-col">
      {coverImageUrl ? (
        <div className="relative h-40 w-full overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-4">
          <ImageSlot
            src={coverImageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        {typeIconMap[type]}
        <Badge variant="neutral">{typeLabelMap[type]}</Badge>
        {isFeatured ? <Badge variant="gold">À la une</Badge> : null}
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold text-black">{title}</h3>
      {author ? (
        <p className="mt-1 font-sans text-xs font-medium text-slate-light">Par {author}</p>
      ) : null}
      <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-slate-light">
        {description}
      </p>
      <a
        href={href}
        target={externalUrl ? "_blank" : undefined}
        rel={externalUrl ? "noopener noreferrer" : undefined}
        className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
      >
        {t("readMore")}
        <IoLink size={14} />
      </a>
    </Card>
  );
}