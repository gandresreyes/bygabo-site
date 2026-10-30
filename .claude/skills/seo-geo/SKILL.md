---
name: seo-geo
description: SEO clásico + SEO para IA (GEO — que ChatGPT, Claude, Perplexity y Google AI te encuentren y te citen) en el sitio de Gabo con Astro 7. Cubre metadatos, componente SEO, JSON-LD (Person, WebSite, Article, proyectos), sitemap, RSS, robots.txt con bots de IA, llms.txt, imágenes OG, Content Collections y cómo redactar contenido citable. Úsala SIEMPRE que crees una página o ruta nueva, agregues un proyecto o artículo de blog, toques el <head>, el layout, astro.config, robots/sitemap/llms.txt, o escribas textos del sitio (bio, descripción de proyectos, about), aunque no se mencione "SEO".
---

# SEO + GEO

Este sitio existe para que la gente (y las IA) sepan **quién es Gabo y qué construye**. Un buscador o un LLM solo entienden el HTML: lo que no está en texto semántico no existe para ellos. Por eso cada página se piensa como un documento que debe poder leerse sin CSS ni JS.

## Estado actual del sitio (decisiones de Gabo)

- **Dominio**: `https://bygabo.dev`. Los `.dev` exigen HTTPS (HSTS precargado), así que todas las URLs absolutas van con `https://`.
- **Idioma**: solo español (`lang="es"`, `og:locale` `es_ES`) y rutas sin prefijo (`/projects/…`). Si más adelante se agrega inglés, usar la i18n de Astro con `prefixDefaultLocale: false`, de modo que el español conserve sus URLs actuales y el inglés viva en `/en/…` con `hreflang` recíprocos. No crear rutas `/es/` ahora.
- **Blog**: todavía no. No crees `rss.xml`, la colección `blog` ni enlaces al blog. Las secciones de este documento sobre blog, RSS y `BlogPosting` aplican cuando se active.
- **Contenido**: la trayectoria vive en `src/data/profile.ts` (sacada del CV de Gabo) y los proyectos en `src/data/projects.ts` (descritos a partir de sus repos y sitios publicados). No inventes logros, métricas, clientes ni proyectos: pregunta. Cuando un proyecto tenga página propia (`/proyectos/<id>/`, rutas en español), pásalo a una Content Collection `projects`.
- **Objetivo del sitio**: Gabo busca clientes freelance y/o empleo. Los textos deben servir a ambos públicos: empresas que contratan (experiencia bancaria, stack) y negocios que necesitan una web (rapidez, SEO, ejemplos como Deleic).
- **Implementado**: `components/seo/SEO.astro` (vía `Layout`), `lib/schema.ts` (Person + WebSite + nodos por página), `pages/robots.txt.ts`, `pages/llms.txt.ts`, `pages/og.png.ts`, `pages/404.astro` y `@astrojs/sitemap` (excluye `/styleguide`).
- **Imágenes OG con Satori**: la raíz necesita `boxSizing: 'border-box'` (si no, el padding se suma a la altura y el contenido se sale) y los `lineHeight` van en px (`'48px'`), no sin unidad. Después de cambiar una, ábrela (`dist/og.png`) para revisarla visualmente.

## 1. Fuente única de verdad: `src/config/site.ts`

Nombre, rol, descripción, URL, idioma y redes viven solo aquí. El SEO, el JSON-LD, el footer y `llms.txt` lo importan. La consistencia de la entidad (mismo nombre, mismo rol, mismos enlaces en todas partes) es lo que permite a Google y a los LLM conectar "Gabriel Reyes" con su GitHub, LinkedIn y su trabajo.

```ts
export const SITE = {
  url: 'https://<dominio>',          // también en astro.config `site`
  name: 'Gabriel Reyes',
  alternateName: 'Gabo Reyes',
  jobTitle: 'Desarrollador de software',
  description: '<1 frase factual: qué haces, con qué, para quién>',
  locale: 'es',
  email: '<público>',
  socials: { github: '', linkedin: '', x: '' }, // URLs completas → `sameAs`
} as const;
```

`astro.config.mjs` debe tener `site: SITE.url` (sin él no hay URLs canónicas ni sitemap) y un `trailingSlash` explícito para no duplicar URLs.

## 2. Componente `<SEO />` (en `src/components/seo/SEO.astro`)

Todas las páginas lo usan a través del layout. Props: `title`, `description`, `image?`, `type?: 'website' | 'article' | 'profile'`, `publishedTime?`, `modifiedTime?`, `noindex?`, `jsonLd?`.

