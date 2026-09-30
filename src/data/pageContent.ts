import { ADSTERRA_ENABLED } from "@/data/advertising";
import { siteConfig } from "@/data/siteConfig";

export type ContentSection = {
  heading: string;
  body?: string;
  items?: string[];
};

export type ContentPage = {
  title: string;
  description: string;
  seoTitle?: string;
  keywords?: string[];
  schemaType?: "AboutPage" | "Article" | "Blog" | "ContactPage" | "FAQPage" | "HowTo" | "PrivacyPolicy" | "TermsOfService" | "WebPage";
  eyebrow?: string;
  updated?: string;
  intro: string;
  sections: ContentSection[];
};

const gameName = siteConfig.name;
const contact = siteConfig.contactEmail;
const updated = "6 juillet 2026";

export const pageContent = {
  about: {
    title: "A propos de blockblast.fr",
    seoTitle: "A propos de blockblast.fr - Site independant Block Blast",
    description: "Decouvrez blockblast.fr, un site francophone independant pour jouer a un puzzle de blocs inspire des jeux de placement, sans se presenter comme l'application officielle.",
    keywords: ["blockblast.fr", "site independant Block Blast", "Block Blast francais"],
    schemaType: "AboutPage",
    intro: "blockblast.fr propose une experience de jeu de blocs dans le navigateur, avec des guides clairs pour les joueurs francophones.",
    sections: [
      {
        heading: "Notre position",
        body: "blockblast.fr est un site independant. Il n'est pas le site officiel de l'application mobile Block Blast, de son editeur ou de son studio. Notre objectif est de proposer une page de jeu, des explications et des guides utiles autour des puzzles de blocs.",
      },
      {
        heading: "Ce que vous trouverez ici",
        items: [
          "Une zone de jeu en navigateur preparee pour recevoir les fichiers finaux du jeu.",
          "Des guides en francais pour comprendre les regles, progresser et jouer sur PC.",
          "Une selection de jeux de blocs et de puzzles similaires via des iframes Playgama.",
          "Des pages legales et de support adaptees a un site statique leger.",
        ],
      },
      {
        heading: "Pourquoi ce site existe",
        body: "Les recherches francophones autour de Block Blast melangent souvent plusieurs intentions: jouer rapidement, comprendre les regles, trouver une version sans telechargement, ou chercher des jeux proches. blockblast.fr organise ces reponses dans un format simple et lisible.",
      },
    ],
  },
  accessibility: {
    title: "Declaration d'accessibilite",
    seoTitle: `Accessibilite | ${gameName}`,
    description: "Engagement d'accessibilite de blockblast.fr pour un jeu de blocs jouable et des contenus lisibles sur navigateur.",
    keywords: ["accessibilite Block Blast", "jeu de blocs accessible"],
    updated,
    intro: "Nous cherchons a rendre le site lisible, navigable et utilisable sur ordinateur, tablette et mobile.",
    sections: [
      {
        heading: "Notre engagement",
        body: "blockblast.fr utilise une structure HTML semantique, des contrastes lisibles et une navigation simple. La zone de jeu peut dependre des fichiers finaux ajoutes plus tard, mais le site autour du jeu reste concu pour etre facile a consulter.",
      },
      {
        heading: "Mesures en place",
        items: [
          "Navigation claire entre accueil, jeu, guides, jeux similaires et pages legales.",
          "Textes en francais avec titres descriptifs.",
          "Balises meta, titres et donnees structurees pour aider les navigateurs et outils d'assistance.",
          "Mise en page responsive pour les tailles d'ecran courantes.",
        ],
      },
      {
        heading: "Signaler un probleme",
        body: `Si vous rencontrez un obstacle d'accessibilite, contactez-nous a ${contact}.`,
      },
    ],
  },
  blog: {
    title: "Blog Block Blast",
    seoTitle: "Blog Block Blast - Guides, astuces et jeux de blocs",
    description: "Articles en francais sur Block Blast en ligne, les jeux de blocs gratuits, les astuces de placement et les alternatives sans telechargement.",
    keywords: ["blog Block Blast", "astuces Block Blast", "strategie block puzzle"],
    schemaType: "Blog",
    intro: "Des reponses directes pour mieux jouer, choisir une version navigateur et progresser dans les puzzles de blocs.",
    sections: [
      {
        heading: "Sujets principaux",
        items: [
          "Comment jouer a Block Blast.",
          "Astuces pour garder de la place sur la grille.",
          "Jeux comme Block Blast et alternatives de puzzle blocs.",
          "Jouer sans telechargement ou sur PC.",
        ],
      },
    ],
  },
  contact: {
    title: "Contact",
    seoTitle: "Contact blockblast.fr - Support et remarques",
    description: "Contactez blockblast.fr pour signaler un probleme, une question de confidentialite, une correction ou une demande liee au site.",
    keywords: ["contact blockblast.fr", "support Block Blast"],
    schemaType: "ContactPage",
    intro: "Pour une question, une correction ou un signalement technique, utilisez l'adresse de contact du site.",
    sections: [
      {
        heading: "Adresse de contact",
        items: [`Email: ${contact}`, "Reponse habituelle: sous quelques jours ouvrables.", "Langue: francais ou anglais."],
      },
      {
        heading: "Informations utiles",
        items: [
          "Indiquez la page concernee.",
          "Precisez votre navigateur et votre appareil.",
          "Decrivez le probleme observe et le resultat attendu.",
        ],
      },
      {
        heading: "Demandes liees a l'application officielle",
        body: "blockblast.fr est independant. Pour les achats, comptes, pubs ou problemes propres a une application mobile officielle, contactez directement l'editeur de l'application concernee.",
      },
    ],
  },
  "cookie-policy": {
    title: "Politique relative aux cookies",
    seoTitle: "Cookies blockblast.fr - Publicite et preferences",
    description: "Explication des cookies, du stockage local et des services tiers pouvant etre utilises sur blockblast.fr.",
    keywords: ["cookies blockblast.fr", "politique cookies jeu"],
    updated,
    intro: "Cette page explique comment les cookies et technologies similaires peuvent etre utilises sur blockblast.fr.",
    sections: [
      {
        heading: "Cookies essentiels",
        body: "Des cookies ou du stockage local peuvent servir a faire fonctionner le site, retenir certains reglages ou maintenir une experience de jeu stable.",
      },
      {
        heading: "Publicite et services tiers",
        body: "Le site peut afficher des publicites ou des jeux integres provenant de services tiers. Ces services peuvent utiliser leurs propres cookies selon leurs politiques.",
      },
      {
        heading: "Vos choix",
        body: ADSTERRA_ENABLED ? "Les choix publicitaires en bas de page permettent d’autoriser ou de refuser les scripts Adsterra. Cette preference est conservee dans le stockage local du navigateur. Vous pouvez aussi effacer les cookies et les donnees du site dans les reglages de votre navigateur. Ce choix ne modifie pas les reglages des outils Google ni des jeux tiers." : "Les publicites Adsterra sont actuellement suspendues, y compris pour les visiteurs ayant deja donne leur autorisation. Vous pouvez effacer les donnees du site dans les reglages de votre navigateur. Les outils Google et les jeux tiers conservent leurs propres reglages.",
      },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    seoTitle: "Disclaimer Block Blast - Site independant",
    description: "blockblast.fr est un site independant et ne pretend pas etre l'application officielle Block Blast ni son editeur.",
    keywords: ["Block Blast independant", "disclaimer Block Blast"],
    updated,
    intro: "Cette page clarifie le statut independant et les limites d'information de blockblast.fr.",
    sections: [
      {
        heading: "Site independant",
        body: "blockblast.fr n'est pas le site officiel de l'application mobile Block Blast, de Hungry Studio ou d'un autre editeur. Les marques, noms d'applications et references eventuelles appartiennent a leurs proprietaires respectifs.",
      },
      {
        heading: "Contenu informatif",
        body: "Les guides, astuces et articles sont fournis a titre informatif et de divertissement. Ils ne garantissent pas un score, un resultat ou une compatibilite parfaite avec toutes les versions de jeux de blocs.",
      },
      {
        heading: "Liens et jeux tiers",
        body: "Certaines pages peuvent integrer des jeux ou liens tiers. Nous ne controlons pas leurs contenus, publicites, mises a jour ou politiques de donnees.",
      },
    ],
  },
  faq: {
    title: "Questions frequentes",
    seoTitle: "FAQ Block Blast - Gratuit, en ligne, PC et sans telechargement",
    description: "Reponses rapides sur Block Blast en ligne, la version gratuite, le jeu sans telechargement, le PC et le statut independant de blockblast.fr.",
    keywords: ["FAQ Block Blast", "Block Blast gratuit", "Block Blast sans telechargement"],
    schemaType: "FAQPage",
    intro: "Les reponses courtes avant de jouer.",
    sections: [
      {
        heading: "blockblast.fr est-il le site officiel de Block Blast ?",
        body: "Non. blockblast.fr est un site independant. Il ne se presente pas comme l'application officielle ni comme son editeur.",
      },
      {
        heading: "Peut-on jouer a Block Blast en ligne gratuitement ?",
        body: "Oui, le site est prepare pour proposer un jeu de blocs jouable dans le navigateur. La zone actuelle utilise des fichiers placeholder que vous pourrez remplacer par les fichiers finaux du jeu.",
      },
      {
        heading: "Faut-il telecharger quelque chose ?",
        body: "Non. L'objectif de blockblast.fr est une experience de navigateur: ouvrir la page, lancer le jeu et jouer sans installer d'application.",
      },
      {
        heading: "Block Blast fonctionne-t-il sur PC ?",
        body: "Oui, un navigateur moderne sur PC suffit pour jouer a la version web du site. Le confort est souvent meilleur avec une souris ou un grand ecran.",
      },
      {
        heading: "Quelles sont les regles principales ?",
        body: "Placez les formes de blocs sur la grille, completez des lignes ou colonnes pour les effacer, et gardez assez d'espace pour les pieces suivantes.",
      },
    ],
  },
  "how-to-play": {
    title: "Comment jouer a Block Blast",
    seoTitle: "Comment jouer a Block Blast - Regles simples et guide debutant",
    description: "Guide rapide pour apprendre comment jouer a Block Blast: placer les blocs, effacer lignes et colonnes, anticiper les formes et eviter de bloquer la grille.",
    keywords: ["comment jouer a Block Blast", "regles Block Blast", "jouer a Block Blast"],
    schemaType: "HowTo",
    intro: "Reponse courte: placez chaque forme sur la grille, completez des lignes ou colonnes pour liberer de l'espace, et anticipez les pieces suivantes.",
    sections: [
      {
        heading: "Objectif du jeu",
        body: "Dans un block puzzle, vous devez poser des formes sur une grille. Quand une ligne ou une colonne est remplie, elle disparait et libere de la place. La partie continue tant qu'au moins une piece peut encore etre placee.",
      },
      {
        heading: "Etape 1: observez les trois pieces",
        body: "Regardez les formes disponibles avant de poser la premiere. Une grande piece doit souvent etre placee avant les petites, car elle demande plus d'espace.",
      },
      {
        heading: "Etape 2: gardez une zone ouverte",
        body: "Evitez de disperser les blocs partout. Une grande zone libre au centre ou sur un cote donne plus d'options pour les pieces difficiles.",
      },
      {
        heading: "Etape 3: preparez les lignes",
        body: "Ne cherchez pas seulement a poser une piece. Essayez de preparer une ligne ou une colonne qui pourra etre terminee avec la piece suivante.",
      },
      {
        heading: "Etape 4: evitez les trous",
        body: "Les trous isoles sont dangereux parce que beaucoup de formes ne peuvent pas les remplir. Laissez des espaces propres, rectangulaires et faciles a exploiter.",
      },
    ],
  },
  parents: {
    title: "Guide parents",
    seoTitle: "Block Blast pour parents - Jeu de puzzle gratuit en navigateur",
    description: "Informations pour les parents sur blockblast.fr, les jeux de blocs, la publicite, les services tiers et le jeu sans compte.",
    keywords: ["Block Blast enfants", "jeu de blocs famille", "parents puzzle gratuit"],
    intro: "Un jeu de blocs simple peut convenir a des pauses courtes, a condition de garder un cadre clair.",
    sections: [
      {
        heading: "A retenir",
        body: "blockblast.fr est concu comme un site de jeu de puzzle et de guides. Il ne demande pas de compte pour consulter les pages et vise une utilisation simple sur navigateur.",
      },
      {
        heading: "Points a surveiller",
        items: [
          "Les jeux ou publicites tiers peuvent avoir leurs propres politiques.",
          "Le temps de jeu doit rester adapte a l'age et au contexte.",
          "Les parents peuvent utiliser les reglages du navigateur ou de l'appareil si necessaire.",
        ],
      },
    ],
  },
  strategy: {
    title: "Guide de strategie Block Blast",
    seoTitle: "Guide de strategie Block Blast - Progresser au puzzle de blocs",
    description: "Strategie Block Blast en francais: garder l'espace ouvert, gerer les grandes formes, creer des doubles nettoyages et eviter les blocages.",
    keywords: ["strategie Block Blast", "guide strategie block puzzle", "progresser Block Blast"],
    schemaType: "Article",
    intro: "La meilleure strategie est de proteger l'espace disponible: une grille propre bat presque toujours un placement rapide mais desordonne.",
    sections: [
      {
        heading: "Priorisez les grandes pieces",
        body: "Les grandes formes sont celles qui terminent les parties. Placez-les tant que la grille est flexible, puis utilisez les petites pieces pour fermer des lignes.",
      },
      {
        heading: "Construisez deux lignes a la fois",
        body: "Un bon placement prepare souvent une ligne horizontale et une colonne verticale. Les nettoyages doubles liberent beaucoup d'espace et prolongent la partie.",
      },
      {
        heading: "Gardez les coins propres",
        body: "Les coins mal remplis creent vite des zones mortes. Utilisez-les pour des formes simples et evitez d'y enfermer des cases vides.",
      },
      {
        heading: "Acceptez les petits scores utiles",
        body: "Chercher toujours le gros combo peut bloquer la grille. Un nettoyage modeste mais regulier vaut mieux qu'une attente trop risquee.",
      },
    ],
  },
  "difficulty-guide": {
    title: "Astuces Block Blast",
    seoTitle: "Astuces Block Blast - Conseils simples pour faire durer la partie",
    description: "Astuces Block Blast pour debutants et joueurs reguliers: eviter les trous, anticiper les formes et garder une grille lisible.",
    keywords: ["astuces Block Blast", "conseils Block Blast", "tips Block Blast"],
    schemaType: "Article",
    intro: "Commencez par une grille propre, posez les grandes formes tot et ne laissez pas les trous s'accumuler.",
    sections: [
      {
        heading: "Gardez un rectangle libre",
        body: "Essayez de conserver un espace libre assez grand pour accueillir une piece longue ou carree. Plus votre zone libre est simple, plus les prochains choix seront faciles.",
      },
      {
        heading: "Ne remplissez pas tout le centre",
        body: "Le centre donne le plus de possibilites. Si vous le surchargez trop vite, les pieces longues deviennent difficiles a placer.",
      },
      {
        heading: "Nettoyez avant d'etre force",
        body: "N'attendez pas que la grille soit presque pleine. Une ligne effacee au bon moment vaut souvent plus qu'un placement spectaculaire trop tardif.",
      },
      {
        heading: "Regardez les trois formes ensemble",
        body: "Un ordre de placement different peut changer toute la grille. Testez mentalement les trois pieces avant le premier mouvement.",
      },
    ],
  },
  "game-mechanics": {
    title: "Block Blast sur PC",
    seoTitle: "Block Blast sur PC - Jouer dans le navigateur sans installation",
    description: "Guide pour jouer a Block Blast sur PC: navigateur, confort d'ecran, controles souris et avantages d'une version sans telechargement.",
    keywords: ["Block Blast sur PC", "jouer a Block Blast PC", "Block Blast navigateur PC"],
    schemaType: "Article",
    intro: "Sur PC, le plus simple est d'utiliser une version web dans un navigateur moderne: aucune installation, un grand ecran et des placements precis a la souris.",
    sections: [
      {
        heading: "Pourquoi jouer sur PC",
        body: "Un ecran plus large rend la grille plus lisible. La souris facilite les placements precis, surtout quand la partie devient serree.",
      },
      {
        heading: "Configuration conseillee",
        items: [
          "Un navigateur moderne comme Chrome, Edge, Firefox ou Safari.",
          "Une connexion stable pour charger le jeu et les iframes tiers.",
          "Un zoom navigateur a 100% si la grille semble trop grande ou trop petite.",
        ],
      },
      {
        heading: "Sans installation",
        body: "La version web evite les emulateurs et les telechargements. Vous ouvrez la page, lancez la partie et fermez l'onglet quand vous avez termine.",
      },
    ],
  },
  "privacy-policy": {
    title: "Politique de confidentialite",
    seoTitle: "Confidentialite blockblast.fr - Donnees, contact et services tiers",
    description: "Politique de confidentialite de blockblast.fr: donnees de contact, informations techniques, publicite, services tiers et droits des utilisateurs.",
    keywords: ["confidentialite blockblast.fr", "donnees jeu navigateur"],
    schemaType: "PrivacyPolicy",
    updated,
    intro: "Nous cherchons a limiter les donnees collectees et a expliquer clairement les services pouvant intervenir sur le site.",
    sections: [
      {
        heading: "Donnees que vous fournissez",
        body: "Si vous nous contactez, vous pouvez fournir volontairement une adresse email, un nom et le contenu de votre message.",
      },
      {
        heading: "Donnees techniques",
        body: "Le serveur, le navigateur ou des services tiers peuvent traiter des informations techniques comme l'adresse IP, le type d'appareil, le navigateur, les pages consultees et les journaux de securite.",
      },
      {
        heading: "Services tiers",
        body: "Les jeux integres, publicites ou outils de mesure eventuels peuvent fonctionner selon leurs propres politiques. Consultez les politiques des services concernes pour plus de details.",
      },
      {
        heading: "Vos droits",
        body: `Pour toute question relative aux donnees, contactez-nous a ${contact}.`,
      },
    ],
  },
  terms: {
    title: "Conditions d'utilisation",
    seoTitle: "Conditions d'utilisation blockblast.fr",
    description: "Conditions d'utilisation de blockblast.fr pour l'acces au site, aux guides, aux jeux integres et aux contenus de puzzle blocs.",
    keywords: ["conditions blockblast.fr", "terms Block Blast"],
    schemaType: "TermsOfService",
    updated,
    intro: "En utilisant blockblast.fr, vous acceptez ces conditions d'utilisation.",
    sections: [
      {
        heading: "Utilisation du site",
        body: "Le site est fourni pour le divertissement et l'information. Vous ne devez pas tenter de perturber le service, contourner la securite ou copier massivement le contenu.",
      },
      {
        heading: "Independance",
        body: "blockblast.fr est independant et ne represente pas l'application officielle Block Blast ni son editeur.",
      },
      {
        heading: "Disponibilite",
        body: "Nous cherchons a garder le site accessible, mais nous ne garantissons pas une disponibilite permanente ni une compatibilite avec tous les appareils.",
      },
    ],
  },
} satisfies Record<string, ContentPage>;

export type PageKey = keyof typeof pageContent;
