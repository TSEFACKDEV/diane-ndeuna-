// components/sections/events/EventFilters.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { EventStatus } from "@/lib/generated/prisma/browser";


type FilterType = EventStatus | "ALL";

interface EventFiltersProps {
  selectedStatus: FilterType;
  onStatusChange: (status: FilterType) => void;
}

const statusOptions: Array<{ value: FilterType; labelKey: string }> = [
  { value: "ALL", labelKey: "all" },
  { value: "UPCOMING", labelKey: "upcoming" },
  { value: "ONGOING", labelKey: "ongoing" },
  { value: "PAST", labelKey: "past" },
  { value: "CANCELLED", labelKey: "cancelled" },
];

export function EventFilters({ selectedStatus, onStatusChange }: EventFiltersProps): ReactNode {
  const t = useTranslations("events.filters");

  return (
    <div className="flex flex-wrap gap-3">
      {statusOptions.map(({ value, labelKey }) => (
        <button
          key={value}
          type="button"
          onClick={() => onStatusChange(value)}
          className={`rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors duration-200 ${
            selectedStatus === value
              ? "bg-primary text-white"
              : "bg-cream-dark text-slate-light hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}