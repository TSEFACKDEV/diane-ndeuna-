
import { EcosystemEntityCode, MembershipStatus, Role } from "@/lib/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


async function main(): Promise<void> {
  console.log("Début du seed...");

  const adminPasswordHash = await bcrypt.hash("", 12);

  const admin = await prisma.user.upsert({
    where: { email: "contact@dianendeuna.com" },
    update: {},
    create: {
      email: "contact@dianendeuna.com",
      password: adminPasswordHash,
      fullName: "Diane NDEUNA",
      role: Role.ADMIN,
      membershipStatus: MembershipStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  console.log(`Administrateur créé : ${admin.email}`);

  const ecosystemEntities = [
    {
      code: EcosystemEntityCode.ADEF,
      nameFr: "ADEF — Agence de Développement de l'Entrepreneuriat Féminin",
      nameEn: "ADEF — Women Entrepreneurship Development Agency",
      sloganFr: null,
      sloganEn: null,
      descriptionFr:
        "Incubation, accélération, mise en relation avec les investisseurs et accès aux marchés pour les entrepreneures africaines, à travers des programmes sectoriels ciblés et des événements dédiés.",
      descriptionEn:
        "Incubation, acceleration, investor matchmaking and market access for African women entrepreneurs, through targeted sectoral programs and dedicated events.",
      logoUrl: "/images/logo-adef.png",
    },
    {
      code: EcosystemEntityCode.EDEN_AFRICA,
      nameFr: "EDEN AFRICA",
      nameEn: "EDEN AFRICA",
      sloganFr: "Structurer. Accélérer. Transformer.",
      sloganEn: "Structure. Accelerate. Transform.",
      descriptionFr:
        "Organisation panafricaine d'impact présente depuis 14 ans dans 15 pays, accréditée auprès de l'OIF. Présidente du COING Francophonie 2024-2025, regroupant 128 organisations.",
      descriptionEn:
        "Pan-African impact organization active for 14 years across 15 countries, accredited by the OIF. Chairs the COING Francophonie 2024-2025, gathering 128 organizations.",
      logoUrl: "/images/logo-eden-africa.png",
    },
    {
      code: EcosystemEntityCode.MIA_AFRICA,
      nameFr: "MIA AFRICA — MAMIZA Intelligence Artificielle",
      nameEn: "MIA AFRICA — MAMIZA Artificial Intelligence",
      sloganFr: "Africaines Augmentées",
      sloganEn: "Augmented African Women",
      descriptionFr:
        "Plateforme dédiée à la sous-représentation des femmes dans l'intelligence artificielle (22% au niveau mondial), à travers des formations, du mentorat et des espaces de visibilité.",
      descriptionEn:
        "Platform dedicated to addressing women's underrepresentation in artificial intelligence (22% globally), through training, mentorship and visibility spaces.",
      logoUrl: "/images/logo-mia-africa.png",
    },
    {
      code: EcosystemEntityCode.OSCF,
      nameFr: "OSCF — Observatoire de la Société Civile Francophone",
      nameEn: "OSCF — Francophone Civil Society Observatory",
      sloganFr: null,
      sloganEn: null,
      descriptionFr:
        "Plateforme internationale d'analyse des dynamiques citoyennes, produisant études, données et rapports sur la société civile francophone.",
      descriptionEn:
        "International platform analyzing civic dynamics, producing studies, data and reports on francophone civil society.",
      logoUrl: "/images/logo-oscf.png",
    },
  ];

  for (const entity of ecosystemEntities) {
    await prisma.ecosystemEntity.upsert({
      where: { code: entity.code },
      update: entity,
      create: entity,
    });
  }

  console.log(`${ecosystemEntities.length} entités écosystème créées.`);

  console.log("Seed terminé avec succès.");
}

main()
  .catch((error) => {
    console.error("Erreur durant le seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });