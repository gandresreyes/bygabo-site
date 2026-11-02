// Proyectos destacados (fuente: los repos y sitios publicados de Gabo).
// Cuando tengan página propia con caso de estudio, pasarán a una Content Collection.
// Capturas: src/assets/projects/<id>-desktop.(png|jpg|webp) y <id>-mobile.(…). Si no existen, no se muestran.
// Lo visible es para clientes (resultados); `stack` y `repo` solo van en llms.txt y JSON-LD.

export interface Project {
  id: string;
  name: string;
  /** Qué es, en una línea: aparece como eyebrow. */
  kind: string;
  /** Primera frase citable: qué es y para quién. */
  summary: string;
  highlights: string[];
  /** Etiquetas de resultado para el cliente (visibles), sin jerga técnica. */
  outcomes: string[];
  /** Tecnologías: solo para llms.txt y JSON-LD. */
  stack: string[];
  /** Proyecto protagonista de la sección (los demás se muestran en segundo plano). */
  featured?: boolean;
  /** Texto alternativo de las capturas. */
  screenshotAlt: { desktop: string; mobile: string };
  url: string;
  repo?: string;
  /** Opinión real del cliente, con su permiso. Sin ella el bloque no se muestra (nunca inventarla). */
  testimonial?: { quote: string; author: string; role: string };
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
    outcomes: ['Reservas por WhatsApp', 'Promociones editables', 'SEO local'],
    stack: ['Astro', 'Tailwind CSS', 'WordPress'],
    featured: true,
    screenshotAlt: {
      desktop:
        'Portada de la web de Deleic en ordenador: "Centro de Medicina Estética y Depilación Láser en León" con el botón Reservar por WhatsApp.',
      mobile: 'La web de Deleic en un móvil, con el botón Reservar por WhatsApp a la vista.',
    },
    url: 'https://deleic.vercel.app',
    repo: 'https://github.com/gandresreyes/Deleic',
    schemaType: 'WebSite',
  },
  {
    id: 'cap-estudio',
    name: 'CAP Estudio',
    kind: 'Producto propio · Educación',
    summary:
      'Aplicación para preparar el examen CAP de Mercancías con preguntas de exámenes oficiales de Castilla y León.',
    highlights: [
      'Repaso inteligente: las preguntas que más cuestan aparecen más a menudo.',
      'Simulacros de examen, práctica por temas, sesión diaria y estadísticas de progreso.',
      'Se instala en el móvil como una app y guarda una copia del progreso.',
    ],
    outcomes: ['Se instala en el móvil', 'Repaso inteligente', 'Simulacros de examen'],
    stack: ['Angular', 'TypeScript', 'Tailwind CSS'],
    screenshotAlt: {
      desktop: 'Pantalla de inicio de CAP Estudio en ordenador.',
      mobile: 'CAP Estudio en un móvil: repaso diario, racha, simulacro de examen y temas más flojos.',
    },
    url: 'https://cap-beryl-delta.vercel.app',
    repo: 'https://github.com/gandresreyes/CAP',
    schemaType: 'SoftwareApplication',
  },
];
