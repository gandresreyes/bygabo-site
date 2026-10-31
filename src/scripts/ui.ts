// Interacciones ligeras que se cargan con la página (sin GSAP): ilustraciones, luz del cursor,
// analítica de clics y botón flotante de WhatsApp. Lo pesado (GSAP, Lenis, three.js) llega después.
import { track } from '@vercel/analytics';

// Ilustraciones [data-viz]: se marcan con [data-inview] la primera vez que se ven y el CSS las anima.
// Con movimiento reducido las animaciones duran 0 y queda el estado final.
const vizObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.setAttribute('data-inview', '');
      vizObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.35 },
);
document.querySelectorAll('[data-viz]').forEach((el) => vizObserver.observe(el));

// Luz que sigue al cursor en [data-spotlight]: solo actualiza --mx/--my (el CSS pinta la luz y el grano).
// Solo con ratón; no es una animación, así que también aplica con movimiento reducido.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  for (const card of document.querySelectorAll<HTMLElement>('[data-spotlight]')) {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  }
}

// Analítica: cualquier elemento con data-track="nombre" registra un evento al pulsarlo (Vercel Web Analytics).
document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('[data-track]');
  if (el?.dataset.track) track(el.dataset.track);
});

// Botón flotante de WhatsApp (solo móvil, ver WhatsAppFab.astro): visible después del hero y
// oculto en Contacto y en el pie, para no duplicar el CTA ni tapar contenido.
const fab = document.querySelector<HTMLElement>('[data-fab]');
if (fab) {
  const hero = document.querySelector('[data-hero]');
  // Zonas donde sobra: Contacto (ya tiene WhatsApp) y el pie (no debe tapar sus enlaces).
  const endZones = [document.querySelector('#contacto'), document.querySelector('footer')].filter(Boolean) as Element[];
  const visibleEnds = new Set<Element>();
  let pastHero = !hero;
  const update = () => fab.toggleAttribute('data-visible', pastHero && visibleEnds.size === 0);
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === hero) pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      else if (entry.isIntersecting) visibleEnds.add(entry.target);
      else visibleEnds.delete(entry.target);
    }
    update();
  });
  if (hero) io.observe(hero);
  endZones.forEach((zone) => io.observe(zone));
  update();
}
