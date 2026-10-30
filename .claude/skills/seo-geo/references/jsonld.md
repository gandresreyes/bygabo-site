# Plantillas JSON-LD

Todas usan `SITE` de `src/config/site.ts`. Los `@id` estables permiten que los nodos de distintas páginas se refieran a la misma entidad. Renderiza con un componente `JsonLd.astro`:

```astro
---
import type { Thing, WithContext, Graph } from 'schema-dts';
interface Props { data: WithContext<Thing> | Graph }
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

## Base (todas las páginas): WebSite + Person

```ts
import type { Graph } from 'schema-dts';
import { SITE } from '../config/site';

export const personId = `${SITE.url}/#person`;
export const websiteId = `${SITE.url}/#website`;

export const baseGraph: Graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': personId,
      name: SITE.name,
      alternateName: SITE.alternateName,
      jobTitle: SITE.jobTitle,
      description: SITE.description,
      url: SITE.url,
      image: `${SITE.url}/me.jpg`,
      email: `mailto:${SITE.email}`,
      sameAs: Object.values(SITE.socials).filter(Boolean),
      knowsAbout: ['TypeScript', 'Astro', /* stack real */],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: SITE.url,
      name: SITE.name,
      inLanguage: SITE.locale,
      publisher: { '@id': personId },
    },
  ],
};
```

## Home / About: ProfilePage

```ts
{
  '@type': 'ProfilePage',
  '@id': `${pageUrl}#webpage`,
  url: pageUrl,
  name: title,
  isPartOf: { '@id': websiteId },
  mainEntity: { '@id': personId },
  dateModified: lastUpdated.toISOString(),
}
```

## Artículo del blog: BlogPosting

```ts
{
  '@type': 'BlogPosting',
  '@id': `${pageUrl}#article`,
  headline: post.data.title,
  description: post.data.description,
  url: pageUrl,
  image: ogImageUrl,
  datePublished: post.data.pubDate.toISOString(),
  dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
  author: { '@id': personId },
  publisher: { '@id': personId },
  isPartOf: { '@id': websiteId },
  inLanguage: SITE.locale,
  keywords: post.data.tags.join(', '),
}
```

## Proyecto: SoftwareSourceCode (con repo) o CreativeWork (sin repo)

```ts
{
  '@type': project.data.repo ? 'SoftwareSourceCode' : 'CreativeWork',
  '@id': `${pageUrl}#project`,
  name: project.data.title,
  description: project.data.description,
  url: project.data.url ?? pageUrl,
  codeRepository: project.data.repo,
  programmingLanguage: project.data.stack,
  author: { '@id': personId },
  dateCreated: project.data.pubDate.toISOString(),
  image: ogImageUrl,
}
```

## Páginas internas: BreadcrumbList

```ts
{
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Proyectos', item: `${SITE.url}/projects/` },
    { '@type': 'ListItem', position: 3, name: project.data.title, item: pageUrl },
  ],
}
```

Para combinar, agrega los nodos específicos de la página al `@graph` base en lugar de emitir varios `<script>` sueltos.

Valida con https://validator.schema.org y con la prueba de resultados enriquecidos de Google.
