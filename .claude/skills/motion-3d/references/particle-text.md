# Receta: texto de partículas que se forma con el scroll

## Idea

1. Dibuja la palabra en un canvas 2D oculto con la fuente real del sitio.
2. Lee sus píxeles (`getImageData`) y toma uno de cada `step` píxeles opacos: esas son las **posiciones destino**.
3. Crea miles de puntos en three.js con posiciones **iniciales aleatorias** (caos).
4. Un shader interpola de inicio a destino según `uProgress` (0 → 1), con un retraso distinto por partícula para que la palabra se "condense" orgánicamente.
5. ScrollTrigger con `scrub` controla `uProgress`. Al llegar a 1, el `<h1>` real aparece y el canvas se desvanece, así el texto final es nítido, seleccionable y accesible.

Varias palabras: toma las muestras de cada una, iguala la cantidad de puntos (repite índices) y agrega un segundo uniform `uMorph` para pasar de destino A a destino B.

## Estructura de archivos

```
src/components/fx/
  ParticleHero.astro   ← marcado + script que orquesta
  particle-text.ts     ← lógica de three.js (se carga con import() dinámico)
```

## `particle-text.ts`

```ts
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, NormalBlending,
  OrthographicCamera, Points, Scene, ShaderMaterial, WebGLRenderer,
} from 'three';

/** Convierte cualquier color CSS (incluido oklch) a RGB 0–1 pasando por canvas 2D. */
export function cssColorToRGB(css: string): [number, number, number] {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/** Devuelve posiciones (x, y, 0) centradas en px CSS para cada píxel opaco muestreado. */
function sampleText(text: string, fontFamily: string, width: number, height: number, step: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // Ajusta el tamaño de la fuente para que el texto ocupe ~85% del ancho.
  let size = height * 0.4;
  ctx.font = `600 ${size}px ${fontFamily}`;
  size *= Math.min(1, (width * 0.85) / ctx.measureText(text).width);
  ctx.font = `600 ${size}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: number[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 128) points.push(x - width / 2, height / 2 - y, 0);
    }
  }
  return new Float32Array(points);
}

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  attribute vec3 aStart;
  attribute float aRand;
  varying float vAlpha;

  void main() {
    // Cada partícula arranca con un retraso distinto y llega con ease-out cúbico.
    float p = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
    p = 1.0 - pow(1.0 - p, 3.0);
    vec3 pos = mix(aStart, position, p);
    // Deriva suave mientras está en caos; desaparece al formarse la palabra.
    float phase = aRand * 6.2831;
    pos.xy += (1.0 - p) * vec2(sin(uTime * 0.6 + phase), cos(uTime * 0.5 + phase)) * 12.0;
    vAlpha = mix(0.25, 1.0, p);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.15, d));
  }
`;

export interface ParticleText {
  setProgress(value: number): void;
  setColor(css: string): void;
  destroy(): void;
}

export function createParticleText(
  canvas: HTMLCanvasElement,
  opts: { text: string; fontFamily: string; color: string },
): ParticleText {
  const container = canvas.parentElement!;
  const isMobile = matchMedia('(max-width: 768px)').matches;
  const step = isMobile ? 5 : 4; // menos puntos en móvil
  const dpr = Math.min(devicePixelRatio, 2);

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(dpr);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -10, 10);

  const uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: (isMobile ? 2 : 2.5) * dpr },
    uColor: { value: new Color(...cssColorToRGB(opts.color)) },
  };
  const material = new ShaderMaterial({
    uniforms, vertexShader, fragmentShader,
    transparent: true, depthWrite: false, blending: NormalBlending,
  });
  const geometry = new BufferGeometry();
  const points = new Points(geometry, material);
  scene.add(points);

  function build() {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false);
    Object.assign(camera, { left: -width / 2, right: width / 2, top: height / 2, bottom: -height / 2 });
    camera.updateProjectionMatrix();

    const targets = sampleText(opts.text, opts.fontFamily, Math.round(width), Math.round(height), step);
    const count = targets.length / 3;
    const starts = new Float32Array(count * 3);
    const rands = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      starts[i * 3] = (Math.random() - 0.5) * width * 1.6;
      starts[i * 3 + 1] = (Math.random() - 0.5) * height * 1.6;
      starts[i * 3 + 2] = 0;
      rands[i] = Math.random();
    }
    geometry.setAttribute('position', new BufferAttribute(targets, 3));
    geometry.setAttribute('aStart', new BufferAttribute(starts, 3));
    geometry.setAttribute('aRand', new BufferAttribute(rands, 1));
  }

  let raf = 0;
  let visible = true;
  const tick = (t: number) => {
    uniforms.uTime.value = t / 1000;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); });
  io.observe(container);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);
  let resizeQueued = false;
  const ro = new ResizeObserver(() => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => { resizeQueued = false; build(); });
  });
  ro.observe(container);

  build();
  start();

  return {
    setProgress: (v) => { uniforms.uProgress.value = v; },
    setColor: (css) => { uniforms.uColor.value.setRGB(...cssColorToRGB(css)); },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
```

