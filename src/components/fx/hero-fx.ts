// Hero: el nombre llega en partículas desde la profundidad y el scroll lo atraviesa.
// Se carga después de la primera pintura (ver Hero.astro): el texto real ya está en pantalla.
import { gsap } from 'gsap';
import { mountParticleTitle } from './mount-particle-title';

export function initHeroFx(hero: HTMLElement, stage: HTMLElement, canvas: HTMLCanvasElement, title: HTMLElement) {
  mountParticleTitle({
    stage,
    canvas,
    title,
    onReady(fx) {
      hero.dataset.fx = 'on';

      // Intro: las partículas forman el nombre.
      const intro = { value: 0 };
      gsap.to(intro, { value: 1, duration: 2.4, ease: 'power2.out', onUpdate: () => fx.setIntro(intro.value) });

      // Inmersión: el scroll atraviesa el nombre mientras el escenario está fijo.
      gsap.to(
        {},
        {
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: ({ progress }) => fx.setDive(progress),
          },
        },
      );
      gsap.to('[data-hero-fade], [data-hero-hint]', {
        autoAlpha: 0,
        y: -32,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '45% top', scrub: true },
      });
    },
    onCleanup: () => delete hero.dataset.fx,
  });
}
