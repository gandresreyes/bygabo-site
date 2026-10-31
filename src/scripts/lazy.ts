// Carga diferida de efectos: nada pesado compite con la primera pintura ni con el texto.
// Este módulo es diminuto a propósito: es lo único que se ejecuta al cargar la página.

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/**
 * ¿Merece la pena el efecto WebGL? No en equipos modestos (≤ 4 GB o ≤ 4 núcleos), con ahorro de datos
 * activado ni con movimiento reducido: ahí se queda el texto real, que es el contenido.
 */
export function canRunHeavyFx(): boolean {
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return false;
  return !matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Ejecuta la tarea tras el evento load y cuando el navegador esté libre (con un tope de espera). */
export function whenIdle(task: () => void, timeout = 2500) {
  const schedule = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => task(), { timeout });
    else setTimeout(task, 200);
  };
  if (document.readyState === 'complete') schedule();
  else addEventListener('load', schedule, { once: true });
}

/** Ejecuta la tarea cuando el elemento se acerca al viewport (y el navegador está libre). */
export function whenNear(el: Element, task: () => void, rootMargin = '400px') {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      whenIdle(task, 1000);
    },
    { rootMargin },
  );
  io.observe(el);
}
