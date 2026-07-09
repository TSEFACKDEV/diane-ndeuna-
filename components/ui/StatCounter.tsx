"use client";

import { type ReactNode } from "react";
import { useCountUp } from "@/hooks/useCountUp";

interface StatCounterProps {
  end: number;
  suffix?: string;
  label: string;
  light?: boolean;
}

export function StatCounter({ end, suffix = "", label, light = false }: StatCounterProps): ReactNode {
  const { ref, value } = useCountUp({ end, duration: 1800 });

  return (
    <div ref={ref} className="text-center">
      <p
        className={`font-serif text-4xl font-semibold md:text-5xl ${
          light ? "text-white" : "text-primary"
        }`}
      >
        {value}
        <span className="text-gold">{suffix}</span>
      </p>
      {label ? (
        <p
          className={`mt-2 font-sans text-sm font-medium uppercase tracking-wider ${
            light ? "text-cream/80" : "text-slate-light"
          }`}
        >
          {label}
        </p>
      ) : null}
    </div>
  );
}