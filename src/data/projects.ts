// Proyectos destacados (fuente: los repos y sitios publicados de Gabo).
// Cuando tengan página propia con caso de estudio, pasarán a una Content Collection.

export interface Project {
  id: string;
  name: string;
  /** Qué es, en una línea: aparece como eyebrow. */
  kind: string;
  /** Primera frase citable: qué es y para quién. */
  summary: string;
  highlights: string[];
  stack: string[];
  url: string;
  repo?: string;
  /** Tipo schema.org para JSON-LD. */
  schemaType: 'WebSite' | 'SoftwareApplication';
}

export const projects: Project[] = [
  {
    id: 'deleic',
    name: 'Deleic',
    kind: 'Web para cliente · Medicina estética',
    summary:
      'Web del centro de medicina estética y depilación láser Deleic, en León: tratamientos, precios por zona y reservas por WhatsApp.',
    highlights: [
      'Promociones sincronizadas con el WordPress del cliente vía API REST, en el build y en el navegador.',
      'SEO local con datos estructurados, sitemap y llms.txt para buscadores e IA.',
      'Sitio estático con Astro: rápido, sin dependencias de servidor.',
    ],
    stack: ['Astro', 'Tailwind CSS', 'TypeScript', 'WordPress API'],
    url: 'https://deleic.vercel.app',
    repo: 'https://github.com/gandresreyes/Deleic',
    schemaType: 'WebSite',
  },
  {
    id: 'cap-estudio',
    name: 'CAP Estudio',
    kind: 'Aplicación propia · Educación',
    summary:
      'Aplicación para preparar el examen CAP de Mercancías con preguntas de exámenes oficiales de Castilla y León.',
    highlights: [
      'Repaso espaciado con sistema Leitner de 5 cajas: lo que cuesta se repasa más.',
      'Simulacros de examen, práctica por temas, sesión diaria y estadísticas de progreso.',
      'PWA instalable con service worker y copia de seguridad del progreso.',
    ],
    stack: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'PWA', 'Vitest'],
    url: 'https://cap-beryl-delta.vercel.app',
    repo: 'https://github.com/gandresreyes/CAP',
    schemaType: 'SoftwareApplication',
  },
];
