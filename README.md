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

## Publicites Adsterra

- Les pages accueil, play, blog/articles et les quatre guides de jeu affichent un bloc publicitaire en fin de contenu : leaderboard 728x90 si la largeur disponible atteint 728px, puis Smartlink identifie comme publicite. Aucun bouton de jeu ni lien de navigation n'est detourne.
- Les articles et les guides ajoutent un skyscraper 160x600 dans leur colonne laterale seulement a partir de 1200px de viewport et avec 160px disponibles. Les colonnes contenant cette unite ne sont pas sticky. Aucune banniere n'est reduite pour tenir sur mobile ; les petits ecrans conservent le Smartlink.
- La Social Bar est chargee une seule fois sur blog/articles et guides, jamais sur accueil, play, jeux integres ou pages legales. Sa position et ses formats sont controles par Adsterra, pas par la position du script. Faire valider par le fournisseur des formats fermables sans recouvrement de navigation avant publication.
- Les scripts Adsterra attendent une autorisation explicite via les choix publicitaires. La preference locale versionnee concerne uniquement Adsterra ; ce mecanisme ne pretend pas etre une CMP certifiee et ne modifie pas GoogleTags. Un retrait recharge la page si la Social Bar a ete chargee pour supprimer ses effets.
- Chaque banniere recoit son propre document iframe sandboxe et son propre atOptions. Le sandbox bloque l'acces au DOM du jeu et la navigation de la page parente ; les clics publicitaires peuvent ouvrir un nouvel onglet. L'absence de allow-same-origin restreint cookies/stockage du cadre : compatibilite et attribution a confirmer aupres d'Adsterra. Les dimensions cachees ne declenchent pas de requete initiale.
- Les politiques CSP locales autorisent les hotes fournis, sans autorisation globale de scripts HTTPS. Les domaines supplementaires utilises par les creations/requetes Adsterra restent a valider avec le fournisseur avant une diffusion reelle ; une CSP active peut les bloquer. Dokploy/Nginx doit appliquer sa propre configuration (aucun reglage externe modifie ici).
- ads.txt reste compose de commentaires : aucun vendeur invente. Adsterra indique ne pas fournir de fichier obligatoire dans son guide d'integration HTML.
- QA : substituer les scripts dans srcdoc avant execution et simuler le chargeur Social Bar, puis bloquer tout autre acces externe (l’interception reseau seule peut manquer la premiere requete d’une iframe sandboxee dans Chromium) ; ne pas ouvrir les annonces reelles ni generer d'impressions de test. La simulation valide le cablage, pas le remplissage, les revenus, le consentement fournisseur ou la compatibilite sandbox reelle.

Documentation fournisseur :
- https://help-publishers.adsterra.com/en/articles/5210780-adding-ads-to-a-static-html-site
- https://help-publishers.adsterra.com/en/articles/9571958-displaying-different-banners-on-mobile-and-desktop

Limite CSP preexistante : img-src ne contient pas blob:. Lorsque ces en-tetes sont appliques, certaines images du jeu local (rotate_screen, inllogo) sont bloquees. Aucun elargissement de cette directive n’a ete applique dans cette integration.
