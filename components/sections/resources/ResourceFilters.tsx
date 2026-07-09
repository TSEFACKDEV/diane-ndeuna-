// components/sections/resources/ResourceFilters.tsx
"use client";

import { type ReactNode } from "react";
import { ResourceType } from "@/lib/generated/prisma/browser";


interface ResourceFiltersProps {
  selectedType: ResourceType | "ALL";
  onTypeChange: (type: ResourceType | "ALL") => void;
}

const typeOptions: Array<{ value: ResourceType | "ALL"; label: string }> = [
  { value: "ALL", label: "Tous" },
  { value: "ARTICLE", label: "Articles" },
  { value: "BOOK_GUIDE", label: "Livres & Guides" },
  { value: "VIDEO", label: "Vidéos" },
  { value: "PODCAST", label: "Podcasts" },
  { value: "EXTERNAL_LINK", label: "Liens externes" },
];

export function ResourceFilters({ selectedType, onTypeChange }: ResourceFiltersProps): ReactNode {
  return (
    <div className="flex flex-wrap gap-3">
      {typeOptions.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onTypeChange(value)}
          className={`rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors duration-200 ${
            selectedType === value
              ? "bg-primary text-white"
              : "bg-cream-dark text-slate-light hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}