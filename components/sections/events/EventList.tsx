// components/sections/events/EventList.tsx
"use client";

import { type ReactNode, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { EventFilters } from "@/components/sections/events/EventFilters";
import { EventCard } from "@/components/ui/EventCard";
import { EventStatus } from "@/lib/generated/prisma/browser";


type EventLocalized = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  coverImageUrl?: string | null;
  status: EventStatus;
  isFeatured?: boolean;
};

interface EventListProps {
  initialEvents: EventLocalized[];
}

export function EventList({ initialEvents }: EventListProps): ReactNode {
  const t = useTranslations("events");
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | "ALL">("ALL");

  const filteredEvents = useMemo(() => {
    if (selectedStatus === "ALL") return initialEvents;
    return initialEvents.filter((ev) => ev.status === selectedStatus);
  }, [initialEvents, selectedStatus]);

  return (
    <div className="mt-10">
      <EventFilters selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
      {filteredEvents.length === 0 ? (
        <p className="mt-8 font-body text-sm text-slate-light">{t("noEvents")}</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((ev) => (
            <EventCard key={ev.id} {...ev} />
          ))}
        </div>
      )}
    </div>
  );
}