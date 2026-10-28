# Le Bar à Cuq — site internet

Site vitrine statique (HTML, CSS, JavaScript, sans outil de build) du Bar à Cuq,
5 avenue de Castres, 81470 Cuq-Toulza.

## Voir le site

Ouvrir `index.html` dans un navigateur.

## Structure

- `index.html` — la page (accueil, le bar, à la carte, soirées, horaires & accès)
- `assets/css/style.css` — styles (couleurs et polices dans `:root`)
- `assets/js/main.js` — menu mobile et badge « Ouvert / Fermé »
- `assets/img/` — images (favicon ; ajouter ici les photos du bar)

## À mettre à jour

- **Horaires** : dans le tableau `.hours` de `index.html` **et** dans `HORAIRES`
  au début de `assets/js/main.js` (les deux doivent correspondre), ainsi que dans
  le bloc JSON-LD en haut de `index.html`.
- **Prochaine soirée** : bloc `.event-card` dans la section « Soirées ».
- **Photo** : remplacer le bloc `.photo-placeholder` par une balise `<img>`
  (le commentaire juste au-dessus donne l'exemple).
