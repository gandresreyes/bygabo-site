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
          // Medido sobre el título, no sobre la sección: en móvil la sección es muy alta (formulario y
          // tarjetas apilados) y con 'bottom bottom' el nombre se formaba cuando ya había salido de pantalla.
          scrollTrigger: {
            trigger: title,
            start: 'top bottom',
            end: 'center 55%',
            scrub: 0.6,
            onUpdate: ({ progress }) => fx.setIntro(progress),
          },
        },
      );
    },
  });
}
