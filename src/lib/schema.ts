import type { Graph, Person, Thing, WebSite } from 'schema-dts';
import { SITE } from '../config/site';
import { education, knowsAbout } from '../data/profile';
import { projects } from '../data/projects';

export const personId = `${SITE.url}/#person`;
export const websiteId = `${SITE.url}/#website`;

const person: Person = {
  '@type': 'Person',
  '@id': personId,
  name: SITE.name,
  alternateName: [SITE.fullName, SITE.alternateName],
  jobTitle: SITE.jobTitle,
  description: SITE.description,
  url: SITE.url,
  ...(SITE.email ? { email: `mailto:${SITE.email}` } : {}),
  sameAs: Object.values(SITE.socials).filter(Boolean),
  knowsAbout,
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
