// Avisa a Bing (y a los buscadores de IndexNow) de las URLs del sitemap tras cada despliegue a producción.
// ChatGPT y Copilot buscan con Bing: así ven antes los cambios. Uso: node scripts/indexnow.mjs
// La clave es pública por diseño: Bing la comprueba en https://www.bygabo.dev/<clave>.txt (public/).
const SITE = 'https://www.bygabo.dev';
const KEY = 'e027944ce8519430cc6c14155a690484';

const sitemapUrls = async (url) => {
  const xml = await (await fetch(url)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // El índice apunta a otros sitemaps: se recorren y se juntan sus URLs.
  return xml.includes('<sitemapindex') ? (await Promise.all(locs.map(sitemapUrls))).flat() : locs;
};

const urlList = await sitemapUrls(`${SITE}/sitemap-index.xml`);
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: ${response.status} ${response.statusText} (${urlList.length} URLs)`);
// 200 = recibido, 202 = recibido y pendiente de validar la clave. Cualquier otro código es un error.
if (![200, 202].includes(response.status)) process.exit(1);
