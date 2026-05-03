import type {
  ReplayStore,
} from "./replay-store-interface";

/**
 * In-process, process-local implementation of {@link ReplayStore}.
 *
 * Stores consumed execution identifiers in a `Set<string>`.  Replay protection
 * resets when the process restarts, so this store is appropriate for
 * development, testing, and single-instance deployments only.
 * For distributed environments use {@link RedisReplayStore}.
 */
export class MemoryReplayStore
  implements ReplayStore {
  private readonly store =
    new Set<string>();

  /** Returns `true` if `executionId` has already been consumed in this process. */
  hasExecuted(
    executionId: string
  ): boolean {
    return this.store.has(
      executionId
    );
  }

  /** Records `executionId` as consumed. */
  markExecuted(
    executionId: string
  ): void {
    this.store.add(
      executionId
    );
  }
}




