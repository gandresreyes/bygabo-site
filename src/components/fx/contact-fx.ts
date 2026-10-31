// "¿Empezamos?" en partículas: se condensan mientras la sección entra; al subir, se dispersan.
import { gsap } from 'gsap';
import { mountParticleTitle } from './mount-particle-title';

export function initContactFx(section: HTMLElement, canvas: HTMLCanvasElement, title: HTMLElement) {
  mountParticleTitle({
    stage: section,
    canvas,
    title,
    onReady(fx) {
      gsap.to(
        {},
        {
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: ({ progress }) => fx.setIntro(progress),
          },
        },
      );
    },
  });
}
