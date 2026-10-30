// Fuente única de verdad del sitio: SEO, JSON-LD, footer y llms.txt importan de aquí.
// TODO(gabo): cambiar email y WhatsApp por unos profesionales (p. ej. hola@bygabo.dev) y añadir foto.
export const SITE = {
  url: 'https://bygabo.dev',
  name: 'Gabriel Reyes',
  fullName: 'Gabriel Andrés Reyes Pinzón',
  alternateName: 'Gabo Reyes',
  jobTitle: 'Desarrollador web fullstack',
  /** Título de la home (≤ 60 caracteres): primero lo que la gente busca, luego el nombre. */
  title: 'Diseño y desarrollo de páginas web en León — Gabriel Reyes',
  description:
    'Creo y renuevo páginas web para negocios: rápidas, a medida y listas para aparecer en Google y en asistentes de IA como ChatGPT. Desde León, para toda España.',
  /** Frase corta para la imagen OG y el resumen de llms.txt. */
  tagline: 'Páginas web rápidas, a medida y fáciles de encontrar en Google y en la IA.',
  location: { city: 'León', country: 'España', countryCode: 'ES' },
  locale: 'es',
  ogLocale: 'es_ES',
  email: '30.gabo.mars@gmail.com',
  /** WhatsApp en formato internacional, solo dígitos (34 = España). */
  whatsapp: '34686322613',
  /** Mensaje con el que se abre el chat de WhatsApp. */
  whatsappMessage: 'Hola Gabo, quiero hacer o renovar mi página web.',
  /** Se muestra como etiqueta en el hero y el contacto. Vacío = no se muestra. */
  availability: 'Aceptando nuevos proyectos',
  socials: {
    linkedin: 'https://www.linkedin.com/in/gabriel-reyes-b7753595',
    github: 'https://github.com/gandresreyes',
  },
} as const;

export const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
/** Teléfono legible: +34 686 322 613. */
export const phoneDisplay = `+${SITE.whatsapp.slice(0, 2)} ${SITE.whatsapp.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ')}`;
