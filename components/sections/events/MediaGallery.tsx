// components/sections/events/MediaGallery.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Modal } from "@/components/ui/Modal";
import { IoPlayCircle } from "react-icons/io5";
import { MediaItem } from "@/lib/generated/prisma/client";


interface MediaGalleryProps {
  mediaItems: (MediaItem & { event?: { titleFr: string; titleEn: string } | null })[];
  locale: string;
}

export function MediaGallery({ mediaItems, locale }: MediaGalleryProps): ReactNode {
  const t = useTranslations("events.past");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  if (mediaItems.length === 0) {
    return <p className="font-body text-sm text-slate-light">{t("noMedia")}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mediaItems.map((item) => {
          const title = locale === "fr" ? item.titleFr : item.titleEn;
          const isVideo = item.type === "VIDEO";
          return (
            <Card
              key={item.id}
              variant="bordered"
              hoverable
              className="cursor-pointer overflow-hidden p-0"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="relative aspect-square w-full">
                <ImageSlot
                  src={item.thumbnailUrl || item.url}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                {isVideo ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <IoPlayCircle size={48} className="text-white drop-shadow-lg" />
                  </div>
                ) : null}
              </div>
              <div className="p-3">
                <p className="font-body text-sm font-medium text-black truncate">{title}</p>
                {item.event ? (
                  <p className="mt-1 font-sans text-xs text-slate-light">
                    {locale === "fr" ? item.event.titleFr : item.event.titleEn}
                  </p>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        title={selectedMedia ? (locale === "fr" ? selectedMedia.titleFr : selectedMedia.titleEn) : ""}
      >
        {selectedMedia ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            {selectedMedia.type === "VIDEO" ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="h-full w-full"
              />
            ) : (
              <ImageSlot
                src={selectedMedia.url}
                alt={locale === "fr" ? selectedMedia.titleFr : selectedMedia.titleEn}
                fill={false}
                width={800}
                height={600}
                className="mx-auto max-h-[70vh] w-auto object-contain"
              />
            )}
          </div>
        ) : null}
      </Modal>
    </>
  );
}