/* We Jardin — interactions
   - Header solid au scroll
   - Menu burger mobile
   - Animations au scroll (Intersection Observer)
   - Filtres de la galerie réalisations
   - Formulaires (affichage message de confirmation)
*/
(function () {
  'use strict';

  // ---------- Header scroll state ----------
  var header = document.querySelector('.site-header');
  var isSolidPage = header && header.classList.contains('is-solid');
  function onScroll() {
    if (!header || isSolidPage) return;
    if (window.scrollY > 60) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile nav ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Gallery filters ----------
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        galleryItems.forEach(function (item) {
          var cat = item.getAttribute('data-category') || '';
          if (filter === 'all' || cat === filter) item.classList.remove('is-hidden');
          else item.classList.add('is-hidden');
        });
      });
    });
  }

  // ---------- Forms ----------
  function handleForm(formId, successId) {
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    if (!form || !success) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      success.classList.add('is-visible');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { success.classList.remove('is-visible'); }, 8000);
    });
  }
  handleForm('devis-form', 'devis-success');
  handleForm('contact-form', 'contact-success');

  // ---------- Current year in footer ----------
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
