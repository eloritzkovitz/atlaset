/**
 * Visit-related helper utilities extracted for reuse and testing.
 */

// Get the first visit year for a country based on visit context, checking both firstVisitMap and visitedYearMap
export function getFirstYearFor(
  iso?: string,
  firstVisitMap?: Record<string, Date> | undefined,
  visitedYearMap?: Record<string, Set<number>> | undefined,
): number | null {
  if (!iso) return null;
  const byDate = firstVisitMap?.[iso];
  if (byDate) return byDate.getFullYear();
  const set = visitedYearMap?.[iso];
  if (set && set.size > 0) return Math.min(...Array.from(set));
  return null;
}

// Get the last visit year for a country based on provided maps
export function getLastYearFor(
  iso?: string,
  lastVisitMap?: Record<string, Date> | undefined,
  visitedYearMap?: Record<string, Set<number>> | undefined,
): number | null {
  if (!iso) return null;
  const byDate = lastVisitMap?.[iso];
  if (byDate) return byDate.getFullYear();
  const set = visitedYearMap?.[iso];
  if (set && set.size > 0) return Math.max(...Array.from(set));
  return null;
}

// Check if a country was visited in a specific year using the visitedYearMap
export function hasVisitInYearFor(
  iso: string | undefined,
  year: number,
  visitedYearMap?: Record<string, Set<number>>,
): boolean {
  return Boolean(iso && visitedYearMap?.[iso]?.has(year));
}

// Get the visit count for a country given either a map or an ISO list
export function getVisitCountFor(
  iso?: string,
  visitedMap?: Record<string, number>,
  visitedIsoCodes?: string[],
) {
  if (!iso) return 0;
  if (visitedMap) return visitedMap[iso] || 0;
  return (visitedIsoCodes ?? []).includes(iso) ? 1 : 0;
}

// Check if a country is visited given either a map or an ISO list
export function isVisitedFor(
  iso?: string,
  visitedMap?: Record<string, number>,
  visitedIsoCodes?: string[],
) {
  return getVisitCountFor(iso, visitedMap, visitedIsoCodes) > 0;
}
