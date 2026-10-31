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
export const isIndexable = !vercelEnv || (vercelEnv === 'production' && productionHost === new URL(SITE.url).host);
