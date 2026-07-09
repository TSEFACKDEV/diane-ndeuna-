// components/sections/resources/ResourceList.tsx
"use client";

import { type ReactNode, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ResourceFilters } from "@/components/sections/resources/ResourceFilters";
import { ResourceCard } from "@/components/ui/ResourceCard";
import { ResourceType } from "@/lib/generated/prisma/browser";


type ResourceLocalized = {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  coverImageUrl?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
  author?: string | null;
  isFeatured?: boolean;
};

interface ResourceListProps {
  initialResources: ResourceLocalized[];
}

export function ResourceList({ initialResources }: ResourceListProps): ReactNode {
  const t = useTranslations("resources");
  const [selectedType, setSelectedType] = useState<ResourceType | "ALL">("ALL");

  const filteredResources = useMemo(() => {
    if (selectedType === "ALL") return initialResources;
    return initialResources.filter((res) => res.type === selectedType);
  }, [initialResources, selectedType]);

  return (
    <div className="mt-10">
      <ResourceFilters selectedType={selectedType} onTypeChange={setSelectedType} />
      {filteredResources.length === 0 ? (
        <p className="mt-8 font-body text-sm text-slate-light">{t("noResources")}</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} {...res} />
          ))}
        </div>
      )}
    </div>
  );
}