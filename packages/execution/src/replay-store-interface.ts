/**
 * Synchronous replay-protection store.  Tracks execution identifiers that have
 * already been consumed so they cannot be re-used.
 *
 * The default implementation is {@link MemoryReplayStore} (process-local,
 * resets on restart).  For distributed deployments use a shared store such as
 * {@link RedisReplayStore}.
 */
export interface ReplayStore {
  /** Returns `true` if `executionId` has already been consumed. */
  hasExecuted(executionId: string): boolean;

  /** Marks `executionId` as consumed.  Subsequent calls to `hasExecuted` must return `true`. */
  markExecuted(executionId: string): void;
}