Para un look más luminoso en modo oscuro, cambia a `AdditiveBlending` solo cuando `data-theme="dark"`.

## `ParticleHero.astro`

```astro
---
interface Props { text: string; lede?: string }
const { text, lede } = Astro.props;
---
<section class="relative h-[220svh]" data-particle-hero>
  <div class="sticky top-0 grid h-svh place-items-center overflow-hidden">
    <div class="relative z-10 px-4 text-center">
      <h1 class="text-display" data-hero-title>{text}</h1>
      {lede && <p class="mt-6 text-lede text-muted" data-hero-lede>{lede}</p>}
    </div>
    <canvas class="pointer-events-none absolute inset-0 size-full" aria-hidden="true" data-hero-canvas></canvas>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector<HTMLElement>('[data-particle-hero]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const title = section?.querySelector<HTMLElement>('[data-hero-title]');

  if (section && canvas && title) {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let fx: import('./particle-text').ParticleText | undefined;
      let cancelled = false;

      const init = async () => {
        const css = getComputedStyle(document.documentElement);
        const fontFamily = getComputedStyle(title).fontFamily;
        await document.fonts.load(`600 100px ${fontFamily}`);
        const { createParticleText } = await import('./particle-text');
        if (cancelled) return;
        try {
          fx = createParticleText(canvas, { text: title.textContent!.trim(), fontFamily, color: css.getPropertyValue('--fg') });
        } catch {
          return; // sin WebGL: el <h1> se queda como está
        }
        // El h1 real ya se pintó (es el LCP); ahora lo ocultamos y las partículas toman el relevo.
        gsap.set(title, { autoAlpha: 0 });
        let done = false;
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: ({ progress }) => {
            fx!.setProgress(Math.min(progress / 0.85, 1));
            // Solo lanza el crossfade cuando cambia de estado, no en cada frame de scroll.
            if (done === progress > 0.9) return;
            done = !done;
            gsap.to(title, { autoAlpha: done ? 1 : 0, duration: 0.4, overwrite: true });
            gsap.to(canvas, { autoAlpha: done ? 0 : 1, duration: 0.4, overwrite: true });
          },
        });
      };

      'requestIdleCallback' in window ? requestIdleCallback(init) : setTimeout(init, 1);

      return () => { cancelled = true; fx?.destroy(); };
    });
  }
</script>
```

## Notas

- **Dirección**: esta versión va de caos → palabra al bajar. Para palabra → explosión, invierte el progreso (`1 - progress`).
- **Densidad**: `step` 4 ≈ 6–12k puntos en desktop para un titular. Si baja de 60fps con CPU 4× throttling, sube `step`.
- **Tema**: observa `data-theme` con un `MutationObserver` en `<html>` y llama a `fx.setColor(nuevoColor)`.
- **SEO/a11y**: el `<h1>` siempre existe en el HTML con el texto completo, así que buscadores, IA y lectores de pantalla lo leen igual.
