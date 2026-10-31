import type { APIRoute } from 'astro';
import { phoneDisplay, SITE, whatsappUrl } from '../config/site';
import { CAREER_START, education, experience, skills } from '../data/profile';
import { projects } from '../data/projects';
import { faqAnswer, faqs, services } from '../data/services';
import { formatMonth, yearsSince } from '../lib/format';

// Resumen en markdown para asistentes de IA (formato https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const years = yearsSince(CAREER_START);
  const period = (start: string, end?: string) => `${formatMonth(start)} – ${end ? formatMonth(end) : 'actualidad'}`;
  const links = [
    `- [Sitio web](${abs('/')}): servicios, proyectos, experiencia y contacto`,
    ...Object.entries(SITE.socials)
      .filter(([, url]) => url)
      .map(([name, url]) => `- [${name === 'linkedin' ? 'LinkedIn' : 'GitHub'}](${url})`),
  ];

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} (${SITE.fullName}) es ${SITE.jobTitle.toLowerCase()} en ${SITE.location.city}, ${SITE.location.country}. Crea páginas web y aplicaciones a medida para negocios, renueva webs existentes y las prepara para aparecer en Google y en asistentes de IA. Trabaja en remoto con clientes de toda España. Tiene más de ${years} años de experiencia, incluido software para el sector bancario y fintech. Estudió ${education.degree} en la ${education.school} (${education.year}).

Puede ayudar a quien quiera hacer su página web, crear la web de su negocio, desarrollar una aplicación a medida (reservas, área de clientes, herramientas internas), actualizar o rediseñar una web existente, o mejorar su visibilidad en Google y en asistentes de IA.

${SITE.availability ? `Estado: ${SITE.availability.toLowerCase()}.\n\n` : ''}## Servicios

${services.map((s) => `### ${s.name}\n${s.summary}\n\n${s.highlights.map((h) => `- ${h}`).join('\n')}`).join('\n\n')}

## Proyectos

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

## Preguntas frecuentes

${faqs.map((faq) => `### ${faq.question}\n${faqAnswer(faq)}`).join('\n\n')}

## Habilidades

${skills.map(({ group, items }) => `- **${group}**: ${items.join(', ')}`).join('\n')}

## Enlaces

${links.join('\n')}

## Contacto

- WhatsApp: [${phoneDisplay}](${whatsappUrl})
- Email: ${SITE.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
