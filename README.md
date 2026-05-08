# Site_opposition_freyssenet

Site web de l'opposition au conseil municipal de **Freyssenet** (Ardèche, 46 habitants).

> *Freyssenet, l'avenir à construire ensemble.*

## Contenu

- **`index.html`** — site complet (CSS, JS et JSX inlinés). Référence les images depuis `project/logo.png` et `project/village.jpg`.
- **`index-standalone.html`** — version 100 % autonome, avec les images encodées en base64 dans le fichier. Ouvre-toi tout seul dans un navigateur, sans serveur ni dépendance locale.
- **`project/`** — fichiers source de la maquette (CSS, JSX, images, prototype Claude Design).
- **`chats/`** — transcript de la conversation de design.

## Sections du site

1. **Accueil** — hero, actualités/tribunes
2. **Conseil municipal** — documents officiels (commune + CAPCA)
3. **Bilan de la majorité** — indicateurs promesses/réalisé sur les mandats 2020-2026 et 2026-2032
4. **Mon action** — tribunes, propositions, registre de votes
5. **Vous avez la parole** — témoignages, boîte à idées, formulaire de contact
6. **Notre commune** — patrimoine, vie associative, sondages
7. **Météo** — Open-Meteo, Freyssenet (44,65° N — 4,55° E)
8. **Qui sommes-nous** — fiche élu, charte en quatre engagements

## Pour visualiser

Ouvre `index-standalone.html` directement dans ton navigateur (double-clic). Aucun serveur nécessaire.

Pour servir avec un mini-serveur HTTP local :
```bash
python3 -m http.server 8000
# puis ouvre http://localhost:8000/index.html
```

## Personnalisation à chaud

Un panneau de tweaks (en bas à droite, déclenchable depuis l'interface Claude Design) permet d'ajuster :
- la palette de couleurs (6 combinaisons)
- la typographie (titres / corps)
- le format des indicateurs (jauges / notes / feux)
- le style des cartes (bordées / ombrées / remplies)
- le ton éditorial (engagé / institutionnel)

## À fournir / à compléter

- Nom et portrait de l'élu d'opposition (placeholder dans la section *Qui sommes-nous*)
- Photos du patrimoine (chapelle, four banal, lavoir, croix de mission)
- Photo panoramique de la commune (section *Notre commune*)
- Contenu réel des tribunes et documents officiels

---

*Site édité par l'élu d'opposition au conseil municipal de Freyssenet. Indépendant de la mairie.*
