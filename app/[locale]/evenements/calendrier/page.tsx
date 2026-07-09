// app/[locale]/evenements/calendrier/page.tsx
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { EventList } from "@/components/sections/events/EventList";
import { SectionTitle } from "@/components/ui/SectionTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events.calendar" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });

  // Récupération des événements à venir + en cours (pour le calendrier)
  const events = await prisma.event.findMany({
    where: {
      status: {
        in: ["UPCOMING", "ONGOING"],
      },
    },
    orderBy: { startDate: "asc" },
  });

  const eventsLocalized = events.map((ev) => ({
    ...ev,
    title: locale === "fr" ? ev.titleFr : ev.titleEn,
    description: locale === "fr" ? ev.descriptionFr : ev.descriptionEn,
  }));

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <SectionTitle
          subtitle={t("calendar.eyebrow")}
          title={t("calendar.title")}
          align="left"
        />
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-light">
          {t("calendar.description")}
        </p>

        <EventList initialEvents={eventsLocalized} />
      </div>
    </div>
  );
}