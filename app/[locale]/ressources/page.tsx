// app/[locale]/ressources/page.tsx
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ResourceList } from "@/components/sections/resources/ResourceList";
import { SectionTitle } from "@/components/ui/SectionTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources.index" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });

  // Récupération des ressources depuis la base
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      titleFr: true,
      titleEn: true,
      descriptionFr: true,
      descriptionEn: true,
      coverImageUrl: true,
      fileUrl: true,
      externalUrl: true,
      author: true,
      isFeatured: true,
    },
  });

  // Sélection des champs selon la langue
  const resourcesLocalized = resources.map((res) => ({
    ...res,
    title: locale === "fr" ? res.titleFr : res.titleEn,
    description: locale === "fr" ? res.descriptionFr : res.descriptionEn,
  }));

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <SectionTitle
          subtitle={t("index.eyebrow")}
          title={t("index.title")}
          align="left"
        />
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-light">
          {t("index.description")}
        </p>
        <ResourceList initialResources={resourcesLocalized} />
      </div>
    </div>
  );
}