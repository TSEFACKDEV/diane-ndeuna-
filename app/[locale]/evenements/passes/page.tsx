// app/[locale]/evenements/passes/page.tsx
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MediaGallery } from "@/components/sections/events/MediaGallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events.past" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PastEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });

  // Récupération des événements passés avec leurs médias
  const pastEvents = await prisma.event.findMany({
    where: {
      status: "PAST",
    },
    orderBy: { startDate: "desc" },
    include: {
      mediaItems: true,
    },
  });

  // Récupération de tous les médias (photos/vidéos) pour la galerie
  const allMedia = await prisma.mediaItem.findMany({
    where: {
      type: {
        in: ["PHOTO", "VIDEO"],
      },
    },
    include: {
      event: {
        select: {
          titleFr: true,
          titleEn: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <SectionTitle
          subtitle={t("past.eyebrow")}
          title={t("past.title")}
          align="left"
        />
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-light">
          {t("past.description")}
        </p>

        {pastEvents.length > 0 ? (
          <div className="mt-10 space-y-8">
            {pastEvents.map((event) => {
              const title = locale === "fr" ? event.titleFr : event.titleEn;
              return (
                <div key={event.id}>
                  <h2 className="font-serif text-2xl font-semibold text-black">{title}</h2>
                  {event.mediaItems.length > 0 ? (
                    <MediaGallery
                      mediaItems={event.mediaItems.map((media) => ({
                        ...media,
                        event: { titleFr: event.titleFr, titleEn: event.titleEn },
                      }))}
                      locale={locale}
                    />
                  ) : (
                    <p className="mt-4 font-body text-sm text-slate-light">{t("noMediaForEvent")}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Galerie globale de tous les médias */}
        {allMedia.length > 0 ? (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-black">{t("galleryTitle")}</h2>
            <div className="mt-6">
              <MediaGallery mediaItems={allMedia} locale={locale} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}