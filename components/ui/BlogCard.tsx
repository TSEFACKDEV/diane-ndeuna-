"use client";

import { type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IoCalendarOutline, IoPersonOutline } from "react-icons/io5";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string | null;
  publishedAt: Date;
  authorName: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishedAt,
  authorName,
}: BlogCardProps): ReactNode {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(publishedAt);

  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug } }}
      className="block h-full"
    >
      <Card variant="bordered" hoverable className="h-full flex flex-col">
        {coverImageUrl ? (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-4">
            <ImageSlot
              src={coverImageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        ) : null}
        <h3 className="font-serif text-xl font-semibold text-black">{title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs text-slate-light">
          <span className="flex items-center gap-1">
            <IoCalendarOutline size={14} />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <IoPersonOutline size={14} />
            {authorName}
          </span>
        </div>
        <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-slate-light">
          {excerpt}
        </p>
        <span className="mt-4 inline-block font-sans text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
          Lire la suite →
        </span>
      </Card>
    </Link>
  );
}