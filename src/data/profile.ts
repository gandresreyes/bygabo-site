// Trayectoria de Gabo (fuente: su CV). La home, el JSON-LD y llms.txt leen de aquí.

export interface Job {
  role: string;
  company: string;
  /** Formato YYYY-MM */
  start: string;
  /** Formato YYYY-MM; sin valor = actual */
  end?: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

/** Inicio de la carrera profesional (sin contar prácticas), base para "años de experiencia". */
export const CAREER_START = '2019-10';

/**
 * Biografía en tercera persona para JSON-LD (Person.description). La web habla en primera persona
 * ("Soy Gabriel Reyes…") y llms.txt tiene su propia versión en tercera persona.
 */
export const thirdPersonBio = (years: number) =>
  `Gabriel Reyes es desarrollador de páginas web y aplicaciones a medida en León (España), con más de ${years} años de experiencia. Ha creado software para sectores exigentes como la banca y los seguros, y hoy diseña, desarrolla y posiciona webs para negocios de toda España, preparadas para Google y para asistentes de IA.`;

export const experience: Job[] = [
  {
    role: 'Ingeniero de Desarrollo de Software Sr.',
    company: 'Nexa BPO',
    start: '2023-08',
    end: '2026-06',
    location: 'Bogotá, Colombia',
    summary: 'Aplicaciones corporativas para el sector bancario, en proyectos para entidades del Grupo Aval.',
    highlights: [
      'APIs REST con Node.js y servicios backend en C#/.NET integrados en ecosistemas financieros complejos.',
      'Interfaces con Angular, Angular Material y Tailwind CSS, con especial cuidado en UI/UX.',
      'Despliegue y operación de aplicaciones en contenedores Docker con Nginx en entornos productivos bancarios.',
    ],
    stack: ['Angular', 'Tailwind CSS', 'Node.js', 'C# / .NET', 'Docker', 'Nginx'],
  },
  {
    role: 'Desarrollador Jr.',
    company: 'Ike Asistencia',
    start: '2021-10',
    end: '2023-08',
    location: 'Bogotá, Colombia',
    summary: 'Aplicaciones web para asistencia vehicular y seguros.',
    highlights: [
      'Desarrollo y mantenimiento de aplicaciones web con Angular.',
      'Servicios backend en Java y APIs REST consumidas por el frontend.',
      'Integración de APIs externas y gestión de estado reactiva con RxJS.',
      'Sprints ágiles, revisión de código y documentación técnica.',
    ],
    stack: ['Angular', 'RxJS', 'Java', 'APIs REST'],
  },
  {
    role: 'Desarrollador de Software',
    company: 'Tecnología Informática Tecinf',
    start: '2019-10',
    end: '2021-10',
    location: 'Bogotá, Colombia',
    summary: 'Soluciones web a medida para clientes corporativos.',
    highlights: [
      'Aplicaciones end-to-end en PHP según los requerimientos de cada cliente, del análisis al despliegue.',
      'Evolución de proyectos existentes: mejoras de rendimiento y corrección de errores en producción.',
    ],
    stack: ['PHP', 'JavaScript', 'MVC'],
  },
  {
    role: 'Desarrollador en prácticas',
    company: 'Motum Data Dev',
    start: '2016-03',
    end: '2016-12',
    location: 'Bucaramanga, Colombia',
    summary: 'Primera experiencia en un equipo de desarrollo en producción.',
    highlights: ['Soporte en desarrollo y mantenimiento de aplicaciones internas.'],
    stack: [],
  },
];

/** Trayectoria en resumen para la home: etapas, sin detalle técnico. El detalle sigue en `experience`. */
export const journey: { year: string; title: string; description: string }[] = [
  {
    year: '2019',
    title: 'Webs a medida para empresas',
    description:
      'Empecé creando soluciones web para clientes corporativos, de la primera reunión a la puesta en marcha.',
  },
  {
    year: '2021',
    title: 'Aplicaciones para seguros',
    description: 'Aplicaciones web para una empresa de asistencia vehicular y seguros, trabajando en equipos ágiles.',
  },
  {
    year: '2023',
    title: 'Software para la banca',
    description: 'Aplicaciones para grandes entidades bancarias, donde la seguridad y la fiabilidad no se negocian.',
  },
  {
    year: 'Hoy',
    title: 'Webs y aplicaciones para negocios',
    description: 'Desde León, creo páginas web y aplicaciones a medida para negocios de toda España.',
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Frontend',
    items: ['Angular', 'Astro', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Angular Material', 'RxJS'],
  },
  { group: 'Backend', items: ['Node.js', 'Express', 'C# / .NET', 'Java', 'PHP', 'APIs REST'] },
  { group: 'Seguridad y auth', items: ['Keycloak', 'OAuth2', 'JWT', 'Interceptors', 'Guards'] },
  { group: 'Bases de datos', items: ['SQL Server', 'PostgreSQL', 'MongoDB'] },
  { group: 'DevOps y herramientas', items: ['Docker', 'Nginx', 'Git', 'GitHub', 'Postman', 'bun'] },
  {
    group: 'IA aplicada',
    items: ['Claude Code', 'GitHub Copilot', 'Agentes y reglas (AGENTS.md)', 'Prompt engineering', 'SEO para IA (GEO)'],
  },
  { group: 'Forma de trabajo', items: ['Scrum', 'Clean Code', 'Code review', 'Documentación técnica'] },
];

export const education = {
  degree: 'Ingeniería en Telecomunicaciones',
  school: 'Universidad de Pamplona',
  location: 'Cúcuta, Colombia',
  year: 2019,
};

/** Temas para `knowsAbout` en JSON-LD. */
export const knowsAbout = [
  'Diseño web',
  'Desarrollo de páginas web',
  'Aplicaciones web a medida',
  'Rediseño web',
  'SEO técnico',
  'SEO local',
  'Desarrollo fullstack',
  'Angular',
  'Astro',
  'TypeScript',
  'Node.js',
  'C# / .NET',
  'APIs REST',
  'Docker',
  'Desarrollo asistido por IA',
  'Claude Code',
  'SEO para IA',
  'Software bancario',
  'Fintech',
];
