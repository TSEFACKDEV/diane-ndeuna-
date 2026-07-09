"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
}

export function useCountUp({
  end,
  duration = 2000,
  decimals = 0,
}: UseCountUpOptions): { ref: React.RefObject<HTMLDivElement | null>; value: string } {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let startTimestamp: number | null = null;

    function step(timestamp: number): void {
      if (startTimestamp === null) {
        startTimestamp = timestamp;
      }
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    }

    const frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, end, duration]);

  return { ref, value: value.toFixed(decimals) };
}