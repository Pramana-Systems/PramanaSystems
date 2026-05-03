/**
 * Async variant of {@link ReplayStore} for distributed replay-protection
 * backends.  See {@link RedisReplayStore} for the Redis implementation.
 */
export interface AsyncReplayStore {
  /** Resolves to `true` if `executionId` has already been consumed. */
  hasExecuted(executionId: string): Promise<boolean>;

  /** Marks `executionId` as consumed. */
  markExecuted(executionId: string): Promise<void>;
}




