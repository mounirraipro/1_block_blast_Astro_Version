export type ExternalGame = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  seoOverview: string;
  howToPlay: string;
  strategyGuide: string;
  playerTips: string[];
  category: string;
  thumbnail: string;
  iframeUrl: string;
  accent: string;
  accentClass: string;
};

const playgamaCatalogId = "p_eb5ee739-3023-44bb-875d-81fe60b91666";
const playgamaIframeUrl = (slug: string) => `https://playgama.com/export/game/${slug}?clid=${playgamaCatalogId}`;
const playgamaThumbnail = (slug: string, extension = "webp") => `/game-thumbs/playgama/${slug}.${extension}`;

export const externalGames = [
  {
    slug: "block-puzzle",
    title: "Block Puzzle",
    shortTitle: "Block Puzzle",
    description: "Jouez a un block puzzle gratuit en ligne: placez les formes, completez des lignes et gardez la grille ouverte.",
    seoOverview: "Block Puzzle est le choix le plus proche pour les visiteurs qui cherchent un jeu comme Block Blast. Le principe repose sur la meme tension: poser des formes sur une grille, effacer des lignes ou colonnes et conserver assez d'espace pour les prochains blocs.",
    howToPlay: "Glissez chaque forme sur la grille. Une ligne ou une colonne complete disparait et libere de la place. La partie se termine quand aucune piece disponible ne peut etre posee.",
    strategyGuide: "Gardez une grande zone libre, posez les grandes pieces avant d'etre bloque et evitez les trous d'une case. Les nettoyages reguliers valent souvent mieux qu'un combo risque.",
    playerTips: [
      "Regardez les trois pieces avant de jouer.",
      "Gardez le centre flexible pour les grandes formes.",
      "Evitez les cases vides isolees.",
      "Nettoyez une ligne avant que la grille soit trop pleine.",
    ],
    category: "Blocs",
    thumbnail: playgamaThumbnail("block-puzzle"),
    iframeUrl: playgamaIframeUrl("block-blast-master"),
    accent: "#16a34a",
    accentClass: "accent-green",
  },
  {
    slug: "sudoku-block-puzzle",
    title: "Sudoku Block Puzzle",
    shortTitle: "Sudoku Blocks",
    description: "Placez des blocs sur une grille type sudoku et effacez lignes, colonnes ou carres.",
    seoOverview: "Sudoku Block Puzzle attire les joueurs qui aiment Block Blast mais veulent une grille plus structuree. Les zones 3x3 ajoutent une couche de logique et donnent plus de facons de liberer de l'espace.",
    howToPlay: "Posez les formes sur la grille 9x9. Completez une ligne, une colonne ou un carre 3x3 pour l'effacer. Continuez tant que les pieces rentrent.",
    strategyGuide: "Essayez de preparer une ligne et un carre en meme temps. Ne remplissez pas tous les carres centraux trop vite et gardez de la place pour les pieces longues.",
    playerTips: [
      "Gardez au moins un carre 3x3 proche du nettoyage.",
      "Ne separez pas la grille en petites poches inutiles.",
      "Posez les grandes pieces quand l'espace est encore ouvert.",
      "Cherchez les nettoyages doubles.",
    ],
    category: "Logique",
    thumbnail: playgamaThumbnail("sudoku-block-puzzle"),
    iframeUrl: playgamaIframeUrl("sudoku-block-puzzle"),
    accent: "#0ea5e9",
    accentClass: "accent-sky",
  },
  {
    slug: "2048-merge-blocks",
    title: "2048 Merge Blocks",
    shortTitle: "2048 Blocks",
    description: "Fusionnez des blocs numeriques et construisez de grandes valeurs dans un puzzle gratuit.",
    seoOverview: "2048 Merge Blocks partage avec Block Blast le gout des decisions calmes et progressives. Ici, la grille se gere par fusion de nombres plutot que par effacement de lignes.",
    howToPlay: "Regroupez les blocs de meme valeur pour les fusionner. Visez des chaines propres et gardez les grandes valeurs proches les unes des autres.",
    strategyGuide: "Construisez autour d'une zone stable et evitez de disperser les valeurs importantes. Une fusion moyenne qui range la grille peut etre meilleure qu'une fusion forte qui isole les blocs.",
    playerTips: [
      "Gardez les grandes valeurs ensemble.",
      "Preservez de l'espace autour des nombres importants.",
      "Choisissez la fusion qui prepare le meilleur coup suivant.",
      "Evitez les blocs isoles dans les coins.",
    ],
    category: "Nombres",
    thumbnail: playgamaThumbnail("2048-merge-blocks"),
    iframeUrl: playgamaIframeUrl("2048-merge-blocks"),
    accent: "#f97316",
    accentClass: "accent-orange",
  },
  {
    slug: "brain-line-connect",
    title: "Brain Line Connect",
    shortTitle: "Line Connect",
    description: "Tracez une ligne continue et resoudre des niveaux de logique en navigateur.",
    seoOverview: "Brain Line Connect est une alternative plus lineaire aux jeux de blocs. Il demande de planifier un chemin avant d'agir, ce qui plait aux joueurs qui aiment anticiper plusieurs coups.",
    howToPlay: "Reliez les points avec une seule ligne continue sans toucher les obstacles. Recommencez si le chemin bloque une zone importante.",
    strategyGuide: "Reperez les couloirs et les points de passage etroits avant de commencer. Les zones contraintes se resolvent souvent en premier.",
    playerTips: [
      "Planifiez avant de tracer.",
      "Commencez par les passages etroits.",
      "Testez parfois le chemin a l'envers.",
      "Ne gaspillez pas les zones ouvertes trop tot.",
    ],
    category: "Logique",
    thumbnail: playgamaThumbnail("brain-line-connect"),
    iframeUrl: playgamaIframeUrl("brain-line-connect"),
    accent: "#8b5cf6",
    accentClass: "accent-violet",
  },
  {
    slug: "sudoku",
    title: "Sudoku",
    shortTitle: "Sudoku",
    description: "Jouez au Sudoku en ligne, un classique de logique calme et gratuit.",
    seoOverview: "Sudoku convient aux visiteurs qui veulent un puzzle plus deductif que Block Blast. Les decisions sont plus lentes, mais la satisfaction vient du meme principe: garder une structure propre.",
    howToPlay: "Remplissez la grille avec les chiffres de 1 a 9 sans repetition dans chaque ligne, colonne et carre 3x3.",
    strategyGuide: "Commencez par les zones presque completes, cherchez les chiffres qui n'ont qu'une seule place possible et evitez de deviner trop tot.",
    playerTips: [
      "Scannez les lignes les plus remplies.",
      "Utilisez les notes si elles sont disponibles.",
      "Verifiez ligne, colonne et carre avant de valider.",
      "Cherchez les singles caches.",
    ],
    category: "Logique",
    thumbnail: playgamaThumbnail("sudoku"),
    iframeUrl: playgamaIframeUrl("sudoku"),
    accent: "#2563eb",
    accentClass: "accent-blue",
  },
  {
    slug: "mahjong-connect",
    title: "Mahjong Connect",
    shortTitle: "Mahjong",
    description: "Associez les tuiles identiques avec un chemin libre dans ce puzzle navigateur.",
    seoOverview: "Mahjong Connect est une alternative de scan visuel. Comme dans Block Blast, chaque suppression change la grille et peut ouvrir de nouvelles possibilites.",
    howToPlay: "Trouvez deux tuiles identiques pouvant etre reliees par un chemin libre. Retirez les paires jusqu'a vider le plateau.",
    strategyGuide: "Commencez par les bords, puis retirez les paires qui ouvrent le plus de chemins. Une paire facile n'est pas toujours la meilleure.",
    playerTips: [
      "Scannez les bords en premier.",
      "Choisissez les paires qui liberent de l'espace.",
      "Rescannez apres chaque suppression.",
      "Gardez les paires evidentes si un meilleur coup ouvre le plateau.",
    ],
    category: "Tuiles",
    thumbnail: playgamaThumbnail("mahjong-connect"),
    iframeUrl: playgamaIframeUrl("mahjong-lines"),
    accent: "#14b8a6",
    accentClass: "accent-green",
  },
] satisfies ExternalGame[];

export const getExternalGameBySlug = (slug: string) => externalGames.find((game) => game.slug === slug);
