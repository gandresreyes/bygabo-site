#!/usr/bin/env node
// Audita el HTML generado por `astro build` contra las reglas de SEO/GEO y accesibilidad del proyecto.
// Uso: node .claude/skills/ship-check/scripts/audit-dist.mjs [dist]
// Sale con código 1 si hay errores (los avisos no fallan).

import { readdir, readFile, access } from 'node:fs/promises';
import { join, relative } from 'node:path';

const distDir = process.argv[2] ?? 'dist';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [])),
  );
  return files.flat();
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
}

function audit(html) {
  const errors = [];
  const warnings = [];
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const meta = (key) => metas.find((m) => m.name === key || m.property === key)?.content;
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));

  const noindex = /noindex/i.test(meta('robots') ?? '');

  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';
  if (!attrs(htmlTag).lang) errors.push('<html> sin atributo lang');

  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  if (!title) errors.push('sin <title>');
  else if (title.length > 60) warnings.push(`<title> de ${title.length} caracteres (máx. 60): "${title}"`);
  else if (title.length < 10) warnings.push(`<title> muy corto: "${title}"`);

  const description = meta('description');
  if (!description) errors.push('sin meta description');
  else if (description.length < 70 || description.length > 160)
    warnings.push(`meta description de ${description.length} caracteres (ideal 120–160)`);

  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1Count !== 1) errors.push(`${h1Count} elementos <h1> (debe haber exactamente 1)`);

  if (!noindex) {
    const canonical = links.find((l) => l.rel === 'canonical')?.href;
    if (!canonical) errors.push('sin <link rel="canonical">');
    else if (!/^https?:\/\//.test(canonical)) errors.push(`canonical no es absoluta: ${canonical}`);

    for (const key of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) {
      if (!meta(key)) errors.push(`sin ${key}`);
    }
    const ogImage = meta('og:image');
    if (ogImage && !/^https?:\/\//.test(ogImage)) errors.push(`og:image no es absoluta: ${ogImage}`);

    const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    if (jsonLd.length === 0) errors.push('sin JSON-LD');
    for (const [, body] of jsonLd) {
      try {
        JSON.parse(body);
      } catch {
        errors.push('JSON-LD inválido (no parsea)');
      }
    }
  }

  const imgsWithoutAlt = [...html.matchAll(/<img\b[^>]*>/gi)].filter((m) => !('alt' in attrs(m[0])));
  if (imgsWithoutAlt.length) errors.push(`${imgsWithoutAlt.length} <img> sin atributo alt`);

  const vagueLinks = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].filter((m) =>
    /^(click aquí|clic aquí|aquí|here|click here|leer más|read more|más)$/i.test(decode(m[1].replace(/<[^>]+>/g, ''))),
  );
  if (vagueLinks.length) warnings.push(`${vagueLinks.length} enlaces con texto genérico ("aquí", "leer más"…)`);

  return { errors, warnings, title, description, noindex };
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const files = await walk(distDir).catch(() => {
  console.error(`No existe "${distDir}". Ejecuta primero: npm run build`);
  process.exit(1);
});

let errorCount = 0;
let warningCount = 0;
const titles = new Map();
const descriptions = new Map();

for (const file of files.sort()) {
  const page = '/' + relative(distDir, file);
  const { errors, warnings, title, description, noindex } = audit(await readFile(file, 'utf8'));
  if (!noindex) {
    if (title) titles.set(title, [...(titles.get(title) ?? []), page]);
    if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), page]);
  }
  if (errors.length || warnings.length) {
    console.log(`\n${page}`);
    errors.forEach((e) => console.log(`  ✗ ${e}`));
    warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }
  errorCount += errors.length;
  warningCount += warnings.length;
}

for (const [label, map] of [['<title>', titles], ['meta description', descriptions]]) {
  for (const [value, pages] of map) {
    if (pages.length > 1) {
      console.log(`\n✗ ${label} duplicado en ${pages.join(', ')}: "${value.slice(0, 80)}"`);
      errorCount++;
    }
  }
}

console.log('\nArchivos del sitio');
// El feed RSS solo es obligatorio cuando existe el blog.
const hasBlog = await exists(join(distDir, 'blog'));
for (const name of ['robots.txt', 'sitemap-index.xml', 'llms.txt', ...(hasBlog ? ['rss.xml'] : []), '404.html']) {
  const ok = await exists(join(distDir, name));
  console.log(`  ${ok ? '✓' : '✗'} ${name}`);
  if (!ok) errorCount++;
}

console.log(`\n${files.length} páginas · ${errorCount} errores · ${warningCount} avisos`);
process.exit(errorCount ? 1 : 0);
