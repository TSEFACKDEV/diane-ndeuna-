import { type ReactNode } from "react";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { VisionValuesSection } from "@/components/sections/home/VisionValuesSection";
import { StatsSection } from "@/components/sections/home/StatsSection";
import { ExpertisePreviewSection } from "@/components/sections/home/ExpertisePreviewSection";
import { EcosystemPreviewSection } from "@/components/sections/home/EcosystemPreviewSection";
import { NewsletterSection } from "@/components/sections/home/NewsletterSection";

export default function HomePage(): ReactNode {
  return (
    <>
      <HeroSection />
      <VisionValuesSection />
      <StatsSection />
      <ExpertisePreviewSection />
      <EcosystemPreviewSection />
      <NewsletterSection />
    </>
  );
}