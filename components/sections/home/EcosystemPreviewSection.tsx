"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { ImageSlot } from "@/components/ui/ImageSlot";

interface EcosystemItem {
  code: string;
  href: AppPathnames;
  logo: string;
}

const ecosystemItems = [
  { code: "adef", href: "/ecosysteme/adef", logo: "/images/logo-adef.png" },
  { code: "eden", href: "/ecosysteme/eden-africa", logo: "/images/logo-eden-africa.png" },
  { code: "mia", href: "/ecosysteme/mia-africa", logo: "/images/logo-mia-africa.png" },
  { code: "oscf", href: "/ecosysteme/oscf", logo: "/images/logo-oscf.png" },
] as const satisfies readonly EcosystemItem[];

export function EcosystemPreviewSection(): ReactNode {
  const t = useTranslations("home.ecosystemPreview");

  return (
    <section className="section-padding bg-cream">
      <div className="container-site">
        <SectionTitle subtitle={t("eyebrow")} title={t("title")} />

        <AnimatedSection
          stagger
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ecosystemItems.map((item) => (
            <AnimatedItem key={item.code}>
              <Link href={item.href} className="block h-full">
                <Card variant="bordered" className="flex h-full flex-col items-center text-center">
                  {/* IMAGE ATTENDUE : public/images/logo-{item}.png */}
                  <div className="relative h-16 w-32">
                    <ImageSlot
                      src={item.logo}
                      alt={t(`items.${item.code}.name`)}
                      fill
                      sizes="128px"
                      expectedFile={item.logo}
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-5 font-serif text-lg font-semibold text-black">
                    {t(`items.${item.code}.name`)}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-slate-light">
                    {t(`items.${item.code}.tagline`)}
                  </p>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedSection>

        <div className="mt-12 text-center">
          <Link href="/ecosysteme">
            <span className="font-sans text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
              {t("viewAll")}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}