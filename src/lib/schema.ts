import type { Graph, Person, Thing, WebSite } from 'schema-dts';
import { SITE } from '../config/site';
import { education, knowsAbout } from '../data/profile';
import { projects } from '../data/projects';
import { faqs, services } from '../data/services';

export const personId = `${SITE.url}/#person`;
export const websiteId = `${SITE.url}/#website`;
export const webpageId = `${SITE.url}/#webpage`;
const serviceId = (id: string) => `${SITE.url}/#${id}`;

const areaServed = [
  { '@type': 'City', name: SITE.location.city },
  { '@type': 'Country', name: SITE.location.country },
] as const;

const person: Person = {
  '@type': 'Person',
  '@id': personId,
  name: SITE.name,
  alternateName: [SITE.fullName, SITE.alternateName],
  jobTitle: SITE.jobTitle,
  description: SITE.description,
  url: SITE.url,
  ...(SITE.email ? { email: `mailto:${SITE.email}` } : {}),
  ...(SITE.whatsapp ? { telephone: `+${SITE.whatsapp}` } : {}),
  sameAs: Object.values(SITE.socials).filter(Boolean),
  knowsAbout,
  makesOffer: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@id': serviceId(s.id) } })),
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.location.city,
    addressCountry: SITE.location.countryCode,
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
};

const website: WebSite = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: SITE.url,
  name: SITE.name,
  inLanguage: SITE.locale,
  publisher: { '@id': personId },
};

/** Grafo base (Person + WebSite) más los nodos propios de la página. */
export function buildGraph(nodes: Thing[] = []): Graph {
  return { '@context': 'https://schema.org', '@graph': [person, website, ...nodes] };
}

/** Un nodo por servicio, ofrecido por Gabo en León y en toda España. */
export function serviceNodes(): Thing[] {
  return services.map((s) => ({
    '@type': 'Service',
    '@id': serviceId(s.id),
    name: s.name,
    serviceType: s.name,
    description: s.summary,
    url: serviceId(s.id),
    provider: { '@id': personId },
    areaServed,
    availableLanguage: 'es',
  })) as Thing[];
}

/** Preguntas frecuentes de la home, las mismas que se ven en la sección. */
export function faqNode(): Thing {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE.url}/#preguntas`,
    isPartOf: { '@id': webpageId },
    inLanguage: SITE.locale,
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } as Thing;
}

/** Un nodo por proyecto destacado, con Gabo como autor. */
export function projectNodes(): Thing[] {
  return projects.map((p) => ({
    '@type': p.schemaType,
    '@id': `${SITE.url}/#${p.id}`,
    name: p.name,
    description: p.summary,
    url: p.url,
    ...(p.schemaType === 'SoftwareApplication'
      ? { applicationCategory: 'EducationalApplication', operatingSystem: 'Web' }
      : {}),
    author: { '@id': personId },
    keywords: p.stack.join(', '),
  })) as Thing[];
}
