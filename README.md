## Adsterra reactive pour test - 1 octobre 2026

`src/data/advertising.ts` contient `ADSTERRA_ENABLED = true`, a la demande explicite du proprietaire. Les placements sont actifs sur ordinateur, tablette et mobile, avec les refus explicites conserves. Les quatre nouveaux formats fournis par le proprietaire sont integres ; aucun changement de compte. Les textes de confidentialite et de cookies suivent automatiquement ce drapeau.

Le support Adsterra a indique avoir filtre des annonceurs precis et recommande de vider cache/cookies puis de retester apres 15 minutes. Cela ne confirme pas un filtrage exhaustif des categories ni l'adequation des creations a tous les publics. Les controles locaux utilisent des scripts simules et ne valident pas le contenu publicitaire reel.

Arret rapide : remettre le drapeau a false, reconstruire et deployer. Cette restauration locale n'est pas publiee : utiliser le processus habituel pour publier le nouveau build, puis recharger les pages ouvertes et invalider les caches si necessaire. Ne pas cliquer les annonces pour les tester.

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

Haut de chaque page : 320x50 sous 520px, 468x60 de 520 a 1023px, 728x90 a partir de 1024px, seulement si la largeur exacte tient. Une seule variante est chargee.

Accueil et /play/ : colonne de 160px a cote du jeu des 900px (160x300 jusqu'a 1199px, puis 160x600), separee par 32px, sans superposition. Les recommandations de l'accueil passent sous le jeu. Pas de second rail generique sur ces deux pages. Articles/guides gardent leur rail natif ; autres pages leur rail sur tres grands ecrans.

Le 300x250 se trouve apres le jeu sur accueil et /play/ a toutes les tailles, et en bas du contenu sur les autres pages. Il remplace la seconde occurrence du 728x90. Pas de duplication initiale d'une meme cle pour gonfler les impressions.

Dimensions reservees, creatives jamais comprimees ni rognees, pas de rafraichissement automatique. Aucune demande pour les variantes masquees ou trop larges. Un resize peut charger une autre variante une seule fois par document. Une erreur reseau replie le slot sans nouvelle tentative ; un script sans evenement final peut bloquer la file suivante, sans bloquer le jeu. Les mocks restent hors depot.

Anti-adblock : aucun contournement, proxy, detection speculative ou blocage du jeu. La solution officielle exige des codes de remplacement fournis par Adsterra, non disponibles ici.

A la demande explicite du proprietaire, les scripts se chargent automatiquement pour un choix absent ou allow sur les formats adaptes a chaque ecran. Aucun clic initial, scroll ou bouton Autoriser. Un refus deny reste bloque, sans etre ecrase. Le panneau repliable en pied de page permet de desactiver, ou de reactiver apres refus. Un stockage inaccessible ou une valeur inconnue ne declenche pas de chargement automatique. Effacer les donnees efface aussi le refus. Le retrait recharge le document si un script publicitaire a demarre. GoogleTags reste independant et inchange.

La Social Bar est active sur toutes les pages desktop sans iframe de jeu, y compris les index et pages legales. Elle reste exclue de l'accueil, de /play/ et des pages de jeux embarques : le fournisseur controle ses superpositions et aucune API documentee ne garantit de liberer les commandes de jeu. Les bannieres et Smartlink couvrent aussi ces pages. Pour activer la Social Bar pendant le jeu, faire valider un format non superpose par Adsterra ; aucun parametre de compte n'a ete modifie.

Les tags des bannieres sont inseres directement dans le body a leur emplacement, sans iframe creee par le site. Le format iframe fourni reste inchange : le fournisseur cree lui-meme sa creation. Une file attend load/error de chaque invoke.js avant de definir atOptions pour le suivant, sans changer les cles, dimensions ou params. Aucun atAsyncOptions ou drapeau fournisseur non documente n'est invente. Le retrait recharge le document des qu'un tag a commence, pour supprimer aussi ses effets globaux. Un tag bloque sans evenement load/error bloque les suivants plutot que de risquer une collision. Le guide officiel recommande l'insertion dans le body ; le chargement conditionnel en serie est notre implementation, pas une API async certifiee par Adsterra. Le remplissage reel et la compatibilite du tag delivre restent a verifier cote fournisseur.

CSP : seuls les hotes fournis sont autorises. Les domaines secondaires des creations et du fournisseur peuvent necessiter une liste officielle complementaire. Ne pas declarer la diffusion validee sans ce controle. Dokploy/Nginx applique sa propre configuration. Aucun elargissement img-src a blob: n'a ete applique : la limitation preexistante sur rotate_screen/inllogo du jeu reste en attente d'autorisation.

QA : substituer les scripts avant execution, pas seulement intercepter les requetes des iframes ; aucune annonce a cliquer ni impression artificielle. Les mocks sont exclusivement dans les scripts de test hors du depot. ads.txt reste compose de commentaires, sans vendeur invente.

References :
- https://help-publishers.adsterra.com/en/articles/5210780-adding-ads-to-a-static-html-site
- https://help-publishers.adsterra.com/en/articles/9571958-displaying-different-banners-on-mobile-and-desktop

### Blocages fournisseur verifies

Les conditions editeurs Adsterra, clauses 4.7 et 4.9, demandent un accord ecrit pour placer les tags dans une iframe et un message de consentement lorsque le site lit/depose des cookies pour collecter des informations. Le wrapper du site a ete supprime ; seul le format iframe du snippet fournisseur est conserve. La documentation publique consultee ne fournit pas pour ces unites de drapeau sans suivi, d'API CMP/regionale ou de mode sans consentement verifie. Le proprietaire a explicitement demande le chargement par defaut apres explication des contacts tiers et du suivi potentiel. L'absence de choix autorise techniquement le chargement mais n'est pas presentee ni enregistree comme un consentement. Les refus restent conserves. Cette demande et la reponse du support ne constituent pas une validation juridique de ce comportement dans chaque territoire, ni une garantie pour un public mineur. Aucune CMP independante n'a ete identifiee dans le code local ; les regles eventuelles injectees par GTM restent hors de cette verification.

Avant diffusion : confirmer la compatibilite du chargement direct conditionnel avec les tags delivres et le mecanisme de consentement requis. Si ces tags exigent une execution pendant le parsing HTML, demander les snippets JS ASYNC officiels pour les deux cles (avec conteneurs et instructions multi-emplacements), sans les reconstituer a partir de sources tierces. Ne pas confondre format iframe dans atOptions avec une permission d'encapsuler le tag dans notre propre iframe. Aucun parametre de consentement n'a ete invente et aucune configuration externe n'a ete modifiee.

Sources : https://adsterra.com/publishers-terms-managed/ (4.7, 4.9) ; https://help-publishers.adsterra.com/en/articles/6144870-cookies-policy


### Emplacements de l'accueil - ajustement du 1 octobre 2026

- Desktop a partir de 1024 px : un 160x600 a gauche du jeu, un 728x90 entre les recommandations et la presentation, puis un 468x60 entre la presentation et les instructions.
- De 900 a 1023 px : 160x600 a gauche, 320x50 sous le jeu, 468x60 apres la presentation.
- De 520 a 899 px : 320x50 sous le jeu et 468x60 apres la presentation, sans rail.
- Sous 520 px : 320x50 sous le jeu et 300x250 apres la presentation, sans rail. Les creations gardent leurs dimensions natives.
- Le rail droit est prepare pour un second 160x600. Il ne produit actuellement ni element, ni requete, ni faux emplacement : `HOME_RIGHT_SKYSCRAPER` reste `null` dans `src/data/advertising.ts`. Il manque un deuxieme code Adsterra 160x600 distinct (cle atOptions et URL invoke.js exacte). Ne pas reutiliser la cle du rail gauche. Une verification de build interdit cette duplication.
- Chaque code fourni apparait une seule fois dans le DOM de l'accueil. Les variantes sont masquees tant que leur taille ne convient pas. Les refus publicitaires enregistres restent prioritaires. La Social Bar reste exclue des pages de jeu.

Adsterra demande deux codes differents pour deux bannieres de meme taille : https://adsterra.com/blog/how-banner-ads-make-money/ (section "The same banner ad code used twice"). Aucune affirmation de revenus ou d'impressions supplementaires n'est faite.