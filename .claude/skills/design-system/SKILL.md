---
name: design-system
description: Sistema de diseño del sitio personal de Gabo (estética Apple × Vercel × GitHub) — tokens de color, tipografía Geist, espaciado, superficies, componentes y anti-patrones, con Astro 7 + Tailwind 4. Úsala SIEMPRE que crees o modifiques cualquier componente, página, sección, layout, estilo, color, fuente, espaciado o clase de Tailwind en este proyecto, aunque el pedido no diga "diseño" (p. ej. "haz la sección de proyectos", "mejora el hero", "agrega un botón de contacto", "make the footer look better").
---

# Sistema de diseño

El objetivo es que el sitio se sienta como Apple, Vercel o GitHub: **sobrio, preciso y seguro de sí mismo**. Esa elegancia sale de la contención (pocos colores, mucha tipografía, mucho aire, detalles finos), no de añadir efectos. Cuando dudes entre añadir o quitar, quita.

## 1. Tokens: la única fuente de verdad

Los tokens viven en `src/styles/global.css` (bloques `@theme` y variables de tema). Léelo antes de escribir estilos.

- Para ver todos los tokens en vivo (claro/oscuro) abre `/styleguide` con el servidor de desarrollo.
- **En componentes usa solo tokens semánticos**: `bg-bg`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-muted`, `text-faint`, `border-border`, `border-border-strong`, `text-accent`, `bg-accent`, `text-accent-fg`, `bg-accent-soft`. Nunca hex, `rgb()`, ni la paleta cruda de Tailwind (`zinc-800`, `blue-500`). Así el modo claro/oscuro y un futuro cambio de acento funcionan sin tocar componentes.
- Si necesitas un valor que no existe, agrégalo como token en `global.css` con un nombre semántico, no lo escribas suelto.

## 2. Color — paleta "Signal"

| Token | Oscuro | Claro | Rol |
|---|---|---|---|
| `bg` | `#090a0e` | `#fbfcfd` | Fondo de página |
| `surface` / `surface-2` | `#101216` / `#17191e` | `#f4f5f8` / `#ebedf0` | Tarjetas / hover y elevación |
| `fg` | `#f1f4f7` | `#0f1217` | Texto principal (~18:1) |
| `muted` | `#a0a5ad` | `#575b63` | Texto secundario (≥ 6.2:1) |
| `faint` | — | — | Solo decorativo: líneas, íconos inactivos. **Nunca texto** (no pasa AA) |
| `accent` | `≈ #4ee6d0` cian-menta | `#007475` teal | Acción y énfasis (≥ 5.1:1) |
| `accent-soft` | acento al 14% | acento al 14% | Fondo de badges y estados |

Los neutros son "tinta": casi negro con un leve tinte azul frío (hue 265), nunca gris puro ni negro `#000`; eso es lo que da el aire sofisticado. El acento cian-menta es la firma de Gabo (elegido por él frente a índigo, ámbar y lima; no proponer cambiarlo sin que lo pida): evoca la señal de un terminal o un build en verde, técnico sin caer en el verde hacker.

- **Degradado de firma** (`text-gradient`, `bg-gradient-signal`): cian `accent` → índigo `accent-2`. Gabo pidió más color y vida; este degradado es la vía, no colores nuevos. Úsalo solo en: la palabra clave de un titular (`SectionHeader` con `highlight`, una por sección como mucho), líneas de progreso, números de paso e ilustraciones. `accent-2` nunca va como color plano de UI.
- **Neutros tinta + un solo acento.** El acento se reserva para lo accionable o lo que debe destacar (CTA principal, enlaces en texto, un dato clave). Si aparece en más de ~3 lugares por pantalla, pierde fuerza.
- **Se diseña primero en oscuro** (es donde más luce el estilo Vercel/GitHub) y el modo claro debe verse igual de cuidado. El tema se controla con `data-theme="dark|light"` en `<html>`; por defecto sigue al sistema.
- **Contraste AA obligatorio**: 4.5:1 en texto normal, 3:1 en texto grande y en bordes de controles. `text-muted` es para texto secundario, nunca para texto que el usuario necesita leer para actuar.
- Degradados: solo como luz ambiental (glow suave detrás de un elemento) o en un titular puntual. Nada de degradados arcoíris.

## 3. Tipografía

