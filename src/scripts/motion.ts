// Motion global: scroll suave (Lenis) y revelado sutil de [data-reveal].
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

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});
