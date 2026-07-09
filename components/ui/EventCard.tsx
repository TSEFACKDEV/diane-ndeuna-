// components/ui/EventCard.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { EventStatus } from "@/lib/generated/prisma/browser";


interface EventCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  coverImageUrl?: string | null;
  status: EventStatus;
  isFeatured?: boolean;
}

const statusBadgeVariant: Record<EventStatus, "primary" | "gold" | "neutral"> = {
  UPCOMING: "gold",
  ONGOING: "primary",
  PAST: "neutral",
  CANCELLED: "neutral",
};

const statusLabelKey: Record<EventStatus, string> = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  PAST: "past",
  CANCELLED: "cancelled",
};

export function EventCard({
  title,
  description,
  location,
  startDate,
  endDate,
  coverImageUrl,
  status,
  isFeatured,
}: EventCardProps): ReactNode {
  const t = useTranslations("events");

  const startDateFormatted = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(startDate);

  const endDateFormatted = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(endDate);

  const sameDay = startDate.toDateString() === endDate.toDateString();

  return (
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
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusBadgeVariant[status]}>
          {t(`status.${statusLabelKey[status]}`)}
        </Badge>
        {isFeatured ? <Badge variant="gold">{t("featured")}</Badge> : null}
      </div>
      <h3 className="mt-3 font-serif text-xl font-semibold text-black">{title}</h3>
      <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-slate-light">
        {description}
      </p>
      <div className="mt-4 space-y-2 font-sans text-sm text-slate-light">
        <p className="flex items-center gap-2">
          <IoCalendarOutline size={16} className="text-gold" />
          <span>
            {startDateFormatted}
            {!sameDay ? ` — ${endDateFormatted}` : ""}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <IoTimeOutline size={16} className="text-gold" />
          <span>
            {new Intl.DateTimeFormat("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(startDate)}
            {" - "}
            {new Intl.DateTimeFormat("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(endDate)}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <IoLocationOutline size={16} className="text-gold" />
          <span>{location}</span>
        </p>
      </div>
    </Card>
  );
}