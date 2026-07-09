import { EcosystemEntityCode } from "../generated/prisma/enums";

export type EcosystemSlug = "adef" | "eden-africa" | "mia-africa" | "oscf";

export interface EcosystemDefinition {
  code: EcosystemEntityCode;
  slug: EcosystemSlug;
  key: string;
  logoFile: string;
  brochurePublicId: string;
}

export const ecosystemDefinitions: EcosystemDefinition[] = [
  {
    code: "ADEF",
    slug: "adef",
    key: "adef",
    logoFile: "/images/logo-adef.png",
    brochurePublicId: "brochures/brochure-adef",
  },
  {
    code: "EDEN_AFRICA",
    slug: "eden-africa",
    key: "eden",
    logoFile: "/images/logo-eden-africa.png",
    brochurePublicId: "brochures/brochure-eden-africa",
  },
  {
    code: "MIA_AFRICA",
    slug: "mia-africa",
    key: "mia",
    logoFile: "/images/logo-mia-africa.png",
    brochurePublicId: "brochures/brochure-mia-africa",
  },
  {
    code: "OSCF",
    slug: "oscf",
    key: "oscf",
    logoFile: "/images/logo-oscf.png",
    brochurePublicId: "brochures/brochure-oscf",
  },
];

export function getEcosystemBySlug(slug: string): EcosystemDefinition | undefined {
  return ecosystemDefinitions.find((item) => item.slug === slug);
}