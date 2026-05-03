import {
  createClient,
  type RedisClientType,
} from "redis";

import type {
  AsyncReplayStore,
} from "./async-replay-store-interface";

/**
 * Redis-backed implementation of {@link AsyncReplayStore}.
 *
 * Stores consumed execution identifiers as Redis keys with value `"1"`.
 * Suitable for multi-instance production deployments that require shared
 * replay protection across processes.
 *
 * @example
 * ```ts
 * const store = new RedisReplayStore("redis://redis.internal:6379");
 * ```
 */
export class RedisReplayStore
  implements AsyncReplayStore {
  private readonly client:
    RedisClientType;

  /**
   * @param redisUrl - Redis connection URL (default: `"redis://localhost:6379"`).
   */
  constructor(
    redisUrl =
      "redis://localhost:6379"
  ) {
    this.client =
      createClient({
        url: redisUrl,
      });

    this.client.connect();
  }

  /** Resolves to `true` if `executionId` exists as a key in Redis. */
  async hasExecuted(
    executionId: string
  ): Promise<boolean> {
    const result =
      await this.client.get(
        executionId
      );

    return result === "1";
  }

  /** Sets the Redis key for `executionId` to `"1"`. */
  async markExecuted(
    executionId: string
  ): Promise<void> {
    await this.client.set(
      executionId,
      "1"
    );
  }
}




