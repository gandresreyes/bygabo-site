import type { Graph, Person, Thing, WebSite } from 'schema-dts';
import { SITE } from '../config/site';
import { CAREER_START, education, knowsAbout, thirdPersonBio } from '../data/profile';
import { yearsSince } from './format';
import { projects } from '../data/projects';
import { faqAnswer, faqs, priceList, services, type Service } from '../data/services';

export const personId = `${SITE.url}/#person`;
export const websiteId = `${SITE.url}/#website`;
export const webpageId = `${SITE.url}/#webpage`;
const serviceId = (id: string) => `${SITE.url}/#${id}`;

/** '900 €' → 900. Sin número válido, undefined (el nodo se publica sin precio). */
const priceValue = (price = '') => {
  const value = Number(price.replace(/[^\d]/g, ''));
  return value > 0 ? value : undefined;
};

/** Oferta del servicio, con precio "desde" solo si Gabo lo ha publicado. */
const offerFor = (s: Service) => {
  const minPrice = priceValue(s.priceFrom);
  return {
    '@type': 'Offer' as const,
    itemOffered: { '@id': serviceId(s.id) },
    ...(minPrice
      ? { priceSpecification: { '@type': 'PriceSpecification' as const, minPrice, priceCurrency: 'EUR' } }
      : {}),
  };
};

const areaServed = [
  // La región evita que se confunda con León (Guanajuato, México).
  {
    '@type': 'City',
    name: SITE.location.city,
    containedInPlace: { '@type': 'AdministrativeArea', name: SITE.location.region },
  },
  { '@type': 'AdministrativeArea', name: `Provincia de ${SITE.location.city}` },
  { '@type': 'Country', name: SITE.location.country },
] as const;

const person: Person = {
  '@type': 'Person',
  '@id': personId,
  name: SITE.name,
  alternateName: [SITE.fullName, SITE.alternateName],
  jobTitle: SITE.jobTitle,
  description: thirdPersonBio(yearsSince(CAREER_START)),
  url: SITE.url,
  ...(SITE.email ? { email: `mailto:${SITE.email}` } : {}),
  ...(SITE.whatsapp ? { telephone: `+${SITE.whatsapp}` } : {}),
  sameAs: [...Object.values(SITE.socials), SITE.googleBusiness].filter(Boolean),
  knowsAbout,
  makesOffer: services.map(offerFor),
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.region,
    addressCountry: SITE.location.countryCode,
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
};

const website: WebSite = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: SITE.url,
  name: SITE.name,
  // Marca del dominio: ayuda a Google a elegir el nombre del sitio en los resultados.
  alternateName: 'bygabo',
  inLanguage: SITE.locale,
  publisher: { '@id': personId },
};

/** Grafo base (Person + WebSite) más los nodos propios de la página. */
export function buildGraph(nodes: Thing[] = []): Graph {
  return { '@context': 'https://schema.org', '@graph': [person, website, ...nodes] };
}

/**
 * Negocio local (sin local abierto al público): refuerza "diseño web en León" y debe coincidir
 * con la ficha de Google Business Profile (mismo nombre, teléfono y zona).
 */
export function businessNode(): Thing {
  const lowestPrice = Math.min(...priceList.map((p) => priceValue(p.priceFrom) ?? Infinity));
  return {
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/og.png`,
    logo: `${SITE.url}/icon-512.png`,
    ...(SITE.whatsapp ? { telephone: `+${SITE.whatsapp}` } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.countryCode,
    },
    areaServed,
    founder: { '@id': personId },
    knowsLanguage: 'es',
    ...(SITE.googleBusiness ? { sameAs: [SITE.googleBusiness], hasMap: SITE.googleBusiness } : {}),
    ...(Number.isFinite(lowestPrice) ? { priceRange: `Desde ${lowestPrice} €` } : {}),
    makesOffer: services.map(offerFor),
  } as Thing;
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
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faqAnswer(faq) },
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

/** Página interna (aviso legal, privacidad…): WebPage + migas de pan desde la home. */
export function innerPageNodes({
  path,
  name,
  dateModified,
}: {
  path: string;
  name: string;
  dateModified?: string;
}): Thing[] {
  const url = new URL(path, SITE.url).href;
  return [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name,
      inLanguage: SITE.locale,
      isPartOf: { '@id': websiteId },
      publisher: { '@id': personId },
      ...(dateModified ? { dateModified } : {}),
      breadcrumb: { '@id': `${url}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    },
  ] as Thing[];
}
