function sortKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeys(value[key]);
        return acc;
      }, {} as Record<string, unknown>);
  }

  return value;
}

/**
 * Serializes `value` to a stable, compact JSON string with object keys sorted
 * recursively.  Used by the core validation pipeline for determinism checks.
 *
 * Note: unlike `@pramanasystems/bundle`'s `canonicalize`, this variant uses
 * compact output (`JSON.stringify` without indentation) for in-memory comparisons.
 */
export function canonicalize(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}