// Le Bar à Cuq — menu mobile, horaires, et le verre de bière qui se remplit au défilement

// Horaires par jour (0 = dimanche). Garder en phase avec le tableau de index.html.
const HORAIRES = {
  0: null,
  1: [6, 21],
  2: [6, 21],
  3: [6, 21],
  4: [6, 21],
  5: [6, 21],
  6: [6, 21],
};

const reduitAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const lisse = (t) => t * t * (3 - 2 * t);

// ------------------------------------------------------------------
// Menu mobile
// ------------------------------------------------------------------
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("menu");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".sr-only").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
  nav.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});

// ------------------------------------------------------------------
// Horaires : jour courant et badge « ouvert / fermé » (heure de Paris)
// ------------------------------------------------------------------
function heureParis() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const jours = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { jour: jours.indexOf(get("weekday")), heure: Number(get("hour")) + Number(get("minute")) / 60 };
}

function majStatut() {
  const { jour, heure } = heureParis();

  document.querySelectorAll(".hours tr").forEach((tr) => {
    tr.classList.toggle("is-today", Number(tr.dataset.day) === jour);
  });

  const statut = document.querySelector("[data-open-status]");
  const plage = HORAIRES[jour];
  const ouvert = Boolean(plage) && heure >= plage[0] && heure < plage[1];
  statut.textContent = ouvert ? `Ouvert maintenant · jusqu'à ${plage[1]}h` : "Fermé en ce moment";
  statut.classList.toggle("is-open", ouvert);
  statut.hidden = false;
}

majStatut();
setInterval(majStatut, 60 * 1000);

document.querySelector("[data-year]").textContent = new Date().getFullYear();

// ------------------------------------------------------------------
// Le verre de bière
// ------------------------------------------------------------------
// Coordonnées du dessin SVG (viewBox 0 0 100 200) : fond intérieur à y=188, bord à y=12.
const FOND = 188;
const BORD = 12;

const pint = document.querySelector("[data-pint]");
const biere = pint.querySelector("[data-pint-beer]");
const mousse = pint.querySelector("[data-pint-foam]");
const mousseRect = mousse.querySelector("rect");
const etiquette = pint.querySelector("[data-pint-label]");
const graduations = [...pint.querySelectorAll("[data-pint-ticks] a")];
const emplacement = document.querySelector("[data-pint-slot]");
const hero = document.querySelector(".hero");
const header = document.querySelector(".site-header");
const sections = [...document.querySelectorAll("[data-pint-section]")];

// Niveau du verre (0 = vide, 1 = plein) pour une progression de défilement donnée
const niveauPour = (p) => 0.05 + 0.95 * p;
// Haut de la boisson (mousse comprise) dans le SVG
const surfacePour = (niveau) => Math.max(BORD, FOND - niveau * (FOND - BORD));

function scrollMax() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function remplir(p) {
  const surface = surfacePour(niveauPour(p));
  // Mousse : un fin liseré au début, une belle tête quand le verre est presque plein
  const hauteurMousse = 4 + 18 * lisse(clamp((p - 0.6) / 0.4));
  mousse.style.transform = `translateY(${surface}px)`;
  mousseRect.setAttribute("height", hauteurMousse + 3);
  biere.style.transform = `translateY(${surface + hauteurMousse}px)`;
  pint.classList.toggle("is-full", p > 0.985);
}

function placerGraduations() {
  const max = scrollMax();
  const decalage = header.offsetHeight;
  graduations.forEach((a) => {
    const section = document.getElementById(a.dataset.section);
    const p = clamp((section.offsetTop - decalage) / max);
    a.parentElement.style.top = `${(surfacePour(niveauPour(p)) / 200) * 100}%`;
  });
}

// Position « rangée » du verre : sur le côté (grand écran) ou en pastille (mobile)
function positionRangee() {
  const large = window.innerWidth >= 1240;
  const largeur = pint.offsetWidth;
  const hauteur = pint.offsetHeight;
  if (large) {
    const haut = header.offsetHeight;
    return { x: window.innerWidth - 40 - largeur, y: haut + (window.innerHeight - haut - hauteur) / 2, largeur };
  }
  return { x: window.innerWidth - 30 - largeur, y: window.innerHeight - 26 - hauteur, largeur };
}

function placerVerre() {
  const rangee = positionRangee();
  const slot = emplacement.getBoundingClientRect();
  let t = 1;
  if (slot.width > 0) {
    t = lisse(clamp(window.scrollY / (hero.offsetHeight * 0.7)));
  }
  const depart = slot.width > 0 ? { x: slot.left, y: slot.top, s: slot.width / rangee.largeur } : { x: rangee.x, y: rangee.y, s: 1 };
  const x = lerp(depart.x, rangee.x, t);
  const y = lerp(depart.y, rangee.y, t);
  const s = lerp(depart.s, 1, t);
  pint.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  pint.classList.toggle("is-docked", t > 0.999);
}

function sectionActive() {
  const seuil = window.innerHeight * 0.45;
  let active = null;
  sections.forEach((s) => {
    if (s.getBoundingClientRect().top <= seuil) active = s;
  });
  return active;
}

function majEtiquette(p) {
  const active = sectionActive();
  graduations.forEach((a) => {
    if (active && a.dataset.section === active.id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  if (p > 0.985) etiquette.textContent = "Santé !";
  else if (active) etiquette.textContent = graduations.find((a) => a.dataset.section === active.id)?.textContent ?? "";
  else etiquette.textContent = "On vous sert ?";
}

let enAttente = false;
function majVerre() {
  enAttente = false;
  const p = clamp(window.scrollY / scrollMax());
  remplir(p);
  placerVerre();
  majEtiquette(p);
}
function demanderMaj() {
  if (!enAttente) {
    enAttente = true;
    requestAnimationFrame(majVerre);
  }
}

// Clic sur le verre : section suivante, ou retour en haut quand il est plein
pint.querySelector("[data-pint-next]").addEventListener("click", () => {
  const limite = header.offsetHeight + 10;
  const suivante = sections.find((s) => s.getBoundingClientRect().top > limite);
  const comportement = reduitAnimations ? "auto" : "smooth";
  if (suivante) suivante.scrollIntoView({ behavior: comportement });
  else window.scrollTo({ top: 0, behavior: comportement });
});

window.addEventListener("scroll", demanderMaj, { passive: true });
window.addEventListener("resize", () => {
  placerGraduations();
  demanderMaj();
});
window.addEventListener("load", () => {
  placerGraduations();
  demanderMaj();
});

// Premier service : le verre part vide puis se remplit jusqu'au niveau courant
remplir(-0.06);
placerVerre();
placerGraduations();
pint.classList.add("is-ready");
if (reduitAnimations) {
  majVerre();
} else {
  pint.classList.add("is-pouring");
  requestAnimationFrame(() => requestAnimationFrame(majVerre));
  setTimeout(() => pint.classList.remove("is-pouring"), 1500);
}
