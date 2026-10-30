---
name: ship-check
description: Verificación de calidad antes de dar por terminado un cambio o publicar el sitio de Gabo — tipos (astro check), build, auditoría automática del HTML generado (títulos, descripciones, canonical, h1, Open Graph, JSON-LD, alt, robots/sitemap/llms.txt), Lighthouse con presupuestos de Core Web Vitals, accesibilidad, modo claro/oscuro, móvil y movimiento reducido. Úsala SIEMPRE al terminar una página, sección o feature, antes de un commit importante o un deploy a Vercel, y cuando el usuario pregunte "¿está listo?", "revisa que todo esté bien", "¿cómo va el SEO/rendimiento?" o "vamos a publicar".
---

# Ship check

Un sitio personal se juzga en los primeros 3 segundos, y Google y las IA lo juzgan por su HTML y sus Core Web Vitals. Esta revisión atrapa lo que se rompe en silencio: una página sin descripción, un JSON-LD inválido, un canvas que mete 400 ms de bloqueo. Repórtale al usuario lo que encuentres con honestidad: si algo falla, dilo con la salida real.

## 1. Automático (en este orden, detente si algo falla)

```bash
npx astro check                                        # tipos y diagnósticos de Astro
npm run build                                          # debe terminar sin warnings nuevos
node .claude/skills/ship-check/scripts/audit-dist.mjs  # SEO/GEO/a11y del HTML generado
```

El script revisa cada página en `dist/`: `lang`, `<title>` (≤ 60), meta description (120–160), un solo `h1`, canonical absoluta, Open Graph y Twitter, JSON-LD que parsea, `alt` en imágenes, enlaces genéricos, títulos y descripciones duplicados, y que existan `robots.txt`, `sitemap-index.xml`, `llms.txt` y `404.html` (más `rss.xml` cuando exista `dist/blog/`). Las páginas `noindex` se excluyen de las comprobaciones de canonical, OG y duplicados.

Si alguno de esos archivos todavía no aplica, dilo explícitamente en el reporte en lugar de ignorarlo.

## 2. Lighthouse (rendimiento real)

```bash
astro preview --port 4321 &   # o el servidor en background
npx -y lighthouse http://localhost:4321/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./.lighthouse/home-desktop.json --chrome-flags="--headless"
npx -y lighthouse http://localhost:4321/ --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./.lighthouse/home-mobile.json --chrome-flags="--headless"
```

Corre esto sobre la home y sobre la página que cambiaste. `.lighthouse/` no se commitea.

**Presupuesto (falla si no se cumple):**

| Métrica | Objetivo |
|---|---|
| Performance / Accessibility / Best Practices / SEO | ≥ 95 (móvil y desktop) |
| LCP | < 2.0 s |
| CLS | < 0.05 |
| TBT (proxy de INP en laboratorio) | < 150 ms |
| JS inicial (sin el 3D diferido) | < 50 KB gzip |

Para el peso de JS, revisa los chunks en `dist/_astro/*.js`. three.js no debe aparecer en el HTML inicial como `<script>` ni como `modulepreload`.

## 3. Manual (usa el navegador si está disponible y si no, deja la lista al usuario)

- [ ] **375 px**: sin scroll horizontal, texto legible y áreas táctiles ≥ 44 px.
- [ ] **Claro y oscuro**: ambos cuidados, sin parpadeo de tema al cargar.
- [ ] **Teclado**: Tab recorre todo en orden lógico, el focus siempre es visible y hay skip link al contenido.
- [ ] **Movimiento reducido** (DevTools → Rendering → `prefers-reduced-motion: reduce`): todo visible, sin Lenis ni partículas.
- [ ] **Sin JS**: el contenido completo se lee.
- [ ] **CPU 4× throttling**: el hero y el 3D mantienen la fluidez.
- [ ] **Consola limpia**: sin errores ni warnings, incluso tras navegar entre páginas varias veces.
- [ ] **Vista previa social**: la imagen OG se ve bien (prueba la URL en opengraph.xyz o en el validador de LinkedIn después del deploy).

## 4. Reporte

Termina con este formato, breve:

```
## Ship check — <qué se revisó>
✓ astro check · ✓ build · ✗ auditoría (2 errores)
Lighthouse móvil: P 97 · A 100 · BP 100 · SEO 100 · LCP 1.6 s · CLS 0.01
Pendiente:
- /projects/foo: meta description de 52 caracteres → ampliar
- falta llms.txt
Manual: no verificado (sin navegador) → lista para el usuario: …
```

## Después del deploy (solo en el primer lanzamiento o cuando cambie el dominio)

Envía el sitemap en Google Search Console y en Bing Webmaster Tools (Bing alimenta ChatGPT Search y Copilot), valida el JSON-LD en validator.schema.org y comprueba que `https://<dominio>/robots.txt` y `/llms.txt` responden.
