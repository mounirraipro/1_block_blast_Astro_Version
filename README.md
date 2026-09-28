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
`dist/ads.txt`. Seule la liste geree par Ezoic est publiee ; l'ancien compte
AdSense ajoute manuellement a ete retire avec les publicites Google du jeu.

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

## Ezoic : scripts de connexion

`src/components/EzoicHead.astro` ajoute les deux scripts de consentement
Gatekeeper, le chargeur publicitaire Ezoic, sa file de commandes et le script
Ezoic Analytics. `BaseLayout.astro` les inclut juste apres la declaration du
charset, avant Google Tag Manager. Les scripts de consentement sont synchrones
et conservent `data-cfasync="false"` avant `src`.

Les scripts sont installes dans les pages Astro utilisant `BaseLayout`. La page
`https://blockblast.fr/privacy-policy/` contient le point d'insertion
`ezoic-privacy-policy-embed` fourni par Ezoic et un lien direct vers sa politique
generee. Enregistrer cette URL exacte dans les parametres de confidentialite
Ezoic pour activer l'injection de la politique propre au site.

Dokploy avec Nixpacks et `dist` utilise Nginx : les fichiers `Caddyfile` et
`public/_headers` ne configurent pas ses en-tetes. La reponse de production ne
contenait pas de Content-Security-Policy lors de cette integration. Si une CSP
est activee ensuite (Cloudflare, Nginx ou Caddy), autoriser les ressources Ezoic
et Gatekeeper avant de la deployer.

## Ezoic : emplacements publicitaires

`EzoicAd.astro` ajoute un emplacement sous le jeu sur `/` et `/play/`, au milieu
de chaque article du blog, et entre les sections de `/how-to-play/`,
`/strategy/`, `/difficulty-guide/` et `/game-mechanics/`. Les pages legales,
de contact et les iframes de jeux tiers ne recoivent pas d'emplacement.

`EzoicPlacements.astro` utilise l'API documentee `showAds` avec un selecteur CSS,
une seule fois par page apres le contenu. Aucun identifiant de placement du
dashboard n'est necessaire. Les formats autorises sont filtres selon la largeur
reelle de la colonne (250x250, 300x250, 336x280, et 728x90 sous le jeu).
`required: false` laisse Ezoic appliquer sa limite de densite publicitaire.
Les emplacements vides n'ont pas de hauteur minimale reservee.

Les formats flottants, video, interstitiels et ancrages sont desactives avant
la demande d'annonces pour laisser les commandes de jeu accessibles. Le jeu
local ne charge plus Google H5 Ads ni les anciens appels GameDistribution.
Les boutons de reanimation par publicite sont masques ; jouer et rejouer
fonctionnent sans pause publicitaire.

Apres redeploiement, tester `https://blockblast.fr/?ez_js_debugger=1` sans
bloqueur de publicite et verifier les demandes d'annonces dans l'outil Ezoic.
Verifier aussi une page de guide et `/play/` sur mobile. La diffusion reelle
depend de l'approbation du site, du consentement et des annonces disponibles.
