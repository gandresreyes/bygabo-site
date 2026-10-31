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
      'El negocio publica sus promociones desde su WordPress y aparecen solas en la web.',
      'Preparada para aparecer en Google y en asistentes de IA cuando alguien busca en León.',
      'Carga casi instantánea y sin servidor que mantener.',
    ],
    stack: ['Astro', 'Tailwind CSS', 'WordPress'],
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
      'Repaso inteligente: las preguntas que más cuestan aparecen más a menudo.',
      'Simulacros de examen, práctica por temas, sesión diaria y estadísticas de progreso.',
      'Se instala en el móvil como una app y guarda una copia del progreso.',
    ],
    stack: ['Angular', 'TypeScript', 'Tailwind CSS'],
    url: 'https://cap-beryl-delta.vercel.app',
    repo: 'https://github.com/gandresreyes/CAP',
    schemaType: 'SoftwareApplication',
  },
];
