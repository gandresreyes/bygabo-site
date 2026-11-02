// Texto que se desordena y se rearma en otra frase, letra a letra de izquierda a derecha.
// Las letras aún desordenadas van en acento; las resueltas, en el color del titular.
// Sin GSAP: un requestAnimationFrame mientras cambia y un setTimeout entre frases.

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz';
const HOLD = 2600; // ms que se lee cada frase
const STAGGER = 28; // ms entre el arranque de una letra y la siguiente
const SPIN = [220, 420]; // ms que cada letra pasa desordenada (mín, máx)

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export function initScramble(el: HTMLElement) {
  const words = JSON.parse(el.dataset.scramble ?? '[]') as string[];
  if (words.length < 2) return;

  // El texto real queda para lectores de pantalla; lo que se anima es decorativo.
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = words[0];
  el.before(label);
  el.setAttribute('aria-hidden', 'true');

  let index = 0;
  let current = words[0];
  let visible = false;
  let animating = false;
  let timer = 0;

  // Altura fija = la de la frase más alta a este ancho: cambiar de frase nunca mueve lo de abajo (CLS 0).
  const lockHeight = () => {
    el.style.height = '';
    let max = 0;
    for (const word of words) {
      el.textContent = word;
      max = Math.max(max, el.offsetHeight);
    }
    el.textContent = current;
    el.style.height = `${max}px`;
  };

  const scrambleTo = (target: string) => {
    animating = true;
    const from = current;
    const length = Math.max(from.length, target.length);
    const letters = Array.from({ length }, (_, i) => {
      const start = i * STAGGER + Math.random() * STAGGER;
      return { start, end: start + SPIN[0] + Math.random() * (SPIN[1] - SPIN[0]), glyph: randomGlyph() };
    });
    const t0 = performance.now();

    const frame = (now: number) => {
      const t = now - t0;
      let html = '';
      let done = true;
      letters.forEach((letter, i) => {
        const to = target[i] ?? '';
        if (t >= letter.end) html += escape(to);
        else if (t < letter.start) {
          html += escape(from[i] ?? '');
          done = false;
        } else {
          // Los espacios se mantienen para que las palabras corten igual que la frase final.
          if (to === ' ' || to === '') html += escape(to);
          else {
            if (Math.random() < 0.35) letter.glyph = randomGlyph();
            html += `<span class="text-accent">${letter.glyph}</span>`;
          }
          done = false;
        }
      });
      el.innerHTML = html;
      if (!done) return void requestAnimationFrame(frame);
      current = target;
      el.textContent = target;
      animating = false;
      schedule();
    };
    requestAnimationFrame(frame);
  };

  // Solo cambia mientras se ve: fuera de pantalla se queda quieto y no gasta nada.
  const schedule = () => {
    clearTimeout(timer);
    if (!visible || animating) return;
    timer = window.setTimeout(() => {
      index = (index + 1) % words.length;
      scrambleTo(words[index]);
    }, HOLD);
  };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else clearTimeout(timer);
  }).observe(el);

  // Reajusta la altura si cambia el ancho (giro del móvil, ventana) o al terminar de cargar la fuente.
  let width = 0;
  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === width) return;
    width = entry.contentRect.width;
    lockHeight();
  }).observe(el);
  void document.fonts.ready.then(lockHeight);
}
