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
