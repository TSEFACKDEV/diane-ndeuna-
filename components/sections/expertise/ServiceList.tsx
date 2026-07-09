"use client";

import { type ReactNode } from "react";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { FaCircleCheck } from "react-icons/fa6";

interface ServiceListProps {
  title: string;
  items: string[];
}

export function ServiceList({ title, items }: ServiceListProps): ReactNode {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
        {title}
      </h2>
      <AnimatedSection stagger className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <AnimatedItem key={item}>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-5">
              <FaCircleCheck size={18} className="mt-0.5 shrink-0 text-primary" />
              <p className="font-body text-sm leading-relaxed text-slate">{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </AnimatedSection>
    </div>
  );
}