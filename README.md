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

Haut des pages hors accueil : 320x50 sous 520px, 468x60 de 520 a 1023px, 728x90 a partir de 1024px, seulement si la largeur exacte tient. Une seule variante est chargee. Les emplacements propres a l'accueil sont detailles plus bas.

/play/ : colonne de 160px a cote du jeu des 900px (160x300 jusqu'a 1199px, puis 160x600), separee par 32px, sans superposition. Les recommandations de l'accueil passent sous le jeu. Pas de second rail generique sur ces deux pages. Articles/guides gardent leur rail natif ; autres pages leur rail sur tres grands ecrans.

Le 300x250 se trouve apres le jeu sur /play/ a toutes les tailles, apres la presentation de l'accueil sous 520px, et en bas du contenu sur les autres pages. Il remplace la seconde occurrence du 728x90. Pas de duplication initiale d'une meme cle pour gonfler les impressions.

Dimensions reservees, creatives jamais comprimees ni rognees. Seules les bannieres visibles a au moins 50 %, dans un onglet visible et une fenetre active, peuvent charger puis se renouveler apres un delai aleatoire de 37 a 50 secondes de temps eligible. Chaque banniere tire independamment un nouveau delai a chaque cycle, uniformement parmi les millisecondes entieres de 37000 a 50000 incluses. Aucun renouvellement avant le delai tire ; les controles periodiques, le chargement et les pauses peuvent retarder la demande effective. Le compteur se met en pause hors vue, sans focus, lorsque le menu couvre la page ou dans un onglet masque. Les longs retards de timer ne donnent aucun credit. Aucun rattrapage en rafale. Les variantes masquees ou trop larges ne font aucune demande.

Chaque banniere utilise un document local `/adsterra/<cle>.html` a ses dimensions exactes. Le renouvellement detruit cette iframe et son contexte fournisseur complet, puis cree une nouvelle iframe ; ni le jeu ni la page ne sont recharges. Une erreur ou un delai de chargement de 15 secondes replie uniquement le slot concerne sans boucle de tentatives. La Social Bar, le Smartlink et tout Popunder sont exclus du renouvellement. Aucun nouveau format ni code anti-adblock n'est ajoute.

Un historique par cle dans sessionStorage conserve l'heure de la demande et son delai aleatoire lors des changements de taille, remontages, navigations et retours BFCache. Une cle deja demandee doit de nouveau cumuler tout son delai sauvegarde apres recreation du controleur ou du slot ; aucun nouveau tirage ne raccourcit cette attente et le temps passe sur une autre page ne donne aucun credit. Le meme delai garde aussi les demandes espacees d'au moins 37 secondes reelles. L'ancien historique contenant seulement des horodatages est migre sans les effacer, avec un delai tire dans la nouvelle plage. Si cet historique est inaccessible ou invalide, les bannieres ne chargent pas, afin de ne pas perdre la garantie du delai. Les observateurs, evenements et timers du controleur sont detruits a la sortie de page.

Anti-adblock : aucun contournement, proxy, detection speculative ou blocage du jeu. La solution officielle exige des codes de remplacement fournis par Adsterra, non disponibles ici.

A la demande explicite du proprietaire, les scripts se chargent automatiquement pour un choix absent ou allow sur les formats adaptes a chaque ecran, quand les bannieres sont visibles. Un refus deny reste bloque, sans etre ecrase. Le panneau repliable en pied de page permet de desactiver, ou de reactiver apres refus. Un stockage inaccessible ou une valeur inconnue ne declenche pas de chargement automatique. Effacer les donnees efface aussi le refus. Nouveau garde local explicite : `navigator.globalPrivacyControl === true` desactive les publicites et masque leur reactivation, sans modifier le choix sauvegarde. L'ancien chargeur n'avait pas ce garde local ; le fournisseur lisait lui-meme le GPC. Le retrait detruit les frames des bannieres sans recharger le jeu. Un rechargement reste necessaire uniquement si la Social Bar avait deja ete executee dans le document principal (pages sans jeu). GoogleTags reste independant et inchange.

La Social Bar est active sur toutes les pages desktop sans iframe de jeu, y compris les index et pages legales. Elle reste exclue de l'accueil, de /play/ et des pages de jeux embarques : le fournisseur controle ses superpositions et aucune API documentee ne garantit de liberer les commandes de jeu. Les bannieres et Smartlink couvrent aussi ces pages. Pour activer la Social Bar pendant le jeu, faire valider un format non superpose par Adsterra ; aucun parametre de compte n'a ete modifie.

Les documents locaux executent dans leur body, pendant le parsing HTML, les tags `atOptions` et `invoke.js` avec les cles, URL, dimensions, format iframe et params inchanges. Aucun atAsyncOptions ou drapeau fournisseur non documente n'est invente. Chaque contexte possede ses propres options : une banniere bloquee ne bloque pas les autres. Le document local refuse le chargement autonome, sans parent autorise, apres refus/GPC ou perte de visibilite/focus pendant son chargement. Ce sont des contextes de cycle de vie de meme origine, pas une frontiere de securite contre du code tiers malveillant. Les documents ne figurent pas au sitemap et declarent noindex.

CSP : seuls les hotes fournis sont autorises. Les domaines secondaires des creations et du fournisseur peuvent necessiter une liste officielle complementaire. Ne pas declarer la diffusion validee sans ce controle. Dokploy/Nginx applique sa propre configuration. Aucun elargissement img-src a blob: n'a ete applique : la limitation preexistante sur rotate_screen/inllogo du jeu reste en attente d'autorisation.

QA : substituer les scripts avant execution, pas seulement intercepter les requetes des iframes ; aucune annonce a cliquer ni impression artificielle. Les mocks sont exclusivement dans les scripts de test hors du depot. ads.txt reste compose de commentaires, sans vendeur invente.

References :
- https://help-publishers.adsterra.com/en/articles/5210780-adding-ads-to-a-static-html-site
- https://help-publishers.adsterra.com/en/articles/9571958-displaying-different-banners-on-mobile-and-desktop

### Contraintes fournisseur et limites de verification

Le 1 octobre 2026 a 19:44:20 UTC, apres clarification explicite des valeurs inferieures a 40 secondes, le proprietaire a confirme l'accord rapporte d'Ema (support Adsterra) pour la plage 37-50 secondes. Cette confirmation remplace pour cette implementation la precedente consigne de minimum 40 secondes. Le proprietaire rapporte aussi que le renouvellement fonctionne en ligne ; nos controles restent simules. Les conditions editeurs publiques, clause 4.7 verifiee le 1 octobre 2026, exigent aussi un accord ecrit pour placer les tags dans une iframe. L'accord rapporte sur le renouvellement ne prouve pas a lui seul une validation explicite de ce wrapper. Cette contrainte reste a confirmer avant diffusion ; aucun deploiement ni changement de compte n'est effectue ici. La clause 4.9 traite du message de consentement. L'absence de choix conserve le comportement demande par le proprietaire et n'est ni presentee ni enregistree comme un consentement. Aucun parametre de consentement fournisseur n'est invente.

Inspection statique du invoke.js 160x600 livre le 1 octobre 2026 (sans execution) : il cree une iframe about:blank, utilise le document/window courant pour des listeners, consulte le contexte parent/top pour le referent et utilise le stockage dans un contexte imbrique. Cela motive un document local de meme origine avec une URL normale, et la destruction du contexte complet plutot que le rechargement de son iframe vide. Le script et les creations secondaires peuvent changer ; cette inspection et les tests simules ne prouvent ni remplissage reel, ni comptabilisation, ni validation fournisseur. Tous les tests de cycle de vie remplacent les scripts avant execution, sans clic ni impression publicitaire reelle.

Sources : https://adsterra.com/publishers-terms-managed/ (4.7, 4.9) ; https://help-publishers.adsterra.com/en/articles/6144870-cookies-policy


### Emplacements de l'accueil - ajustement du 1 octobre 2026

- Desktop a partir de 1024 px : un 160x600 a gauche du jeu et un 160x300 a droite, alignes en haut ; un 728x90 entre les recommandations et la presentation, puis un 468x60 entre la presentation et les instructions.
- De 900 a 1023 px : 160x600 a gauche et 160x300 a droite, 320x50 sous le jeu, 468x60 apres la presentation.
- De 520 a 899 px : 320x50 sous le jeu et 468x60 apres la presentation, sans rail.
- Sous 520 px : 320x50 sous le jeu et 300x250 apres la presentation, sans rail. Les creations gardent leurs dimensions natives.
- A la demande du proprietaire, le rail droit utilise desormais le code 160x300 existant `ca6f70a4d1332386663f3d261023c083`, avec son URL inchangee `https://www.highrevenueformat.com/ca6f70a4d1332386663f3d261023c083/invoke.js`. Il apparait une seule fois sur l'accueil, a sa taille native, sans etirement ni faux espace publicitaire pour imiter la hauteur du 160x600 gauche. La grille et les dimensions du jeu restent inchangees ; les deux rails sont masques sous 900 px. Le choix d'un second 160x600 est abandonne : aucun nouveau code n'est necessaire pour ce 160x300. Le build refuse toute duplication de cle entre les formats de l'accueil.
- Le 160x300 droit beneficie du meme renouvellement independant et aleatoire de 37 a 50 secondes eligibles que les autres bannieres, avec les memes pauses, refus/GPC, arret global et nettoyage des contextes.
- Chaque code fourni apparait une seule fois dans le DOM de l'accueil. Les variantes sont masquees tant que leur taille ne convient pas. Les refus publicitaires enregistres restent prioritaires. La Social Bar reste exclue des pages de jeu.

Adsterra demande deux codes differents pour deux bannieres de meme taille : https://adsterra.com/blog/how-banner-ads-make-money/ (section "The same banner ad code used twice"). Aucune affirmation de revenus ou d'impressions supplementaires n'est faite.