Debe generar:
- `<title>` con plantilla `"{title} — Gabriel Reyes"` (la home usa solo el nombre + rol). **≤ 60 caracteres, único por página.**
- `<meta name="description">`: **120–160 caracteres, única**, escrita para humanos y no como relleno de keywords.
- `<link rel="canonical">` absoluto, construido con `new URL(Astro.url.pathname, Astro.site)`.
- Open Graph (`og:title`, `og:description`, `og:image` 1200×630 absoluta, `og:url`, `og:type`, `og:locale`) y `twitter:card=summary_large_image`.
- `hreflang` alternos si el sitio es multi-idioma.
- `<link rel="sitemap">`, `<link rel="alternate" type="application/rss+xml">`.
- JSON-LD (ver abajo).

## 3. Datos estructurados (JSON-LD)

Plantillas listas en [references/jsonld.md](references/jsonld.md). Usa `schema-dts` para tiparlas.

- **Todas las páginas**: `WebSite` + `Person` (con `@id` estable `${SITE.url}/#person`, `sameAs`, `jobTitle`, `knowsAbout`).
- **Home/about**: `ProfilePage` con `mainEntity` → la `Person`.
- **Artículo**: `BlogPosting` con `author` → `@id` de la persona, `datePublished`, `dateModified`.
- **Proyecto**: `CreativeWork` o `SoftwareSourceCode` (si tiene repo) con `author`, `codeRepository`, `programmingLanguage`.
- **Páginas internas**: `BreadcrumbList`.

## 4. Archivos para buscadores e IA

Plantillas de endpoints en [references/ai-files.md](references/ai-files.md).

- `@astrojs/sitemap` → `sitemap-index.xml`. Excluye borradores y páginas `noindex`.
- `src/pages/robots.txt.ts`: permite todo y **permite explícitamente los bots de IA** (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended…). Apunta al sitemap.
- `src/pages/llms.txt.ts` y `llms-full.txt.ts`: resumen tuyo en markdown con enlaces, generado desde `site.ts` y las colecciones para que nunca quede desactualizado.
- `@astrojs/rss` → `/rss.xml` del blog.
- Imagen OG por página generada en build (`satori` + `@resvg/resvg-js`) en `src/pages/og/[...slug].png.ts`, con la misma estética del sitio.

## 5. Contenido (Content Collections)

Proyectos y blog en `src/content/{projects,blog}` como MDX, definidos en `src/content.config.ts` con `glob()` y schema Zod. Campos mínimos: `title`, `description` (reusada como meta description), `pubDate`, `updatedDate?`, `tags`, `draft`, `cover?` (con `image()`). Los proyectos agregan `role`, `stack`, `repo?`, `url?`, `featured`. El schema es el contrato: si falta `description`, el build falla, y eso está bien.

## 6. Escribir para ser citado (GEO)

Los LLM citan frases **claras, factuales y autocontenidas**. Al redactar cualquier texto del sitio:

- **Primero la respuesta.** El primer párrafo de cada página responde a "¿qué es esto?" en 1–2 frases. En la home: *"Gabriel Reyes es desarrollador de software especializado en X. Construye Y para Z."*
- **Datos concretos** en vez de adjetivos: "redujo el tiempo de carga de 4.1 s a 1.2 s", no "mejoró mucho el rendimiento". Nombres reales de tecnologías, empresas, años.
- **Encabezados que son preguntas o afirmaciones descriptivas** ("Cómo migré 40k usuarios a Postgres"), no "Introducción" ni "Más info".
- **Casos de proyecto** con estructura fija: problema → mi rol → stack → decisiones clave → resultado medible → enlaces.
- Autor visible + fecha de publicación y actualización en cada artículo.
- Una idea por párrafo; listas y tablas cuando haya comparaciones (los LLM las extraen bien).
- Nada de texto importante solo en imágenes, canvas o animaciones: si las partículas dicen "Gabriel Reyes", el `<h1>` real también lo dice.

## 7. Reglas técnicas

- Un `<h1>` por página; jerarquía sin saltos (h2 → h3).
- `<html lang>` correcto. Si hay i18n, rutas `/es/` y `/en/` con la i18n de Astro y `hreflang` recíprocos.
- Enlaces con texto descriptivo (nunca "click aquí"). Enlaza internamente entre proyectos, blog y about.
- `alt` en todas las imágenes de contenido; `alt=""` solo en las decorativas.
- Página `404.astro` útil, con `noindex`.
- Las páginas de borrador (`draft: true`) no se generan en producción.

## Al terminar una página

Ejecuta la skill `ship-check` (o al menos su script de auditoría) para verificar título, descripción, canonical, h1, OG y JSON-LD en el HTML generado.
