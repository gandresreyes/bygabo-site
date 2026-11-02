// Hero: el nombre llega en partículas desde la profundidad y el scroll lo atraviesa.
// Se carga después de la primera pintura (ver Hero.astro): el texto real ya está en pantalla.
import { gsap } from 'gsap';
import { mountParticleTitle } from './mount-particle-title';

export function initHeroFx(hero: HTMLElement, stage: HTMLElement, canvas: HTMLCanvasElement, title: HTMLElement) {
  // En móvil el efecto llega más tarde y un deslizamiento recorre mucho: intro más corta y un tramo
  // de scroll en el que el nombre aguanta formado antes de la inmersión (el hero es más largo, ver Hero.astro).
  const isSmall = matchMedia('(max-width: 768px)').matches;
  const introDuration = isSmall ? 1.6 : 2.4;
  const hold = isSmall ? 0.25 : 0;

  mountParticleTitle({
    stage,
    canvas,
    title,
    onReady(fx) {
      hero.dataset.fx = 'on';

      // La inmersión espera al nombre: se escala por el avance de la intro.
      const intro = { value: 0 };
      let dive = 0;
      const applyDive = () => fx.setDive(dive * intro.value);

      // Intro: las partículas forman el nombre.
      const introTween = gsap.to(intro, {
        value: 1,
        duration: introDuration,
        ease: 'power2.out',
        onUpdate: () => {
          fx.setIntro(intro.value);
          applyDive();
        },
      });
      // El texto real se desvanece mientras llegan las partículas: el nombre nunca deja de leerse.
      gsap.fromTo(
        title,
        { opacity: 1 },
        { opacity: 0, delay: introDuration * 0.15, duration: introDuration * 0.4, ease: 'power1.in' },
      );

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
            onUpdate: ({ progress }) => {
              // Si se baja antes de que el nombre esté formado, la intro termina deprisa.
              if (progress > 0 && introTween.isActive()) introTween.timeScale(3);
              dive = Math.max(0, (progress - hold) / (1 - hold));
              applyDive();
            },
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
