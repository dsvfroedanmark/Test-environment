export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).slice(2, 11);
  return prefix ? `${prefix}_${id}` : id;
}
