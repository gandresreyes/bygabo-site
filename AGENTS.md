# Gabo — sitio personal

## Proyecto

Sitio personal de Gabriel Reyes (Gabo), desarrollador de software. Objetivo: que personas, buscadores y asistentes de IA entiendan rápido quién es y qué construye. Estética de referencia: Apple × Vercel × GitHub (sobria, precisa, tipográfica), con un momento de movimiento protagonista (texto de partículas al hacer scroll) y toques de 3D.

Stack: Astro 7 (salida estática) · Tailwind 4 · TypeScript strict · GSAP + Lenis · three.js · deploy en Vercel.

## Decisiones tomadas

| Tema | Decisión |
| --- | --- |
| Dominio | `bygabo.dev` (en compra). Hoy: pruebas en `bygabo-site.vercel.app` (Vercel, `main` → producción), sin indexar hasta conectar el dominio |
| Idioma | Solo español por ahora; preparado para agregar inglés en `/en/` sin cambiar URLs |
| Blog | Aún no. Solo proyectos |
| Objetivo | Atraer clientes que quieren crear o renovar su página web (prioridad) y, en segundo plano, empleo. Etiqueta `SITE.availability` en hero y contacto |
| Posicionamiento | Gabo es "desarrollador de páginas web y aplicaciones a medida" (`SITE.jobTitle`). Todo el contenido gira en torno a eso |
| Tono de los textos | Orientado al cliente y **no técnico**: hablar de su web y sus resultados ("tu web", "que te encuentren"), nunca "busco proyectos/empleo". Nada de jerga en textos visibles (Keycloak, OAuth2, API REST, Core Web Vitals, PWA…); el detalle técnico solo en `llms.txt` y JSON-LD. La experiencia bancaria es argumento de confianza, no el titular |
| Trayectoria | En la home, solo un resumen por etapas (`journey` en `profile.ts`, sección `Journey.astro`). El detalle por empresa queda en `experience` para `llms.txt` y en LinkedIn |
| Búsquedas objetivo | "hacer / crear mi página web", "actualizar / renovar / rediseñar mi web", "diseño web León", SEO y visibilidad en IA. Servicios y FAQ en `src/data/services.ts` (alimentan la home, JSON-LD y `llms.txt`) |
| Contenido | Trayectoria en `src/data/profile.ts` (del CV), proyectos en `src/data/projects.ts` (Deleic, CAP Estudio). No inventar datos |
| Pendiente | Foto (aún no), email público con el dominio, ficha de Google Business Profile y Search Console (cuando `bygabo.dev` esté activo) |
| Paleta | "Signal" (confirmada): neutros tinta (tinte azul frío) + acento cian-menta. Ver `/styleguide` |
| Color extra | Degradado cian → índigo (`accent-2`) solo en líneas e ilustraciones. **Nunca en texto** (no le gusta) |
| Favicon | Prompt `❯_` con cursor cian sobre tinta (`public/favicon.svg`; los PNG/ICO se generan desde él) |
| Tipografía | Geist + Geist Mono |
| Referencia de motion | mesh3d.gallery (sensación de "sumergirse" con el scroll), en versión ligera |

## Reglas no negociables

1. **El contenido va primero.** Todo texto importante existe como HTML semántico; los efectos (canvas, WebGL, animaciones) son una capa encima y llevan `aria-hidden`.
2. **Solo tokens.** Colores, tipografía, radios y easings salen de `src/styles/global.css`. Nada de hex ni de paleta cruda de Tailwind en componentes.
3. **Un momento "wow" por página.** El resto del movimiento es sutil y siempre respeta `prefers-reduced-motion`.
4. **Cero JS por defecto.** El JS pesado (three.js) se carga con `import()` dinámico al entrar en pantalla. JS inicial < 50 KB.
5. **Presupuesto**: Lighthouse ≥ 95 en todo · LCP < 2 s · CLS < 0.05.
6. **Datos del sitio en un solo lugar**: `src/config/site.ts` (nombre, rol, URL, redes). SEO, JSON-LD y `llms.txt` lo importan.
7. **Accesible**: contraste AA, focus visible, navegable con teclado, `alt` en imágenes.

## Skills del proyecto (`.claude/skills/`)

| Skill | Cuándo |
| --- | --- |
| `design-system` | Cualquier componente, sección, estilo o clase de Tailwind |
| `seo-geo` | Páginas nuevas, `<head>`, contenido, proyectos, blog, robots/sitemap/llms.txt |
| `motion-3d` | Animaciones, scroll, GSAP, Lenis, three.js, partículas, transiciones |
| `ship-check` | Al terminar una feature y antes de publicar |

## Development

When starting the dev server, use background mode:

```bash
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: <https://docs.astro.build>

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
