export function initialsOf(fullName?: string | null): string {
  if (!fullName) return '';
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 11);
}
