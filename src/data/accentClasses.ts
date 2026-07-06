export const brandAccentClass = "accent-coral";

export const getCategoryAccentClass = (name: string) => {
  const key = name.toLowerCase();
  if (key === "placement") return "accent-green";
  if (key === "lignes") return "accent-sky";
  if (key === "strategie") return "accent-orange";
  if (key === "sans telechargement") return "accent-gold";
  if (key === "sur pc") return "accent-blue";
  if (key === "alternatives") return "accent-violet";
  if (key === "combos") return "accent-clay";
  return brandAccentClass;
};
