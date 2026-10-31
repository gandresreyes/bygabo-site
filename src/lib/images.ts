import type { ImageMetadata } from 'astro';

// Imágenes opcionales: si el archivo no existe, la función devuelve undefined y el componente no la pinta.
const projectFiles = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projects/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});
const assetFiles = import.meta.glob<{ default: ImageMetadata }>('/src/assets/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

const byName = (files: typeof projectFiles, name: string) =>
  Object.entries(files).find(
    ([path]) =>
      path
        .split('/')
        .pop()!
        .replace(/\.\w+$/, '') === name,
  )?.[1].default;

/** Captura de un proyecto: src/assets/projects/<id>-<variant>.(png|jpg|webp|avif). */
export const projectImage = (id: string, variant: 'desktop' | 'mobile') => byName(projectFiles, `${id}-${variant}`);

/** Imagen suelta de src/assets por nombre de archivo (p. ej. SITE.photo = 'gabo.jpg'). */
export const assetImage = (file: string) => (file ? byName(assetFiles, file.replace(/\.\w+$/, '')) : undefined);
