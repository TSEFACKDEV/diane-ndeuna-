import type { IconType } from "react-icons";
import {
  FaSitemap,
  FaChartLine,
  FaChalkboardUser,
  FaHandshakeSimple,
} from "react-icons/fa6";

export type ExpertiseSlug =
  | "structuration"
  | "developpement-projets"
  | "formation-coaching"
  | "conseil-strategique";

export interface ExpertiseDefinition {
  slug: ExpertiseSlug;
  key: string;
  icon: IconType;
}

export const expertiseDefinitions: ExpertiseDefinition[] = [
  { slug: "structuration", key: "structuration", icon: FaSitemap },
  { slug: "developpement-projets", key: "developpement", icon: FaChartLine },
  { slug: "formation-coaching", key: "formation", icon: FaChalkboardUser },
  { slug: "conseil-strategique", key: "conseil", icon: FaHandshakeSimple },
];

export function getExpertiseBySlug(slug: string): ExpertiseDefinition | undefined {
  return expertiseDefinitions.find((item) => item.slug === slug);
}