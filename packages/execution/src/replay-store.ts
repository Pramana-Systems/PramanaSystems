const executedTokens =
  new Set<string>();

/**
 * Returns `true` if `tokenHash` has already been consumed in this process.
 * @deprecated Prefer the {@link MemoryReplayStore} class which implements {@link ReplayStore}.
 */
export function hasExecuted(
  tokenHash: string
): boolean {
  return executedTokens.has(
    tokenHash
  );
}

/**
 * Records `tokenHash` as consumed. Subsequent calls to {@link hasExecuted}
 * will return `true` for this value.
 * @deprecated Prefer the {@link MemoryReplayStore} class which implements {@link ReplayStore}.
 */
export function markExecuted(
  tokenHash: string
): void {
  executedTokens.add(
    tokenHash
  );
}




