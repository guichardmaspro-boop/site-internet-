# Le Bar à Cuq — site internet

Site vitrine statique (HTML, CSS, JavaScript, sans outil de build) du Bar à Cuq,
5 avenue de Castres, 81470 Cuq-Toulza.

## Voir le site

Ouvrir `index.html` dans un navigateur.

## Structure

- `index.html` — la page (accueil, le bar, à la carte, soirées, horaires & accès)
- `assets/css/style.css` — styles (couleurs et polices dans `:root`)
- `assets/js/main.js` — menu mobile, badge « Ouvert / Fermé » et verre de bière
- `assets/img/` — images (favicon ; ajouter ici les photos du bar)

## À mettre à jour

- **Horaires** : dans le tableau `.hours` de `index.html` **et** dans `HORAIRES`
  au début de `assets/js/main.js` (les deux doivent correspondre), ainsi que dans
  le bloc JSON-LD en haut de `index.html`.
- **Prochaine soirée** : bloc `.event-card` dans la section « Soirées ».
- **Photo** : remplacer le bloc `.photo-placeholder` par une balise `<img>`
  (le commentaire juste au-dessus donne l'exemple).

## Le thème et le verre de bière

Les couleurs et les polices reprennent le logo : dégradé orange (`--orange`,
`--orange-light`), crème (`--cream`), « Le Bar » en écriture (Lobster, avec un
grain via le filtre SVG `#grain`) et « À CUQ » en capitales épaisses (Anton).

Le verre (`<aside class="pint">` dans `index.html`) est le fil conducteur :

- il est posé en grand dans l'accueil, puis se range sur le côté de l'écran
  (en pastille en bas à droite sur mobile) ;
- il se remplit de bière au fil du défilement, la mousse monte en fin de page
  et déborde du verre tout en bas (« Santé ! ») ;
- sur grand écran, ses graduations mènent aux sections ; un clic sur le verre
  passe à la section suivante.

Pour ajouter une section au verre : lui mettre l'attribut `data-pint-section`
et ajouter un lien dans la liste `data-pint-ticks`.
