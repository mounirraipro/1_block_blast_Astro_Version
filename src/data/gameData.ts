export type GameLevel = {
  id: number;
  title: string;
  gridSize: string;
  difficulty: string;
  image: string;
  thumbnail: string;
};

export type GameCategory = {
  slug: string;
  name: string;
  color: string;
  description: string;
  longDescription: string;
  levels: GameLevel[];
};

const placeholder = "/game-thumbs/game-placeholder.png";

const makeLevels = (baseId: number, prefix: string, difficulties: string[]) =>
  difficulties.map((difficulty, index) => ({
    id: baseId + index,
    title: `${prefix} ${index + 1}`,
    gridSize: index < 2 ? "8x8" : "9x9",
    difficulty,
    image: placeholder,
    thumbnail: placeholder,
  }));

export const categories = [
  {
    name: "Placement",
    slug: "animals",
    color: "#16a34a",
    description: "Jeux de placement de blocs ou chaque forme doit etre posee au bon endroit pour garder la grille ouverte.",
    longDescription: "La categorie Placement regroupe les intentions autour de Block Blast en ligne: poser des formes, creer des lignes et prolonger la partie sans bloquer la grille.",
    levels: makeLevels(1, "Placement blocs", ["Facile", "Moyen", "Difficile"]),
  },
  {
    name: "Lignes",
    slug: "art",
    color: "#0ea5e9",
    description: "Puzzles de lignes et colonnes ou le nettoyage regulier de la grille compte plus que la vitesse.",
    longDescription: "La categorie Lignes aide les joueurs a comprendre comment preparer des effacements horizontaux, verticaux et parfois doubles dans un puzzle blocs.",
    levels: makeLevels(10, "Lignes et colonnes", ["Facile", "Moyen", "Expert"]),
  },
  {
    name: "Strategie",
    slug: "cities",
    color: "#f97316",
    description: "Guides et defis de strategie pour anticiper les formes, proteger les grands espaces et eviter les trous.",
    longDescription: "La categorie Strategie met l'accent sur les decisions importantes: ordre de placement, gestion des grandes pieces et reduction des zones mortes.",
    levels: makeLevels(20, "Strategie blocs", ["Moyen", "Difficile", "Expert"]),
  },
  {
    name: "Sans telechargement",
    slug: "food",
    color: "#eab308",
    description: "Jeux de blocs gratuits accessibles directement dans le navigateur, sans compte et sans installation.",
    longDescription: "La categorie Sans telechargement repond aux joueurs qui cherchent une experience rapide: ouvrir la page, jouer, puis revenir plus tard sans installer d'application.",
    levels: makeLevels(30, "Navigateur", ["Facile", "Moyen", "Difficile"]),
  },
  {
    name: "Sur PC",
    slug: "nature",
    color: "#14b8a6",
    description: "Puzzles de blocs adaptes au PC avec grand ecran, controle souris et sessions de jeu confortables.",
    longDescription: "La categorie Sur PC met en avant les avantages d'un navigateur desktop: grille plus lisible, placements plus precis et meilleur confort pour les longues parties.",
    levels: makeLevels(40, "PC puzzle blocs", ["Facile", "Moyen", "Expert"]),
  },
  {
    name: "Alternatives",
    slug: "space",
    color: "#6366f1",
    description: "Jeux comme Block Blast, block puzzle, Sudoku Block Puzzle, 2048 et autres alternatives de logique.",
    longDescription: "La categorie Alternatives rassemble les recherches de joueurs qui veulent des jeux comme Block Blast mais avec des regles, rythmes ou grilles legerement differents.",
    levels: makeLevels(50, "Alternatives Block Blast", ["Facile", "Moyen", "Difficile"]),
  },
  {
    name: "Combos",
    slug: "fantasy",
    color: "#a855f7",
    description: "Conseils pour enchainer les nettoyages, liberer plusieurs lignes et garder une grille dynamique.",
    longDescription: "La categorie Combos couvre les placements qui preparent plusieurs nettoyages a la fois, utiles pour viser une partie plus longue et plus propre.",
    levels: makeLevels(60, "Combos blocs", ["Moyen", "Difficile", "Expert"]),
  },
] satisfies GameCategory[];

export const allLevels = categories.flatMap((category) => category.levels.map((level) => ({ category, level })));
export const getCategoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);
