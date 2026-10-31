// Qué ofrece Gabo a negocios y cómo trabaja. La home, el JSON-LD (Service, FAQPage) y llms.txt leen de aquí.
// Los textos responden a lo que la gente escribe al buscar: "quiero hacer mi página web", "actualizar mi web"…

export interface Service {
  id: string;
  name: string;
  /** Frase citable: qué problema resuelve y para quién. */
  summary: string;
  highlights: string[];
}

export const services: Service[] = [
  {
    id: 'pagina-web-nueva',
    name: 'Página web nueva para tu negocio',
    summary:
      '¿Quieres hacer tu sitio web y no sabes por dónde empezar? Diseño y desarrollo tu página web desde cero, a medida y lista para que tus clientes te contacten.',
    highlights: [
      'Diseño propio, sin plantillas genéricas, adaptado a móvil.',
      'Contacto directo: WhatsApp, formulario o reservas.',
      'Carga rápida, también en el móvil.',
    ],
  },
  {
    id: 'aplicaciones-web-a-medida',
    name: 'Aplicaciones a medida',
    summary:
      '¿Necesitas reservas online, un área privada para tus clientes o una herramienta para organizar tu negocio? Desarrollo aplicaciones web a medida, pensadas para cómo trabajas tú.',
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
    highlights: [
      'Posicionamiento en Google, también en tu ciudad.',
      'Tu web preparada para que Google y la IA entiendan tu negocio.',
      'Textos claros que convencen a tus clientes.',
    ],
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
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
    question: '¿Podré cambiar los textos y las promociones yo mismo?',
    answer:
      'Sí. La web puede conectarse a un gestor de contenidos como WordPress para que edites textos o promociones sin tocar código, como en Deleic, donde las promociones se publican desde su WordPress.',
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
    description: 'Publico la web, la preparo para Google y la IA, y te enseño a editar tus contenidos si lo necesitas.',
  },
];
