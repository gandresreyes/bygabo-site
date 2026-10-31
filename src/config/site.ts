// Fuente única de verdad del sitio: SEO, JSON-LD, footer y llms.txt importan de aquí.
// TODO(gabo): cambiar email y WhatsApp por unos profesionales (p. ej. hola@bygabo.dev) y añadir foto.
export const SITE = {
  // Dominio principal tal como está en Vercel (bygabo.dev redirige con 308 a www). Si se cambia el
  // principal en Vercel, cambia también esta URL: canonical, sitemap y JSON-LD salen de aquí.
  url: 'https://www.bygabo.dev',
  name: 'Gabriel Reyes',
  fullName: 'Gabriel Andrés Reyes Pinzón',
  alternateName: 'Gabo Reyes',
  jobTitle: 'Desarrollador de páginas web y aplicaciones a medida',
  /** Título de la home (≤ 60 caracteres): primero lo que la gente busca, luego el nombre. */
  title: 'Páginas web y aplicaciones a medida en León — Gabriel Reyes',
  description:
    'Creo páginas web y aplicaciones a medida para negocios: rápidas, fáciles de usar y listas para aparecer en Google y en la IA. Desde León, para toda España.',
  /** Frase corta para la imagen OG y el resumen de llms.txt. */
  tagline: 'Páginas web y aplicaciones a medida, rápidas y fáciles de encontrar en Google y en la IA.',
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
  /** Compromiso de respuesta junto al botón de WhatsApp. Vacío = no se muestra. */
  responseTime: 'Respondo en menos de 24 h laborables',
  /**
   * Oferta de entrada para quien ya tiene web: aparece en el hero y en Contacto con su propio mensaje
   * de WhatsApp. Deja `label` vacío para quitarla.
   */
  freeReview: {
    label: 'Te reviso tu web gratis y te digo qué mejorar',
    message: 'Hola Gabo, me gustaría que revisaras mi web gratis. Esta es la dirección: ',
  },
  /** Foto para "Sobre mí": nombre de archivo dentro de src/assets/ (p. ej. 'gabo.jpg'). Vacío = no se muestra. */
  photo: '',
  socials: {
    linkedin: 'https://www.linkedin.com/in/gabriel-reyes-b7753595',
    github: 'https://github.com/gandresreyes',
  },
  /** Enlace a la ficha de Google Business Profile cuando exista (se añade a `sameAs`). */
  googleBusiness: '',
  /** Códigos de verificación (solo el valor de `content`): Search Console y Bing Webmaster Tools. */
  verification: { google: '', bing: '' },
} as const;

/** Enlace a WhatsApp con un mensaje ya escrito. */
export const whatsappLink = (message: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
export const whatsappUrl = whatsappLink(SITE.whatsappMessage);
export const freeReviewUrl = whatsappLink(SITE.freeReview.message);
/** Teléfono legible: +34 686 322 613. */
export const phoneDisplay = `+${SITE.whatsapp.slice(0, 2)} ${SITE.whatsapp.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ')}`;
