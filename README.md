# blockblast.fr Astro

Projet Astro statique pour `https://blockblast.fr`, clone du pattern Jigsolitaire adapte en francais pour un site independant de jeu de blocs.

## Inclus

- Sortie statique Astro
- Layout reutilisable `BaseLayout`
- Donnees SEO et contenu dans `src/data`
- Accueil avec iframe jouable
- Pages `/play/`, `/games/`, `/categories/`, `/blog/`
- Pages FAQ, a propos, contact, confidentialite, cookies, conditions, disclaimer, sitemap et robots
- Dossier `public/game/` prepare avec placeholder propre
- Icone SVG placeholder

## Setup

```bash
npm install
npm run dev
```

Pour la production:

```bash
SITE_URL=https://blockblast.fr
```

Le site est independant et ne se presente pas comme l'application officielle Block Blast ni comme son editeur.
