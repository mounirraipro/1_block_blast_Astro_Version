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

## Build et deploiement

Utiliser `npm run build` comme commande de build dans Dokploy. Elle genere le
site statique avec Astro puis applique le nettoyage SEO de `scripts/cleanup-dist-seo.mjs`.

Avec Nixpacks et `dist` comme Publish Directory, Dokploy sert les fichiers via
Nginx : les fichiers `Caddyfile` et `public/_headers` ne configurent pas ses en-tetes.
Le `Caddyfile` reste utilisable pour les deploiements avec Caddy.

`public/ads.txt` ne contient actuellement que des commentaires et est copie
dans `dist/ads.txt` pendant le build.

Le jeu local conserve Google H5 Ads et les anciens appels GameDistribution
desactives. Les boutons de reanimation par publicite restent masques ; jouer
et rejouer fonctionnent sans pause publicitaire.

## Publicites Adsterra — desktop

Toutes les pages Astro (accueil, jeu, articles, index, categories et pages legales) utilisent une banniere 728x90 en haut, hors des commandes, a partir de 1024px de viewport et uniquement avec 728px disponibles. Les articles et pages de contenu utilisent leur colonne native pour le 160x600 a partir de 1200px. Les autres pages utilisent une colonne dediee sur les grands ecrans (1600px minimum). Une seule occurrence de chaque unite par document. Le lien sponsorise est une simple ligne en pied de contenu, sans carte ni faux bouton de jeu.

Aucun format desktop n'est charge ou redimensionne sur mobile. Aucun nouveau code mobile n'a ete invente. Il n'y a pas de faux visuel, de texte de demonstration ou de mode preview dans le code livre. Les emplacements non demandes restent invisibles. Les creations reelles viennent uniquement du fournisseur.

Les choix publicitaires sont un panneau repliable : ouvert pour un premier choix sur desktop, compact apres decision. L'autorisation existante est conservee et declenche automatiquement les formats disponibles, sans bouton par emplacement. Le retrait recharge le document si la Social Bar a deja ete chargee. GoogleTags est conserve et n'est pas pilote par ce choix Adsterra.

La Social Bar est active sur toutes les pages desktop sans iframe de jeu, y compris les index et pages legales. Elle reste exclue de l'accueil, de /play/ et des pages de jeux embarques : le fournisseur controle ses superpositions et aucune API documentee ne garantit de liberer les commandes de jeu. Les bannieres et Smartlink couvrent aussi ces pages. Pour activer la Social Bar pendant le jeu, faire valider un format non superpose par Adsterra ; aucun parametre de compte n'a ete modifie.

Les deux bannieres utilisent chacune un document srcdoc same-origin avec le snippet atOptions puis invoke.js synchrone. Le sandbox a origine opaque a ete retire pour permettre au fournisseur ses acces usuels au stockage et au document. Les options ne se melangent pas entre unites ; ce choix fait confiance au fournisseur comme tout script publicitaire tiers. Le guide officiel recommande les scripts dans le body et n'atteste pas notre wrapper : compatibilite finale, approbation du site et remplissage restent a confirmer avec le fournisseur.

CSP : seuls les hotes fournis sont autorises. Les domaines secondaires des creations et du fournisseur peuvent necessiter une liste officielle complementaire. Ne pas declarer la diffusion validee sans ce controle. Dokploy/Nginx applique sa propre configuration. Aucun elargissement img-src a blob: n'a ete applique : la limitation preexistante sur rotate_screen/inllogo du jeu reste en attente d'autorisation.

QA : substituer les scripts avant execution, pas seulement intercepter les requetes des iframes ; aucune annonce a cliquer ni impression artificielle. Les mocks sont exclusivement dans les scripts de test hors du depot. ads.txt reste compose de commentaires, sans vendeur invente.

References :
- https://help-publishers.adsterra.com/en/articles/5210780-adding-ads-to-a-static-html-site
- https://help-publishers.adsterra.com/en/articles/9571958-displaying-different-banners-on-mobile-and-desktop
