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
      'Carga rápida y buena puntuación en Core Web Vitals.',
    ],
  },
  {
    id: 'renovar-pagina-web',
    name: 'Renovar o actualizar tu web',
    summary:
      'Si tu web está lenta, se ve anticuada o no aparece en Google, la rediseño o la migro a tecnología moderna sin perder el posicionamiento que ya tienes.',
    highlights: [
      'Revisión de lo que funciona y lo que no antes de tocar nada.',
      'Redirecciones para conservar tus URLs y tu posicionamiento.',
      'Puedes seguir editando tus contenidos en WordPress si ya lo usas.',
    ],
  },
  {
    id: 'seo-y-visibilidad-en-ia',
    name: 'SEO y visibilidad en IA',
    summary:
      'Que te encuentren en Google y que asistentes como ChatGPT, Claude, Perplexity o Gemini te recomienden cuando alguien pregunta por lo que haces.',
    highlights: [
      'SEO técnico y SEO local para aparecer en tu ciudad.',
      'Datos estructurados (schema.org), sitemap y llms.txt.',
      'Textos claros que buscadores e IA entienden y citan.',
    ],
  },
  {
    id: 'aplicaciones-web-a-medida',
    name: 'Aplicaciones web a medida',
    summary:
      'Áreas de clientes, paneles de gestión o herramientas internas, construidas con la exigencia de seguridad y fiabilidad del software bancario.',
    highlights: [
      'Inicio de sesión seguro con Keycloak, OAuth2 o JWT.',
      'APIs e integraciones con los sistemas que ya usas.',
      'Pensadas para crecer contigo, no para rehacerse en un año.',
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
    question: '¿Mi web aparecerá en Google y en ChatGPT?',
    answer:
      'Nadie puede garantizar el primer puesto, pero sí construir la web para que buscadores y asistentes de IA la entiendan: SEO técnico y local, datos estructurados, sitemap, llms.txt y textos claros. Es lo que hice en la web de Deleic, un centro de estética en León.',
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
