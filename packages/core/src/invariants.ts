/** Returns `true` when `value` is a non-empty, non-whitespace-only string. */
export function assertNonEmptyString(
  value: unknown
): boolean {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

/** Returns `true` when `value` is an array. */
export function assertArray(
  value: unknown
): boolean {
  return Array.isArray(value);
}

function scanObject(
  value: unknown,
  forbiddenFields:
    readonly string[]
): boolean {

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(
      (item) =>
        scanObject(
          item,
          forbiddenFields
        )
    );
  }

  for (
    const [key, nested]
    of Object.entries(value)
  ) {

    if (
      forbiddenFields.includes(
        key
      )
    ) {
      return false;
    }

    if (
      !scanObject(
        nested,
        forbiddenFields
      )
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Recursively scans `payload` and returns `false` if any object key matches
 * a name in `forbiddenFields`.
 *
 * Used by {@link LocalValidator} to enforce that operational-metadata fields
 * have not contaminated the deterministic signing scope.
 *
 * @param payload         - The payload object to inspect.
 * @param forbiddenFields - Field names that must not appear anywhere in the payload.
 */
export function assertNoOperationalMetadata(
  payload: unknown,
  forbiddenFields:
    readonly string[]
): boolean {

  return scanObject(
    payload,
    forbiddenFields
  );
}