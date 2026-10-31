// Nombre en partículas para el hero.
// intro: 0 = partículas dispersas en profundidad · 1 = forman el nombre.
// dive:  0 = nombre formado · 1 = la cámara lo atraviesa (se abren hacia el espectador).
// Se carga con import() dinámico: three.js nunca entra en el JS inicial.
import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';

/** Convierte cualquier color CSS (incluido oklch) a RGB 0–1 pasando por un canvas 2D. */
export function cssColorToRGB(css: string): [number, number, number] {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/** Posición de cada palabra del título respecto al contenedor (soporta títulos en varias líneas). */
function wordBoxes(title: HTMLElement, origin: DOMRect) {
  const boxes: { text: string; x: number; y: number }[] = [];
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    for (const match of node.textContent!.matchAll(/\S+/g)) {
      const range = document.createRange();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const rect = range.getBoundingClientRect();
      boxes.push({ text: match[0], x: rect.left - origin.left, y: rect.top - origin.top + rect.height / 2 });
    }
  }
  return boxes;
}

/** Dibuja el título con su tipografía real y devuelve un punto (x, y, 0) por cada píxel opaco muestreado. */
function sampleTitle(title: HTMLElement, width: number, height: number, origin: DOMRect, step: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const style = getComputedStyle(title);
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  for (const { text, x, y } of wordBoxes(title, origin)) ctx.fillText(text, x, y);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: number[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] < 128) continue;
      // Desplazamiento aleatorio dentro de la celda: evita el aspecto de retícula.
      const jx = (Math.random() - 0.5) * step;
      const jy = (Math.random() - 0.5) * step;
      points.push(x + jx - width / 2, height / 2 - (y + jy), 0);
    }
  }
  return new Float32Array(points);
}

const vertexShader = /* glsl */ `
  uniform float uIntro;
  uniform float uDive;
  uniform float uTime;
  uniform float uSize;
  uniform float uCameraZ;
  attribute vec3 aStart;
  attribute float aRand;
  attribute float aAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    // Cada partícula llega con un retraso distinto y frena con ease-out cúbico.
    float p = clamp((uIntro - aRand * 0.4) / 0.6, 0.0, 1.0);
    p = 1.0 - pow(1.0 - p, 3.0);
    vec3 pos = mix(aStart, position, p);

    // Respiración: deriva amplia mientras viajan, casi imperceptible ya formadas.
    float phase = aRand * 6.2831;
    pos.xy += vec2(sin(uTime * 0.8 + phase), cos(uTime * 0.7 + phase)) * mix(14.0, 0.7, p);

    // Inmersión: avanzan hacia la cámara y se abren, como atravesar el nombre.
    float d = uDive * uDive;
    pos.z += d * uCameraZ * (0.5 + aRand * 0.9);
    pos.xy *= 1.0 + d * aRand * 1.4;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float depth = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = depth < 1.0 ? 0.0 : min(uSize * uCameraZ / depth, 48.0);
    vAlpha = mix(0.12, 1.0, p) * (1.0 - smoothstep(0.55, 1.0, uDive));
    vAccent = aAccent;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(mix(uColor, uAccent, vAccent), vAlpha * smoothstep(0.5, 0.1, d));
  }
`;

export interface ParticleName {
  setIntro(value: number): void;
  setDive(value: number): void;
  /** Posición del puntero normalizada a -1..1 (parallax sutil). */
  setPointer(x: number, y: number): void;
  setColors(fg: string, accent: string): void;
  destroy(): void;
}

export interface ParticleOptions {
  /** Separación en px entre muestras del texto (menor = más partículas). */
  step?: number;
  /** Tamaño base de cada partícula en px CSS. */
  size?: number;
}

const FOV = 35;
/** Fracción de partículas que toman el color de acento. */
const ACCENT_RATIO = 0.12;

export function createParticleName(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  title: HTMLElement,
  colors: { fg: string; accent: string },
  options: ParticleOptions = {},
): ParticleName {
  const isSmall = matchMedia('(max-width: 768px)').matches;
  // En móvil: menos partículas (paso mayor) y resolución limitada a 1.5x; la diferencia no se ve
  // en una pantalla pequeña y el coste por fotograma baja a menos de la mitad.
  const step = options.step ?? 3;
  const dpr = Math.min(devicePixelRatio, isSmall ? 1.5 : 2);

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 10000);

  const uniforms = {
    uIntro: { value: 0 },
    uDive: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: (options.size ?? (isSmall ? 1.9 : 2.4)) * dpr },
    uCameraZ: { value: 1000 },
    uColor: { value: new Vector3(...cssColorToRGB(colors.fg)) },
    uAccent: { value: new Vector3(...cssColorToRGB(colors.accent)) },
  };
  const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false });
  const geometry = new BufferGeometry();
  const points = new Points(geometry, material);
  scene.add(points);

  function build() {
    const origin = stage.getBoundingClientRect();
    const width = Math.round(origin.width);
    const height = Math.round(origin.height);
    if (!width || !height) return;
    renderer.setSize(width, height, false);

    // Distancia a la que 1 unidad del mundo = 1 px en el plano z = 0.
    const cameraZ = height / 2 / Math.tan((FOV * Math.PI) / 360);
    camera.aspect = width / height;
    camera.position.z = cameraZ;
    camera.updateProjectionMatrix();
    uniforms.uCameraZ.value = cameraZ;

    const targets = sampleTitle(title, width, height, origin, step);
    const count = targets.length / 3;
    const starts = new Float32Array(count * 3);
    const rands = new Float32Array(count);
    const accents = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Nacen en un volumen profundo detrás del nombre.
      starts[i * 3] = (Math.random() - 0.5) * width * 2.4;
      starts[i * 3 + 1] = (Math.random() - 0.5) * height * 2.4;
      starts[i * 3 + 2] = -cameraZ * (0.3 + Math.random() * 2.2);
      rands[i] = Math.random();
      accents[i] = Math.random() < ACCENT_RATIO ? 1 : 0;
    }
    geometry.setAttribute('position', new BufferAttribute(targets, 3));
    geometry.setAttribute('aStart', new BufferAttribute(starts, 3));
    geometry.setAttribute('aRand', new BufferAttribute(rands, 1));
    geometry.setAttribute('aAccent', new BufferAttribute(accents, 1));
  }

  const pointer = { x: 0, y: 0 };
  let raf = 0;
  let visible = true;
  const tick = (t: number) => {
    uniforms.uTime.value = t / 1000;
    // Parallax suave hacia el puntero.
    points.rotation.y += (pointer.x * 0.08 - points.rotation.y) * 0.05;
    points.rotation.x += (-pointer.y * 0.05 - points.rotation.x) * 0.05;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(stage);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);
  let resizeQueued = false;
  const ro = new ResizeObserver(() => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      build();
    });
  });
  ro.observe(stage);

  build();
  start();

  return {
    setIntro: (v) => void (uniforms.uIntro.value = v),
    setDive: (v) => void (uniforms.uDive.value = v),
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    setColors(fg, accent) {
      uniforms.uColor.value.set(...cssColorToRGB(fg));
      uniforms.uAccent.value.set(...cssColorToRGB(accent));
    },
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
