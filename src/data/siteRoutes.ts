export type SiteRoute = {
  path: string;
  title: string;
  group: "main" | "content" | "legal";
};

export const siteRoutes: SiteRoute[] = [
  { path: "/", title: "Accueil", group: "main" },
  { path: "/play", title: "Jouer", group: "main" },
  { path: "/games", title: "Jeux similaires", group: "main" },
  { path: "/categories", title: "Categories", group: "main" },
  { path: "/how-to-play", title: "Comment jouer", group: "content" },
  { path: "/blog", title: "Blog", group: "content" },
  { path: "/about", title: "A propos", group: "content" },
  { path: "/contact", title: "Contact", group: "content" },
  { path: "/faq", title: "FAQ", group: "content" },
  { path: "/parents", title: "Parents", group: "content" },
  { path: "/strategy", title: "Strategie", group: "content" },
  { path: "/difficulty-guide", title: "Astuces Block Blast", group: "content" },
  { path: "/game-mechanics", title: "Block Blast sur PC", group: "content" },
  { path: "/accessibility", title: "Accessibilite", group: "legal" },
  { path: "/privacy-policy", title: "Confidentialite", group: "legal" },
  { path: "/cookie-policy", title: "Cookies", group: "legal" },
  { path: "/terms", title: "Conditions", group: "legal" },
  { path: "/disclaimer", title: "Mentions", group: "legal" },
  { path: "/sitemap", title: "Sitemap", group: "main" },
];
