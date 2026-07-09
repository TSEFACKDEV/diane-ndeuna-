import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/about": {
      fr: "/about",
      en: "/about",
    },
    "/expertise": {
      fr: "/expertise",
      en: "/expertise",
    },
    "/expertise/structuration": {
      fr: "/expertise/structuration",
      en: "/expertise/structuration",
    },
    "/expertise/developpement-projets": {
      fr: "/expertise/developpement-projets",
      en: "/expertise/development-projects",
    },
    "/expertise/formation-coaching": {
      fr: "/expertise/formation-coaching",
      en: "/expertise/training-coaching",
    },
    "/expertise/conseil-strategique": {
      fr: "/expertise/conseil-strategique",
      en: "/expertise/strategic-advisory",
    },
    "/ecosysteme": {
      fr: "/ecosysteme",
      en: "/ecosystem",
    },
    "/ecosysteme/adef": {
      fr: "/ecosysteme/adef",
      en: "/ecosystem/adef",
    },
    "/ecosysteme/eden-africa": {
      fr: "/ecosysteme/eden-africa",
      en: "/ecosystem/eden-africa",
    },
    "/ecosysteme/mia-africa": {
      fr: "/ecosysteme/mia-africa",
      en: "/ecosystem/mia-africa",
    },
    "/ecosysteme/oscf": {
      fr: "/ecosysteme/oscf",
      en: "/ecosystem/oscf",
    },
    "/ressources": {
      fr: "/ressources",
      en: "/resources",
    },
    "/ressources/articles": {
      fr: "/ressources/articles",
      en: "/resources/articles",
    },
    "/ressources/livres-guides": {
      fr: "/ressources/livres-guides",
      en: "/resources/books-guides",
    },
    "/ressources/videos-podcasts": {
      fr: "/ressources/videos-podcasts",
      en: "/resources/videos-podcasts",
    },
    "/ressources/annuaire": {
      fr: "/ressources/annuaire",
      en: "/resources/directory",
    },
    "/ressources/liens-externes": {
      fr: "/ressources/liens-externes",
      en: "/resources/external-links",
    },
    "/blog": {
      fr: "/blog",
      en: "/blog",
    },
    "/blog/[slug]": {
      fr: "/blog/[slug]",
      en: "/blog/[slug]",
    },
    "/partenariats": {
      fr: "/partenariats",
      en: "/partnerships",
    },
    "/evenements/calendrier": {
      fr: "/evenements/calendrier",
      en: "/events/calendar",
    },
    "/evenements/passes": {
      fr: "/evenements/passes",
      en: "/events/past",
    },
    "/contact": {
      fr: "/contact",
      en: "/contact",
    },
    "/communaute/connexion": {
      fr: "/communaute/connexion",
      en: "/community/login",
    },
    "/communaute/inscription": {
      fr: "/communaute/inscription",
      en: "/community/register",
    },
    "/communaute/ressources-membres": {
      fr: "/communaute/ressources-membres",
      en: "/community/member-resources",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;