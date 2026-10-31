// Solo para código de servidor/build (usa process.env): no importar desde scripts del navegador.
import { SITE } from './site';

// Vercel expone estas variables en el build. VERCEL_PROJECT_PRODUCTION_URL es el dominio de producción
// del proyecto: el dominio propio si está conectado o, si no, el *.vercel.app.
const vercelEnv = process.env.VERCEL_ENV;
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/**
 * Se indexa solo en producción con el dominio propio (SITE.url). Mientras la web viva en *.vercel.app
 * (entorno de pruebas) o en una preview, se pide a buscadores e IA que no la indexen.
 * Fuera de Vercel (build local) se considera indexable para que la auditoría revise el HTML real.
 */
// Se compara sin "www." para que da igual cuál de los dos sea el principal en Vercel.
const bareHost = (host = '') => host.replace(/^www\./, '');
export const isIndexable =
  !vercelEnv || (vercelEnv === 'production' && bareHost(productionHost) === bareHost(new URL(SITE.url).host));

/**
 * Origen para recursos que se comparten fuera de la web (imagen OG/Twitter). Mientras el dominio propio
 * no sea el de producción, apunta al host del despliegue actual para que la vista previa funcione al
 * compartir el enlace de Vercel. Canonical y JSON-LD siguen apuntando a SITE.url.
 */
const deployHost = vercelEnv === 'preview' ? process.env.VERCEL_URL : productionHost;
export const shareOrigin = isIndexable || !deployHost ? SITE.url : `https://${deployHost}`;

/** true al compilar en Vercel: ahí existen los scripts de /_vercel (analítica). En local daría 404. */
export const isOnVercel = Boolean(vercelEnv);
