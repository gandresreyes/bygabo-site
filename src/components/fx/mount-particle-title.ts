// Monta un título en partículas sobre un escenario, con todo el ciclo de vida común:
// movimiento reducido, soporte WebGL, carga diferida de three.js, colores del tema,
// parallax con el puntero y limpieza. Cada sección solo define su coreografía en `onReady`.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ParticleName, ParticleOptions } from './particle-name';

gsap.registerPlugin(ScrollTrigger);

interface MountOptions {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  /** Elemento de texto real (h1/h2): se mide, se dibuja en partículas y queda con opacity 0. */
  title: HTMLElement;
  /** true = espera a que el escenario esté cerca del viewport (secciones bajo el pliegue). */
  lazy?: boolean;
  particles?: ParticleOptions;
  /** Se ejecuta dentro de un gsap.Context: lo que cree aquí se revierte solo. */
  onReady: (fx: ParticleName) => void;
  onCleanup?: () => void;
}

const hasWebGL = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
};

const themeColors = () => {
  const css = getComputedStyle(document.documentElement);
  return { fg: css.getPropertyValue('--fg'), accent: css.getPropertyValue('--accent') };
};

export function mountParticleTitle({ stage, canvas, title, lazy, particles, onReady, onCleanup }: MountOptions) {
  if (!hasWebGL()) return;

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', (context) => {
    let fx: ParticleName | undefined;
    let cancelled = false;
    let io: IntersectionObserver | undefined;

    const onPointer = (e: PointerEvent) =>
      fx?.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    const themeObserver = new MutationObserver(() => {
      const { fg, accent } = themeColors();
      fx?.setColors(fg, accent);
    });

    const init = async () => {
      await document.fonts.ready;
      const { createParticleName } = await import('./particle-name');
      if (cancelled) return;
      try {
        fx = createParticleName(canvas, stage, title, themeColors(), particles);
      } catch {
        return; // sin WebGL utilizable: el texto real se queda como está
      }
      const ready = fx;
      addEventListener('pointermove', onPointer, { passive: true });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      context.add(() => {
        // Solo opacity (no visibility): el texto sigue en el árbol de accesibilidad.
        gsap.set(title, { opacity: 0 });
        onReady(ready);
      });
      ScrollTrigger.refresh();
    };

    if (lazy) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          void init();
        },
        { rootMargin: '300px' },
      );
      io.observe(stage);
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(() => void init(), { timeout: 800 });
    } else {
      setTimeout(() => void init(), 1);
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      removeEventListener('pointermove', onPointer);
      themeObserver.disconnect();
      fx?.destroy();
      onCleanup?.();
    };
  });
}
