import { pageContent, type ContentPage, type PageKey } from "@/data/pageContent";
import { siteConfig } from "@/data/siteConfig";
import { siteRoutes, type SiteRoute } from "@/data/siteRoutes";

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  seoTitle?: string;
  keywords?: string[];
  schemaType?: string;
  noIndex?: boolean;
  priority?: number;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  updated?: string;
};

const baseKeywords = siteConfig.topicKeywords;

const contentPagePaths: Record<PageKey, string> = {
  about: "/about",
  accessibility: "/accessibility",
  blog: "/blog",
  contact: "/contact",
  "cookie-policy": "/cookie-policy",
  disclaimer: "/disclaimer",
  faq: "/faq",
  "how-to-play": "/how-to-play",
  parents: "/parents",
  strategy: "/strategy",
  "difficulty-guide": "/difficulty-guide",
  "game-mechanics": "/game-mechanics",
  "privacy-policy": "/privacy-policy",
  terms: "/terms",
};

const contentSeo = (Object.entries(pageContent) as [PageKey, ContentPage][]).map(([key, page]) => ({
  path: contentPagePaths[key as PageKey],
  title: page.title,
  description: page.description,
  seoTitle: page.seoTitle,
  keywords: page.keywords,
  schemaType: page.schemaType,
  updated: page.updated,
}));

const routeFallbackSeo = (route: SiteRoute): SeoPage => ({
  path: route.path,
  title: route.title,
  description:
    route.path === "/"
      ? siteConfig.description
      : `${route.title} sur ${siteConfig.name}, un site independant de ${siteConfig.gameGenre} en navigateur, gratuit et sans telechargement.`,
  schemaType: "WebPage",
});

const pageOverrides: Partial<Record<string, Partial<SeoPage>>> = {
  "/": {
    title: siteConfig.name,
    seoTitle: "Block Blast en ligne gratuit - Jeu de blocs sans telechargement",
    description: siteConfig.description,
    priority: 1,
    changeFrequency: "weekly",
  },
  "/play": {
    seoTitle: "Jouer a Block Blast en ligne - Gratuit sur navigateur",
    description: "Jouez a Block Blast en ligne gratuitement sur blockblast.fr, sans telechargement, avec une zone de jeu navigateur preparee pour les fichiers finaux.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/games": {
    seoTitle: "Jeux comme Block Blast - Jeux de blocs gratuits en ligne",
    description: "Decouvrez des jeux comme Block Blast: block puzzle, Sudoku Block Puzzle, 2048, jeux de logique et puzzles gratuits jouables via navigateur.",
    schemaType: "CollectionPage",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/categories": {
    seoTitle: "Categories de jeux de blocs - Puzzle blocs gratuit",
    description: "Parcourez les categories de jeux de blocs: placement, lignes, logique, puzzle blocs, combos et jeux sans telechargement.",
    priority: 0.75,
  },
  "/how-to-play": {
    schemaType: "HowTo",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/blog": {
    schemaType: "Blog",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  "/faq": {
    schemaType: "FAQPage",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/contact": {
    schemaType: "ContactPage",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  "/privacy-policy": {
    schemaType: "WebPage",
    priority: 0.45,
    changeFrequency: "yearly",
  },
  "/terms": {
    schemaType: "WebPage",
    priority: 0.45,
    changeFrequency: "yearly",
  },
  "/cookie-policy": {
    priority: 0.4,
    changeFrequency: "yearly",
  },
  "/disclaimer": {
    priority: 0.4,
    changeFrequency: "yearly",
  },
};

const contentByPath = new Map(contentSeo.map((page) => [page.path, page]));

export const seoPages: SeoPage[] = siteRoutes.map((route) => {
  const content = contentByPath.get(route.path);
  const fallback = routeFallbackSeo(route);
  const override = pageOverrides[route.path] ?? {};

  return {
    ...fallback,
    ...content,
    ...override,
    keywords: [...baseKeywords, ...(content?.keywords ?? []), ...(override.keywords ?? [])],
    priority: override.priority ?? 0.6,
    changeFrequency: override.changeFrequency ?? (route.group === "legal" ? "yearly" : "monthly"),
  };
});

export const seoByPath = new Map(seoPages.map((page) => [page.path, page]));

export const normalizePath = (pathname: string) => {
  const path = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  return path || "/";
};

export const withTrailingSlash = (path: string) => {
  if (!path || path === "/") return "/";
  if (path.includes(".") || path.endsWith("/")) return path;
  const [pathname, query = ""] = path.split("?");
  return `${pathname}/${query ? `?${query}` : ""}`;
};

export const getCanonicalUrl = (path: string, origin = siteConfig.siteUrl) => new URL(withTrailingSlash(path), origin).href;

export const getSeoForPath = (pathname: string): SeoPage => {
  const path = normalizePath(pathname);
  return seoByPath.get(path) ?? {
    path,
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: baseKeywords,
    schemaType: "WebPage",
    priority: 0.5,
    changeFrequency: "monthly",
  };
};

export const buildPageTitle = (page: SeoPage) => page.seoTitle ?? `${page.title} | ${siteConfig.name}`;

export const buildJsonLd = (page: SeoPage, canonicalUrl: string) => {
  const websiteId = `${siteConfig.siteUrl.replace(/\/$/, "")}/#website`;
  const publisherId = `${siteConfig.siteUrl.replace(/\/$/, "")}/#organization`;
  const pageId = `${canonicalUrl}#webpage`;
  const schemaType = page.schemaType ?? "WebPage";
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: siteConfig.siteUrl,
    },
    ...(page.path === "/"
      ? []
      : [
          {
            "@type": "ListItem",
            position: 2,
            name: page.title,
            item: canonicalUrl,
          },
        ]),
  ];

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: siteConfig.name,
      alternateName: ["Block Blast en ligne", "Block Blast gratuit", "Jeu de blocs gratuit"],
      url: siteConfig.siteUrl,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: {
        "@id": publisherId,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": publisherId,
      name: siteConfig.publisherName,
      url: siteConfig.siteUrl,
      sameAs: siteConfig.sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      "@id": pageId,
      url: canonicalUrl,
      name: buildPageTitle(page),
      headline: page.title,
      description: page.description,
      isPartOf: {
        "@id": websiteId,
      },
      about: siteConfig.topicKeywords,
      inLanguage: siteConfig.language,
      publisher: {
        "@id": publisherId,
      },
      dateModified: page.updated ?? siteConfig.legalLastUpdated,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    },
  ];
};