Geist Sans para todo, Geist Mono para detalles técnicos (etiquetas, fechas, tags, código, "eyebrows"). Se carga con la API de fuentes de Astro ([docs](https://docs.astro.build/en/guides/fonts/)) para que se autoalojen y se precarguen.

| Token | Uso | Notas |
|---|---|---|
| `text-display` | Hero, 1 por página | fluido con `clamp`, tracking `-0.04em`, peso 600 |
| `text-title` | `h2` de sección | tracking `-0.03em` |
| `text-heading` | `h3`, títulos de tarjeta | tracking `-0.02em` |
| `text-lede` | párrafo introductorio | `text-muted`, más grande que el cuerpo |
| `text-base`/`text-lg` | cuerpo | interlineado ≥ 1.6 |
| `text-xs font-mono uppercase tracking-wider` | eyebrow / etiqueta | |

- Titulares con `text-balance`, párrafos con `text-pretty`, máximo `max-w-[65ch]` en texto corrido.
- Pesos: 400 cuerpo, 500 UI, 600 titulares. Evita 700+ (se ve pesado frente a la estética Apple).
- Jerarquía por **tamaño y color**, no por negritas por todas partes.

## 4. Layout y espaciado

- Mobile-first. Contenedor: `mx-auto max-w-(--container-page) px-4 md:px-6 lg:px-8` (16px de gutter en móvil, sin scroll horizontal nunca).
- Retícula de 8pt: usa pasos pares de Tailwind (`2, 4, 6, 8, 12, 16, 24, 32`). `1`/`px` solo para líneas finas.
- Espacio entre secciones generoso: `py-24 md:py-32`. El aire es lo que hace que se vea caro.
- Proyectos destacados en **bento grid** (Apple): celdas de distinto tamaño con `grid-cols-6`/`col-span-*`, una celda protagonista.
- Verifica en 375, 768, 1280 y 1440 px.

## 5. Superficies y detalles

- Bordes de 1px `border-border` (baja opacidad) en vez de sombras. En oscuro, las sombras casi no se ven; el borde fino + un `bg-surface` ligeramente más claro es lo que define la tarjeta.
- Radios: `rounded-md` (controles), `rounded-card` (tarjetas), `rounded-full` (pills/badges). Elementos anidados: radio interior = radio exterior − padding.
- Recursos de ambiente disponibles en tokens: `bg-grid` (cuadrícula Vercel), `bg-noise` (grano sutil de fondo), `bg-grain` (grano monocromo más marcado, para superficies iluminadas), `glow` (luz con acento). A Gabo le gusta el grano: aporta textura física. Úsalos detrás de una sola sección, con máscara que se desvanezca hacia los bordes.
- Íconos: `astro-icon` con Lucide (UI) y Simple Icons (logos de tecnologías). Nunca emojis como íconos.

## 6. Patrones de componentes

- **Encabezado de sección**: eyebrow mono → `h2 text-title` → `p text-lede`. Alineado a la izquierda por defecto; centrado solo en hero y CTA final.
- **Botón primario**: invertido (`bg-fg text-bg`), altura 40–44px, `rounded-full` o `rounded-md` (elige uno y mantenlo). **Secundario**: `border border-border bg-transparent`. Máximo un primario por vista.
- **Tarjeta**: `rounded-card border border-border bg-surface p-6`, hover sutil (borde un poco más visible o leve elevación con `translate-y-[-2px]`), toda la tarjeta clicable si enlaza a un sitio.
- **Badge/tag**: `font-mono text-xs rounded-full border px-2.5 py-0.5`.

## 7. Interacción y accesibilidad

- Transiciones de hover/focus de 150–200ms con `ease-out`. Las animaciones grandes las rige la skill `motion-3d`.
- `focus-visible` siempre visible (`outline-2 outline-offset-2 outline-accent`). Nunca `outline-none` sin reemplazo.
- Áreas táctiles ≥ 44×44px. Enlaces distinguibles de texto normal.
- HTML semántico: `header/nav/main/section/article/footer`, botones para acciones, `<a>` para navegación.

## 8. Convenciones de Astro

- Componentes `.astro` con `interface Props` tipada; combina clases con `class:list`.
- Carpetas: `components/ui` (piezas reutilizables), `components/sections` (secciones de página), `components/fx` (lo que lleva JS pesado).
- Tailwind primero; `<style>` con scope solo para lo que Tailwind no expresa bien (máscaras complejas, keyframes puntuales).
- Imágenes siempre con `<Image />`/`<Picture />` de `astro:assets`, con `alt`, `width`/`height` y `loading="eager"` + `fetchpriority="high"` solo en la imagen del hero.

## Anti-patrones (rechazar)

Más de un color de acento · degradados arcoíris · sombras pesadas · glassmorphism en todas partes · párrafos largos centrados · todo animado · texto gris claro ilegible · ilustraciones de stock · emojis como íconos · tamaños/colores mágicos fuera de los tokens · más de 2 familias tipográficas.

## Antes de terminar

Revisa: ¿solo tokens semánticos? ¿se ve bien en claro y oscuro? ¿contraste AA? ¿375px sin scroll horizontal? ¿focus visible con teclado? ¿la jerarquía se entiende con un vistazo de 3 segundos?
