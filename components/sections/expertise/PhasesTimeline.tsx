"use client";

import { type ReactNode } from "react";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { IoArrowForward } from "react-icons/io5";

interface PhasesTimelineProps {
  title: string;
  phases: string[];
}

export function PhasesTimeline({ title, phases }: PhasesTimelineProps): ReactNode {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
        {title}
      </h2>
      <AnimatedSection
        stagger
        className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center"
      >
        {phases.map((phase, index) => (
          <AnimatedItem key={phase} className="flex flex-1 items-center gap-4">
            <div className="flex h-full flex-1 items-center gap-4 rounded-xl border border-border bg-white p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-serif text-base font-semibold text-white">
                {index + 1}
              </span>
              <p className="font-sans text-sm font-semibold text-slate">{phase}</p>
            </div>
            {index < phases.length - 1 ? (
              <IoArrowForward
                size={18}
                className="hidden shrink-0 text-gold lg:block"
              />
            ) : null}
          </AnimatedItem>
        ))}
      </AnimatedSection>
    </div>
  );
}