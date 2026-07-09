import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BioSection } from "@/components/sections/about/BioSection";
import { TimelineSection } from "@/components/sections/about/TimelineSection";
import { ImpactsSection } from "@/components/sections/about/ImpactsSection";
import { MediasSection } from "@/components/sections/about/MediasSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.bio" });

  return {
    title: t("title"),
    description: t("summary"),
  };
}

export default function AboutPage(): ReactNode {
  return (
    <>
      <BioSection />
      <TimelineSection />
      <ImpactsSection />
      <MediasSection />
    </>
  );
}