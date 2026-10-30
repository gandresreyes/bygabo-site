// Motion global: scroll suave (Lenis), revelado de [data-reveal], líneas [data-progress], ilustraciones [data-viz]
// y luz que sigue al cursor en [data-spotlight].
// Todo dentro de matchMedia: con movimiento reducido no se aplica nada y el contenido se ve tal cual.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -64; // alto de la cabecera fija

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const lenis = new Lenis({ autoRaf: false, anchors: { offset: HEADER_OFFSET } });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(items, { autoAlpha: 0, y: 16 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06 }),
  });

  // Líneas de progreso (proceso, experiencia): se llenan con el scroll dentro de su [data-progress-scope].
  for (const fill of gsap.utils.toArray<HTMLElement>('[data-progress]')) {
    const scope = fill.closest<HTMLElement>('[data-progress-scope]') ?? fill.parentElement!;
    const axis = fill.dataset.progress === 'x' ? 'scaleX' : 'scaleY';
    gsap.fromTo(
      fill,
      { [axis]: 0 },
      { [axis]: 1, ease: 'none', scrollTrigger: { trigger: scope, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 } },
    );
  }

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});

// Ilustraciones [data-viz]: se marcan con [data-inview] la primera vez que se ven y el CSS las anima.
// Fuera de matchMedia a propósito: con movimiento reducido las animaciones duran 0 y queda el estado final.
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
gsap.matchMedia().add('(hover: hover) and (pointer: fine)', () => {
  const cleanups = gsap.utils.toArray<HTMLElement>('[data-spotlight]').map((card) => {
    const onMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    card.addEventListener('pointermove', onMove);
    return () => card.removeEventListener('pointermove', onMove);
  });
  return () => cleanups.forEach((cleanup) => cleanup());
});
