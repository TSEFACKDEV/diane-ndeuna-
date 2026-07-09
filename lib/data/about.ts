import type { IconType } from "react-icons";
import {
  FaGraduationCap,
  FaBuilding,
  FaGlobe,
  FaAward,
} from "react-icons/fa6";

export interface TimelineEntry {
  id: string;
  icon: IconType;
}

export const timelineEntries: TimelineEntry[] = [
  { id: "foundation", icon: FaGraduationCap },
  { id: "eden", icon: FaBuilding },
  { id: "international", icon: FaGlobe },
  { id: "recognition", icon: FaAward },
];

export const coreValueKeys = [
  "excellence",
  "solidarity",
  "integrity",
  "legacy",
] as const;

export const majorActionsKeys = [
  "governance",
  "financing",
  "advocacy",
  "networks",
] as const;