---
name: motion-3d
description: Reglas y recetas de animación, scroll y 3D para el sitio de Gabo — GSAP + ScrollTrigger + SplitText, Lenis (scroll suave), three.js / WebGL, shaders, texto de partículas que forma palabras con el scroll, View Transitions de Astro, prefers-reduced-motion y rendimiento. Úsala SIEMPRE que vayas a animar algo, añadir efectos al hacer scroll, hover elaborados, transiciones entre páginas, canvas, partículas, escenas 3D, o instalar/usar gsap, lenis, three o cualquier librería de motion, aunque el pedido solo diga "dale vida", "que se vea más moderno" o "agrega un efecto".
---

# Motion y 3D

El movimiento es la firma del sitio, pero solo funciona si es **escaso y con intención**: Apple anima una cosa espectacular por sección y el resto apenas respira. Cada animación debe responder a una pregunta: ¿qué le comunica al usuario (jerarquía, continuidad, estado)? Si la respuesta es "se ve cool", basta con una por página.

## Referencias visuales de Gabo

- **[mesh3d.gallery](https://mesh3d.gallery/the-state-of-the-gallery)**: le gusta la sensación de "sumergirse" con el scroll (scroll to dive in) y la atmósfera oscura azul-tinta. Pero allí se siente **pesado**: Next.js + Three.js con ~17 bundles de JS. Queremos algo **parecido pero más sutil**: la misma profundidad y atmósfera con una escena mínima (pocos objetos o un campo de partículas, cámara que avanza con el scroll), cargada de forma diferida y que se apaga con movimiento reducido. Ante la duda, menos intensidad, menos objetos y menos post-procesado.

## Implementado

- **Hero** (`components/sections/Hero.astro` + `components/fx/particle-name.ts`): el `<h1>` real se pinta primero (LCP); luego three.js (import dinámico) dibuja el nombre en partículas que llegan desde la profundidad (`uIntro`, 2.4 s) y, con el scroll, la cámara "atraviesa" el nombre (`uDive`, ScrollTrigger con scrub sobre el escenario sticky). Un 12% de partículas usa el acento. Parallax sutil con el puntero. `data-fx="on"` alarga la sección solo cuando el efecto está activo.
- **Global** (`scripts/motion.ts`, importado en `Layout`): Lenis + revelado con `ScrollTrigger.batch` de todo elemento con `data-reveal` (cabeceras de sección, tarjetas, experiencia, stack). Para animar algo nuevo al entrar en pantalla, basta con añadir `data-reveal`.
- **Títulos en partículas reutilizables** (`components/fx/mount-particle-title.ts`): encapsula movimiento reducido, WebGL, carga diferida (`lazy: true` para secciones bajo el pliegue), colores del tema, puntero y limpieza. Lo usan el hero (intro + inmersión) y el contacto ("¿Hablamos?" se condensa con el scroll al llegar). Para otro título: un `<canvas aria-hidden>` en la sección y `mountParticleTitle({ stage, canvas, title, onReady })`. Máximo uno visible a la vez: es la firma del sitio, no decoración.
- **Luz que sigue al cursor + grano** (`data-spotlight`, en `scripts/motion.ts`): el script solo actualiza `--mx`/`--my`; el CSS de la tarjeta pinta un degradado radial de acento (`.card-light`) y grano monocromo (`bg-grain`, `mix-blend-mode: soft-light`) enmascarado donde cae la luz, sobre un grano base sutil (`bg-noise`). Solo con ratón. Hoy: tarjetas de proyectos. **Gabo rechazó la inclinación 3D de tarjetas (le parece retro): no la propongas de nuevo.**
- **Peso medido**: JS inicial ≈ 51 KB gzip (GSAP + ScrollTrigger ≈ 44 KB, Lenis + scripts ≈ 7 KB); three.js + partículas ≈ 130 KB gzip diferidos. Cualquier efecto nuevo debe reutilizar GSAP/three y no sumar librerías.
- **Ojo**: no ocultes el `<h1>` con `autoAlpha`/`visibility` (lo saca del árbol de accesibilidad): usa solo `opacity`. Y no dejes comentarios HTML con etiquetas dentro (`<!-- … <h1> … -->`): se publican y confunden a la auditoría; usa comentarios en el frontmatter.

- **Ilustraciones de servicios** (`components/services/Viz*.astro`): mini-demos que *muestran* lo que se entrega (web que se construye, indicador de rendimiento, IA recomendando el negocio, panel con gráfico). Patrón: raíz con `data-viz`; `scripts/motion.ts` le pone `data-inview` al verla y el CSS anima con keyframes. El estado oculto inicial va bajo `.js` (clase que pone el script inline del layout), así sin JS se ve el estado final. Son ilustraciones (`aria-hidden`), nunca métricas o testimonios reales: el negocio del ejemplo es "Tu negocio".
- **Líneas de progreso** (`data-progress="x|y"` dentro de `data-progress-scope`): se llenan con el degradado de firma con scrub. Hoy: proceso y línea de tiempo de experiencia.
- **Marquesina** (sección Stack): CSS puro, `linear` a propósito (única excepción a la regla de curvas), se pausa al pasar el ratón; la segunda copia es `aria-hidden`.

## 1. Presupuesto de movimiento

- **Un "momento wow" por página.** En la home es el hero de partículas. Las demás secciones usan revelados sutiles (fade + 8–16px de desplazamiento) y nada más.
- **Duraciones**: micro (hover/focus) 150–200ms · revelados 400–700ms · escenas atadas al scroll con `scrub`. Nada de más de 1s que bloquee leer.
- **Curvas**: `--ease-out-expo` / `power3.out` para entradas, `--ease-in-out-quart` para transformaciones de estado. Nunca `linear` salvo en `scrub`.
- Solo se animan `transform` y `opacity` (y uniforms de shaders). Animar `top`, `width`, `height`, `filter` o `box-shadow` provoca reflow o repintado y se nota en INP.
- Escalonado (stagger) de 40–80ms. Más que eso se siente lento.

## 2. Stack

| Necesidad | Herramienta |
|---|---|
| Animaciones, timelines, scroll | `gsap` + `gsap/ScrollTrigger` (+ `gsap/SplitText` para titulares) |
| Scroll suave | `lenis` |
| 3D / partículas / shaders | `three` (sin React Three Fiber, salvo que haya muchas escenas complejas) |
| Hover y transiciones simples | CSS con los tokens de easing, sin JS |
| Transiciones entre páginas | View Transitions de Astro |

No agregues otras librerías de animación (framer-motion, anime.js, AOS…). Mezclar motores duplica peso y produce timings inconsistentes.

## 3. Mejora progresiva (no negociable)

El sitio debe verse completo y legible **sin JS, con JS fallido y con movimiento reducido**:

- El contenido nunca empieza oculto solo con CSS. Si un elemento se revela con JS, el estado inicial oculto se aplica con JS (`gsap.set` o `gsap.from`), o con una clase `.js-motion` que un script inline pone en `<html>`.
- Todo el código de motion vive dentro de `gsap.matchMedia()` con la condición `(prefers-reduced-motion: no-preference)`. Con movimiento reducido: no hay Lenis, no hay scrub, no hay partículas; se muestra el estado final.
- Todo texto que se dibuje en canvas/WebGL existe también como texto real en el DOM (ver la receta de partículas). El canvas lleva `aria-hidden="true"`.

## 4. Cargar sin penalizar el rendimiento

- El código pesado vive en `src/components/fx/`. Los `<script>` de Astro se empaquetan y deduplican, pero **three.js se carga con `import()` dinámico** cuando la sección está por entrar en pantalla (IntersectionObserver con `rootMargin: '200px'`) o en `requestIdleCallback` si es el hero. Así no entra en el JS inicial (presupuesto: < 50 KB).
- El contenedor de cualquier canvas tiene tamaño reservado (`h-svh`, `aspect-*`) para evitar CLS.
- Registra plugins una sola vez: `gsap.registerPlugin(ScrollTrigger, SplitText)`.

### Lenis + ScrollTrigger (en el layout, una sola instancia)

```ts
const lenis = new Lenis({ autoRaf: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Prefiere `position: sticky` para escenas fijas durante el scroll en lugar de `pin: true`: da menos problemas de layout con Lenis y en móvil.

## 5. Ciclo de vida con View Transitions

Si se usa `<ClientRouter />`, los scripts no se re-ejecutan al navegar. Inicializa en `astro:page-load` y limpia en `astro:before-swap`:

```ts
let mm: gsap.MatchMedia | undefined;
document.addEventListener('astro:page-load', () => {
  mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // crear animaciones aquí; se revierten solas con mm.revert()
    return () => { /* limpieza extra: renderer.dispose(), cancelAnimationFrame… */ };
  });
});
document.addEventListener('astro:before-swap', () => mm?.revert());
```

Sin `ClientRouter` (navegación MPA normal con `@view-transition { navigation: auto; }` en CSS), basta con inicializar al cargar. Esta es la opción más simple y recomendada mientras no haga falta estado persistente entre páginas.

## 6. three.js: reglas de rendimiento

- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`.
- Renderiza solo cuando se ve: pausa el loop con IntersectionObserver y con `document.hidden`.
- Redimensiona con `ResizeObserver` sobre el contenedor, no con `window.resize`.
- Menos partículas en móvil (aprox. la mitad) y `antialias: false` para escenas de puntos.
- Libera todo al destruir: `geometry.dispose()`, `material.dispose()`, `renderer.dispose()`.
- Verifica soporte de WebGL. Si falla, se queda el fallback de DOM sin errores en consola.
- Colores desde los tokens CSS: lee `--fg`/`--accent` con `getComputedStyle` y conviértelos (THREE.Color no entiende `oklch`; ver helper en la receta). Re-léelos cuando cambie `data-theme`.

## 7. Recetas

- **Texto de partículas que forma palabras con el scroll** → [references/particle-text.md](references/particle-text.md)
- **Revelado de titulares con SplitText**: divide por líneas con `mask: 'lines'` y anima `yPercent: 100 → 0`, `stagger: 0.06`, `ease: 'expo.out'`, con ScrollTrigger `start: 'top 80%'` y `once: true`. Llama `split.revert()` al limpiar para devolver el texto original (accesible).
- **Revelado genérico de secciones**: `gsap.from(el, { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })`. Usa `ScrollTrigger.batch` cuando sean muchas tarjetas.

## Antes de terminar

Prueba con `prefers-reduced-motion` activado (DevTools → Rendering), con JS desactivado, en un móvil de gama media (CPU throttling 4×) y navegando entre páginas ida y vuelta (sin animaciones duplicadas ni fugas de WebGL). La consola debe quedar limpia.
