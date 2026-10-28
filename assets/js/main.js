// Le Bar à Cuq — menu mobile, jour courant et statut « ouvert / fermé »

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

// Menu mobile
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

// Heure de Cuq-Toulza, quel que soit le fuseau du visiteur
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
