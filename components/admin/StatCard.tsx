// components/admin/StatCard.tsx
"use client";

import { type ReactNode } from "react";
import { type IconType } from "react-icons";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: number;
  icon: IconType;
  color: string | "primary" | "gold" | "slate";
  key?: string | number;
}

const colorStyles: Record<StatCardProps["color"], string> = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-gold/15 text-gold",
  slate: "bg-slate/10 text-slate",
};

export function StatCard({ label, value, icon: Icon, color }: StatCardProps): ReactNode {
  return (
    <Card variant="bordered" className="flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${colorStyles[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="font-sans text-2xl font-bold text-black">{value}</p>
        <p className="font-sans text-sm text-slate-light">{label}</p>
      </div>
    </Card>
  );
}