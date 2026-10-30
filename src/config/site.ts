// Fuente única de verdad del sitio: SEO, JSON-LD, footer y llms.txt importan de aquí.
// TODO(gabo): email público (p. ej. hola@bygabo.dev cuando el dominio esté listo) y foto.
export const SITE = {
  url: 'https://bygabo.dev',
  name: 'Gabriel Reyes',
  fullName: 'Gabriel Andrés Reyes Pinzón',
  alternateName: 'Gabo Reyes',
  jobTitle: 'Desarrollador Fullstack',
  description:
    'Gabriel Reyes, desarrollador fullstack con más de 7 años creando software para banca y fintech con Angular, Node.js y .NET. Basado en León, España.',
  location: { city: 'León', country: 'España', countryCode: 'ES' },
  locale: 'es',
  ogLocale: 'es_ES',
  email: '',
  /** Se muestra como etiqueta en el hero y el contacto. Vacío = no se muestra. */
  availability: 'Disponible para proyectos y empleo',
  socials: {
    linkedin: 'https://www.linkedin.com/in/gabriel-reyes-b7753595',
    github: 'https://github.com/gandresreyes',
  },
} as const;
