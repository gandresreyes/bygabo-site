import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { SITE } from '../config/site';

// Imagen Open Graph (1200×630) generada en build con la estética del sitio.
// Satori no entiende variables CSS ni oklch: estos hex son los tokens del tema oscuro de global.css.
const COLORS = { bg: '#090a0e', fg: '#f1f4f7', muted: '#a0a5ad', accent: '#4ee6d0', border: '#1c1e23' };

// Desde la raíz del proyecto: en build este módulo se empaqueta en otra carpeta.
const font = (path: string) => readFile(join(process.cwd(), 'node_modules/@fontsource', path));

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export const GET: APIRoute = async () => {
  const [sans400, sans600, mono400] = await Promise.all([
    font('geist-sans/files/geist-sans-latin-400-normal.woff'),
    font('geist-sans/files/geist-sans-latin-600-normal.woff'),
    font('geist-mono/files/geist-mono-latin-400-normal.woff'),
  ]);

  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', // marca arriba, titular abajo
      padding: '72px 80px',
      boxSizing: 'border-box', // Satori suma el padding a la altura por defecto
      backgroundColor: COLORS.bg,
      backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
      backgroundSize: '64px 64px',
      color: COLORS.fg,
      fontFamily: 'Geist',
    },
    [
      h('div', { display: 'flex', fontFamily: 'Geist Mono', fontSize: 28, color: COLORS.muted }, [
        h('span', {}, 'by'),
        h('span', { color: COLORS.fg }, 'gabo'),
        h('span', { color: COLORS.accent }, '_'),
      ]),
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h(
          'div',
          {
            fontFamily: 'Geist Mono',
            fontSize: 26,
            color: COLORS.accent,
            letterSpacing: 2,
            textTransform: 'uppercase',
          },
          `Webs y aplicaciones a medida · ${SITE.location.city}`,
        ),
        h('div', { fontSize: 120, fontWeight: 600, letterSpacing: -5, lineHeight: '120px', marginTop: 24 }, SITE.name),
        h(
          'div',
          { fontSize: 36, color: COLORS.muted, marginTop: 28, maxWidth: 1040, lineHeight: '48px' },
          SITE.tagline,
        ),
      ]),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: sans400, weight: 400, style: 'normal' },
      { name: 'Geist', data: sans600, weight: 600, style: 'normal' },
      { name: 'Geist Mono', data: mono400, weight: 400, style: 'normal' },
    ],
  });
  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
