// Qué ofrece Gabo a negocios y cómo trabaja. La home, el JSON-LD (Service, FAQPage) y llms.txt leen de aquí.
// Los textos responden a lo que la gente escribe al buscar: "quiero hacer mi página web", "actualizar mi web"…

export interface Service {
  id: string;
  name: string;
  /** Frase citable: qué problema resuelve y para quién. */
  summary: string;
  /** Beneficio en una frase, para móvil (donde la tarjeta muestra esto + 2 viñetas). */
  benefit: string;
  highlights: string[];
  /** Precio orientativo "desde", p. ej. '900 €'. Vacío = no se muestra (nunca inventar cifras). */
  priceFrom?: string;
}

export const services: Service[] = [
  {
    id: 'pagina-web-nueva',
    name: 'Página web nueva para tu negocio',
    summary:
      '¿Quieres hacer tu sitio web y no sabes por dónde empezar? Diseño y desarrollo tu página web desde cero, a medida y lista para que tus clientes te contacten.',
    benefit: 'Una web a medida que convierte visitas en clientes.',
    priceFrom: '',
    highlights: [
      'Diseño propio, sin plantillas genéricas, adaptado a móvil.',
      'Sin plugins ni suscripciones: la web y su código son tuyos.',
      'Contacto directo: WhatsApp, formulario o reservas.',
      'Carga rápida, también en el móvil.',
    ],
  },
  {
    id: 'aplicaciones-web-a-medida',
    name: 'Aplicaciones a medida',
    summary:
      '¿Necesitas reservas online, un área privada para tus clientes o una herramienta para organizar tu negocio? Desarrollo aplicaciones web a medida, pensadas para cómo trabajas tú.',
    benefit: 'Herramientas a medida para tu negocio, seguras y fáciles de usar.',
    priceFrom: '',
    highlights: [
      'Acceso seguro para tus clientes y tu equipo.',
      'Conectada con las herramientas que ya usas.',
      'Preparada para crecer contigo, sin rehacerla en un año.',
    ],
  },
  {
    id: 'renovar-pagina-web',
    name: 'Renovar o actualizar tu web',
    summary:
      'Si tu web está lenta, se ve anticuada o no aparece en Google, la rediseño o la migro a tecnología moderna sin perder el posicionamiento que ya tienes.',
    benefit: 'Tu web más rápida y moderna, sin perder lo que ya tienes en Google.',
    priceFrom: '',
    highlights: [
      'Revisión de lo que funciona y lo que no antes de tocar nada.',
      'Sin perder lo que ya has ganado en Google.',
      'Si ya usas WordPress, puedes seguir editando tus contenidos ahí.',
    ],
  },
  {
    id: 'seo-y-visibilidad-en-ia',
    name: 'SEO y visibilidad en IA',
    summary:
      'Que te encuentren en Google y que asistentes como ChatGPT, Claude, Perplexity o Gemini te recomienden cuando alguien pregunta por lo que haces.',
    benefit: 'Que Google y la IA te recomienden cuando buscan lo que haces.',
    priceFrom: '',
    highlights: [
      'Posicionamiento en Google, también en tu ciudad.',
      'Tu web preparada para que Google y la IA entiendan tu negocio.',
      'Textos claros que convencen a tus clientes.',
    ],
  },
];

/** `id: 'precio'` marca la pregunta de precios: si algún servicio tiene `priceFrom`, se añaden a su respuesta. */
export const faqs: { id?: string; question: string; answer: string }[] = [
  {
    id: 'precio',
    question: '¿Cuánto cuesta hacer una página web?',
    answer:
      'Depende de cuántas páginas, funciones e integraciones necesites. Después de una primera conversación te envío un presupuesto detallado y por escrito, para que sepas exactamente qué incluye antes de empezar.',
  },
  {
    question: '¿Cuánto se tarda en tener lista mi web?',
    answer:
      'Depende del alcance del proyecto. El plazo queda fijado en la propuesta junto con las entregas intermedias, para que veas avances desde el principio y no solo el resultado final.',
  },
  {
    question: '¿Puedes actualizar mi web actual sin empezar de cero?',
    answer:
      'Sí. Primero reviso tu web actual (velocidad, diseño, SEO y contenido) y te digo si conviene mejorarla o rehacerla. Si se rehace, conservo tus URLs o las redirijo para no perder el posicionamiento en Google.',
  },
  {
    question: '¿También desarrollas aplicaciones a medida?',
    answer:
      'Sí. Además de páginas web, desarrollo aplicaciones a medida: reservas online, áreas privadas para clientes, paneles de gestión o herramientas internas. Primero entiendo cómo trabaja tu negocio, para que la aplicación se adapte a ti y no al revés.',
  },
  {
    question: '¿Mi web aparecerá en Google y en ChatGPT?',
    answer:
      'Nadie puede garantizar el primer puesto, pero sí construir la web para que buscadores y asistentes de IA la entiendan: buen posicionamiento técnico y local, una estructura clara y textos que explican bien lo que haces. Es lo que hice en la web de Deleic, un centro de estética en León.',
  },
  {
    question: '¿La web será mía? ¿Tendré que pagar cuotas mensuales?',
    answer:
      'La web es tuya: te entrego el código y los accesos, sin suscripciones ni cuotas mensuales conmigo. La programo a medida, sin montarla sobre WordPress, Wix ni plugins de terceros que hay que actualizar o pagar cada año. Lo único que se paga aparte es el dominio y el alojamiento, siempre a tu nombre.',
  },
  {
    question: '¿Podré cambiar los textos y las promociones yo mismo?',
    answer:
      'Sí. Si vas a cambiarlos a menudo, conecto tu web a un panel sencillo (por ejemplo, WordPress) solo para editar textos o promociones, sin que el resto de la web dependa de él ni de plugins. Así lo hice en Deleic, donde las promociones se publican desde su WordPress.',
  },
  {
    question: '¿Trabajas solo con negocios de León?',
    answer:
      'No. Trabajo desde León con negocios de toda España en remoto: nos comunicamos por videollamada, email o mensajería, y tú ves los avances de tu web en un enlace de prueba.',
  },
];

/** Cómo trabaja Gabo, paso a paso. Coherente con las respuestas de `faqs`: no prometer nada que no esté allí. */
export const processSteps: { title: string; description: string }[] = [
  {
    title: 'Conversamos',
    description: 'Me cuentas tu negocio, tus clientes y qué necesitas. Primera conversación sin compromiso.',
  },
  {
    title: 'Propuesta por escrito',
    description:
      'Te envío un presupuesto detallado con alcance, plazos y entregas, para que sepas qué incluye antes de empezar.',
  },
  {
    title: 'Diseño y desarrollo',
    description: 'Construyo tu web y ves los avances en un enlace de prueba desde el principio, no solo al final.',
  },
  {
    title: 'Lanzamiento',
    description: 'Publico la web, la preparo para Google y la IA y te entrego el código y los accesos: todo queda a tu nombre.',
  },
];

/** Precios orientativos publicados ("Página web nueva: desde 900 €"). Vacío si Gabo aún no los ha definido. */
export const priceList = services
  .filter((service) => service.priceFrom)
  .map((service) => ({ name: service.name, priceFrom: service.priceFrom! }));

/** Respuesta completa de una pregunta frecuente (la de precios incluye la lista si existe). */
export const faqAnswer = (faq: (typeof faqs)[number]) =>
  faq.id === 'precio' && priceList.length > 0
    ? `${faq.answer} Como referencia: ${priceList.map((p) => `${p.name}, desde ${p.priceFrom}`).join('; ')}.`
    : faq.answer;
