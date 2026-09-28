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

## Ezoic ads.txt et Dokploy

Avec Nixpacks et `dist` comme Publish Directory, Dokploy sert les fichiers via
Nginx et n'utilise pas le `Caddyfile` du projet.

`npm run build` recupere d'abord la liste geree par Ezoic depuis
`https://srv.adstxtmanager.com/19390/blockblast.fr`, verifie son format et les
entrees Ezoic, puis met a jour `public/ads.txt`. Astro copie ce fichier dans
`dist/ads.txt`. Le compte AdSense existant du site est conserve.

Utiliser `npm run build` comme commande de build dans Dokploy. La commande
`npm run ads:sync` permet aussi d'actualiser le fichier sans reconstruire le site.
Si Ezoic est inaccessible ou renvoie une liste invalide, le build s'arrete sans
remplacer le fichier existant.

La liste est actualisee a chaque build, pas entre deux deploiements. Pour une
actualisation quotidienne sans redeploiement, configurer une redirection HTTP
301 de `/ads.txt` vers l'URL Ezoic dans le serveur actif ou dans Cloudflare.
La redirection du `Caddyfile` reste utilisable pour les deploiements avec Caddy.

Apres deploiement, ouvrir `https://blockblast.fr/ads.txt` et verifier la presence
de l'entree `ezoic.ai`, puis relancer la verification dans Ezoic.
