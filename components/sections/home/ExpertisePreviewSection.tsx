"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import {
  FaSitemap,
  FaChartLine,
  FaChalkboardUser,
  FaHandshakeSimple,
} from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import type { IconType } from "react-icons";

interface ExpertiseItem {
  key: string;
  href: AppPathnames;
  icon: IconType;
}

const expertiseItems = [
  { key: "structuration", href: "/expertise/structuration", icon: FaSitemap },
  { key: "developpement", href: "/expertise/developpement-projets", icon: FaChartLine },
  { key: "formation", href: "/expertise/formation-coaching", icon: FaChalkboardUser },
  { key: "conseil", href: "/expertise/conseil-strategique", icon: FaHandshakeSimple },
] as const satisfies readonly ExpertiseItem[];

export function ExpertisePreviewSection(): ReactNode {
  const t = useTranslations("home.expertisePreview");

  return (
    <section className="section-padding bg-cream-dark">
      <div className="container-site">
        <SectionTitle subtitle={t("eyebrow")} title={t("title")} />

        <AnimatedSection
          stagger
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {expertiseItems.map(({ key, href, icon: Icon }) => (
            <AnimatedItem key={key}>
              <Link href={href} className="block h-full">
                <Card className="flex h-full flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <p className="mt-5 font-serif text-xl font-semibold text-black">
                    {t(`items.${key}.title`)}
                  </p>
                  <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-slate-light">
                    {t(`items.${key}.description`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-primary">
                    {t("readMore")}
                    <IoArrowForward size={14} />
                  </span>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedSection>

        <div className="mt-12 text-center">
          <Link href="/expertise">
            <span className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
              {t("viewAll")}
              <IoArrowForward size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}