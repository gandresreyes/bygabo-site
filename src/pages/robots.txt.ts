import type { APIRoute } from 'astro';

// Bots de búsqueda y de IA permitidos explícitamente. Revisar cada pocos meses:
// aparecen agentes nuevos y algunos cambian de nombre.
const AI_BOTS = {
  openai: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'],
  anthropic: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'],
  perplexity: ['PerplexityBot', 'Perplexity-User'],
  google: ['Google-Extended'], // Gemini / AI Overviews
  apple: ['Applebot-Extended'], // Apple Intelligence
  microsoft: ['Bingbot'], // alimenta ChatGPT Search y Copilot
  others: ['meta-externalagent', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'CCBot'],
};

const rules = ['Allow: /', 'Disallow: /styleguide'];

export const GET: APIRoute = ({ site }) => {
  const body = [
    'User-agent: *',
    ...rules,
    '',
    ...Object.values(AI_BOTS)
      .flat()
      .flatMap((ua) => [`User-agent: ${ua}`, ...rules, '']),
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
