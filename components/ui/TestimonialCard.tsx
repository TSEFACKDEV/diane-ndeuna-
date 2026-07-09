// components/ui/TestimonialCard.tsx
"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IoChatbubble } from "react-icons/io5";

interface TestimonialCardProps {
  authorName: string;
  authorRole: string;
  organization: string;
  content: string;
  avatarUrl?: string | null;
  isFeatured?: boolean;
}

export function TestimonialCard({
  authorName,
  authorRole,
  organization,
  content,
  avatarUrl,
  isFeatured,
}: TestimonialCardProps): ReactNode {
  return (
    <Card
      variant={isFeatured ? "elevated" : "bordered"}
      hoverable
      className="h-full flex flex-col"
    >
      <IoChatbubble size={32} className="text-gold/40 mb-4" />
      <p className="flex-1 font-body text-base italic leading-relaxed text-slate">
        &quot;{content}&quot;
      </p>
      <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
        {avatarUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <ImageSlot
              src={avatarUrl}
              alt={authorName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-serif text-xl font-semibold">
            {authorName.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-serif text-base font-semibold text-black">{authorName}</p>
          <p className="font-sans text-sm text-slate-light">
            {authorRole} · {organization}
          </p>
        </div>
      </div>
    </Card>
  );
}