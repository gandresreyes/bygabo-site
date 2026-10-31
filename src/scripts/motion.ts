// Motion global con GSAP: scroll suave (Lenis), revelado de [data-reveal] y líneas [data-progress].
// Se carga de forma diferida (Layout → whenIdle): nunca compite con la primera pintura.
// Todo dentro de matchMedia: con movimiento reducido no se aplica nada y el contenido se ve tal cual.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -64; // alto de la cabecera fija

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  // Solo se ocultan los que aún no se han visto: lo que ya está en pantalla no parpadea.
  const pending = items.filter((el) => el.getBoundingClientRect().top > innerHeight);
  gsap.set(pending, { autoAlpha: 0, y: 16 });
  ScrollTrigger.batch(pending, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06 }),
  });

  // Líneas de progreso (proceso, trayectoria): se llenan con el scroll dentro de su [data-progress-scope].
  for (const fill of gsap.utils.toArray<HTMLElement>('[data-progress]')) {
    const scope = fill.closest<HTMLElement>('[data-progress-scope]') ?? fill.parentElement!;
    const axis = fill.dataset.progress === 'x' ? 'scaleX' : 'scaleY';
    gsap.fromTo(
      fill,
      { [axis]: 0 },
      { [axis]: 1, ease: 'none', scrollTrigger: { trigger: scope, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 } },
    );
  }
});

// Scroll suave solo con ratón/trackpad: en táctil el scroll nativo ya es suave y Lenis solo añadiría
// trabajo en cada fotograma. Se mantiene el lagSmoothing por defecto de GSAP (evita saltos tras pausas).
mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
  const lenis = new Lenis({ autoRaf: false, anchors: { offset: HEADER_OFFSET } });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});
