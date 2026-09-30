## Adsterra suspendu — 30 septembre 2026

`src/data/advertising.ts` contient `ADSTERRA_ENABLED = false` : aucun emplacement, Smartlink, panneau de consentement ni chargeur Adsterra ne doit etre actif, meme avec un ancien choix allow. Le code et toutes les cles restent conserves. Les paragraphs ci-dessous decrivent l'integration en pause.

Pour restaurer deliberement : confirmer les filtres de contenu avec le fournisseur, remettre ce drapeau a true, reconstruire et verifier avant deploiement. La suspension locale ne modifie pas le site deja deploye : publier le nouveau build par le processus habituel, invalider les caches si necessaire et recharger les pages ouvertes. Aucune publication n'a ete effectuee par cette modification.

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

Toutes les pages Astro (accueil, jeu, articles, index, categories et pages legales) utilisent deux bannieres 728x90, une en haut et une apres le contenu principal, hors des commandes, a partir de 1024px de viewport et uniquement avec 728px disponibles. Les articles et pages de contenu utilisent leur colonne native pour le 160x600 a partir de 1200px. Les autres pages utilisent une colonne dediee sur les grands ecrans (1600px minimum). Deux occurrences de la banniere 728x90 et au plus une du 160x600 par document, chacune avec ses propres options. Aucun rafraichissement automatique. Adsterra indique que repeter le meme code ne multiplie pas les impressions comptabilisees par visiteur unique. Le lien sponsorise est une simple ligne en pied de contenu, sans carte ni faux bouton de jeu.

Aucun format desktop n'est charge ou redimensionne sur mobile. Aucun nouveau code mobile n'a ete invente. Il n'y a pas de faux visuel, de texte de demonstration ou de mode preview dans le code livre. Les emplacements non demandes restent invisibles. Les legendes visibles autour des bannieres sont retirees ; les titres accessibles sont conserves. Le Smartlink reste identifie comme offre sponsorisee. Les creations reelles viennent uniquement du fournisseur.

Les choix publicitaires sont un panneau repliable : ouvert pour un premier choix sur desktop, compact apres decision. L'autorisation existante est conservee et declenche automatiquement les formats disponibles, sans bouton par emplacement. Le retrait recharge le document si un script publicitaire a deja ete charge. GoogleTags est conserve et n'est pas pilote par ce choix Adsterra.

La Social Bar est active sur toutes les pages desktop sans iframe de jeu, y compris les index et pages legales. Elle reste exclue de l'accueil, de /play/ et des pages de jeux embarques : le fournisseur controle ses superpositions et aucune API documentee ne garantit de liberer les commandes de jeu. Les bannieres et Smartlink couvrent aussi ces pages. Pour activer la Social Bar pendant le jeu, faire valider un format non superpose par Adsterra ; aucun parametre de compte n'a ete modifie.

Les tags des bannieres sont inseres directement dans le body a leur emplacement, sans iframe creee par le site. Le format iframe fourni reste inchange : le fournisseur cree lui-meme sa creation. Une file attend load/error de chaque invoke.js avant de definir atOptions pour le suivant, sans changer les cles, dimensions ou params. Aucun atAsyncOptions ou drapeau fournisseur non documente n'est invente. Le retrait recharge le document des qu'un tag a commence, pour supprimer aussi ses effets globaux. Un tag bloque sans evenement load/error bloque les suivants plutot que de risquer une collision. Le guide officiel recommande l'insertion dans le body ; le chargement conditionnel en serie est notre implementation, pas une API async certifiee par Adsterra. Le remplissage reel et la compatibilite du tag delivre restent a verifier cote fournisseur.

CSP : seuls les hotes fournis sont autorises. Les domaines secondaires des creations et du fournisseur peuvent necessiter une liste officielle complementaire. Ne pas declarer la diffusion validee sans ce controle. Dokploy/Nginx applique sa propre configuration. Aucun elargissement img-src a blob: n'a ete applique : la limitation preexistante sur rotate_screen/inllogo du jeu reste en attente d'autorisation.

QA : substituer les scripts avant execution, pas seulement intercepter les requetes des iframes ; aucune annonce a cliquer ni impression artificielle. Les mocks sont exclusivement dans les scripts de test hors du depot. ads.txt reste compose de commentaires, sans vendeur invente.

References :
- https://help-publishers.adsterra.com/en/articles/5210780-adding-ads-to-a-static-html-site
- https://help-publishers.adsterra.com/en/articles/9571958-displaying-different-banners-on-mobile-and-desktop

### Blocages fournisseur verifies

Les conditions editeurs Adsterra, clauses 4.7 et 4.9, demandent un accord ecrit pour placer les tags dans une iframe et un message de consentement lorsque le site lit/depose des cookies pour collecter des informations. Le wrapper du site a ete supprime ; seul le format iframe du snippet fournisseur est conserve. La documentation publique consultee ne fournit pas pour ces unites de drapeau sans suivi, d'API CMP/regionale ou de mode sans consentement verifie. Le chargement reste automatique pour un choix allow enregistre ; un refus et l'absence de choix ne sont pas convertis en autorisation.

Avant diffusion : confirmer la compatibilite du chargement direct conditionnel avec les tags delivres et le mecanisme de consentement requis. Si ces tags exigent une execution pendant le parsing HTML, demander les snippets JS ASYNC officiels pour les deux cles (avec conteneurs et instructions multi-emplacements), sans les reconstituer a partir de sources tierces. Ne pas confondre format iframe dans atOptions avec une permission d'encapsuler le tag dans notre propre iframe. Aucun parametre de consentement n'a ete invente et aucune configuration externe n'a ete modifiee.

Sources : https://adsterra.com/publishers-terms-managed/ (4.7, 4.9) ; https://help-publishers.adsterra.com/en/articles/6144870-cookies-policy
