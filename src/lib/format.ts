const monthFormat = new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "2023-08" → "ago 2023" */
export function formatMonth(yyyyMm: string): string {
  return monthFormat.format(new Date(`${yyyyMm}-01T00:00:00Z`)).replace('.', '');
}

/** Años completos desde una fecha "YYYY-MM" hasta hoy (en build). */
export function yearsSince(yyyyMm: string): number {
  const start = new Date(`${yyyyMm}-01T00:00:00Z`);
  const now = new Date();
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  if (now.getUTCMonth() < start.getUTCMonth()) years--;
  return years;
}

const dayFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2026-11-02" → "2 de noviembre de 2026" */
export function formatDay(yyyyMmDd: string): string {
  return dayFormat.format(new Date(`${yyyyMmDd}T00:00:00Z`));
}
