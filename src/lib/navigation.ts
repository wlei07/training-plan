export interface Neighbours<T> {
  /** Zero-based index of the located item. */
  index: number
  previous: T | null
  next: T | null
}

/**
 * Locates an item by id and returns its immediate neighbours.
 * Returns null when the id is not present, which callers treat as not-found.
 */
export function neighbours<T extends { id: string }>(
  items: readonly T[],
  id: string,
): Neighbours<T> | null {
  const index: number = items.findIndex((item: T): boolean => item.id === id)
  if (index === -1) {
    return null
  }
  return {
    index,
    previous: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  }
}
