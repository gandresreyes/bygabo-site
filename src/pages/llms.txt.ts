import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { CAREER_START, education, experience, skills } from '../data/profile';
import { projects } from '../data/projects';
import { formatMonth, yearsSince } from '../lib/format';

// Resumen en markdown para asistentes de IA (formato https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const years = yearsSince(CAREER_START);
  const period = (start: string, end?: string) => `${formatMonth(start)} – ${end ? formatMonth(end) : 'actualidad'}`;
  const links = [
    `- [Sitio web](${abs('/')}): perfil, experiencia y contacto`,
    ...Object.entries(SITE.socials)
      .filter(([, url]) => url)
      .map(([name, url]) => `- [${name === 'linkedin' ? 'LinkedIn' : 'GitHub'}](${url})`),
  ];

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} (${SITE.fullName}) es ${SITE.jobTitle.toLowerCase()} con más de ${years} años de experiencia, especializado en aplicaciones web para el sector bancario y fintech. Vive en ${SITE.location.city}, ${SITE.location.country}. Estudió ${education.degree} en la ${education.school} (${education.year}).

${SITE.availability ? `Estado: ${SITE.availability.toLowerCase()}.\n\n` : ''}## Proyectos

${projects
  .map(
    (p) =>
      `### [${p.name}](${p.url})\n${p.kind}\n\n${p.summary}\n\n${p.highlights.map((h) => `- ${h}`).join('\n')}\n\nStack: ${p.stack.join(', ')}${p.repo ? `\nCódigo: ${p.repo}` : ''}`,
  )
  .join('\n\n')}

## Experiencia

${experience
  .map(
    (job) =>
      `### ${job.role} · ${job.company}\n${period(job.start, job.end)} · ${job.location}\n\n${job.summary}\n\n${job.highlights.map((h) => `- ${h}`).join('\n')}`,
  )
  .join('\n\n')}

## Habilidades

${skills.map(({ group, items }) => `- **${group}**: ${items.join(', ')}`).join('\n')}

## Enlaces

${links.join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
