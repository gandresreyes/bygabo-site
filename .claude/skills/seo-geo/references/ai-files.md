# robots.txt y llms.txt como endpoints de Astro

Generarlos desde código (no como archivos estáticos en `public/`) garantiza que usen la URL real del sitio y el contenido actual de las colecciones.

## `src/pages/robots.txt.ts`

```ts
import type { APIRoute } from 'astro';

// Bots de búsqueda y de IA que queremos explícitamente. Revisa la lista cada pocos meses:
// aparecen agentes nuevos y algunos cambian de nombre.
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',        // OpenAI
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',   // Anthropic
  'PerplexityBot', 'Perplexity-User',               // Perplexity
  'Google-Extended',                                // Gemini / AI Overviews
  'Applebot-Extended',                              // Apple Intelligence
  'Bingbot',                                        // Bing (alimenta ChatGPT Search y Copilot)
  'meta-externalagent', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_BOTS.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', '']),
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

## `src/pages/llms.txt.ts`

Formato de https://llmstxt.org: H1 con el nombre, cita con el resumen, secciones con listas de enlaces `[título](url): descripción`.

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const projects = (await getCollection('projects', (p) => !p.data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const posts = (await getCollection('blog', (p) => !p.data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} es ${SITE.jobTitle.toLowerCase()}. Contacto: ${SITE.email}.

## Sobre mí
- [About](${abs('/about/')}): trayectoria, stack y forma de trabajar

## Proyectos
${projects.map((p) => `- [${p.data.title}](${abs(`/projects/${p.id}/`)}): ${p.data.description}`).join('\n')}

## Blog
${posts.map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.description}`).join('\n')}

## Enlaces
${Object.entries(SITE.socials).filter(([, url]) => url).map(([name, url]) => `- [${name}](${url})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

`llms-full.txt.ts` sigue el mismo patrón pero incluye el cuerpo completo (`entry.body`) de cada proyecto y artículo.

Opcional y muy útil para GEO: exponer cada artículo también como markdown (`src/pages/blog/[id].md.ts` que devuelve `entry.body`), porque a los agentes les resulta más barato y fiable leer markdown que HTML.
