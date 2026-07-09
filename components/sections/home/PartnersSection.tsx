"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ImageSlot } from "@/components/ui/ImageSlot";

const partnerCount = 6;

export function PartnersSection(): ReactNode {
  const t = useTranslations("home.partners");

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <AnimatedSection className="text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {t("eyebrow")}
          </p>
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: partnerCount }, (_, index) => index + 1).map((num) => (
            <div key={num} className="relative h-14 w-full opacity-70 transition-opacity duration-300 hover:opacity-100">
              {/* IMAGE ATTENDUE : public/images/partners/partner-{num}.png */}
              <ImageSlot
                src={`/images/partners/partner-${num}.png`}
                alt={`Partenaire ${num}`}
                fill
                sizes="160px"
                expectedFile={`public/images/partners/partner-${num}.png`}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}