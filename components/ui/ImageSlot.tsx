"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ImageSlotProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  expectedFile?: string;
}

export function ImageSlot({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  className,
  expectedFile,
}: ImageSlotProps): ReactNode {
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-cream-dark text-center",
          fill ? "absolute inset-0" : "",
          className
        )}
      >
        <p className="px-4 font-sans text-xs text-slate-light">
          Image attendue : {expectedFile ?? src}
        </p>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={cn("object-cover", className)}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}