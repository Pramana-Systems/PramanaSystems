/**
 * Immutable record of a completed governance decision.  Captured inside an
 * {@link ExecutionAttestation} and signed by the {@link Signer} to provide a
 * tamper-evident audit artifact.
 */
export interface ExecutionResult {
  /** Unique execution identifier matching the consumed {@link ExecutionToken}. */
  execution_id: string;

  /** Policy identifier that was executed. */
  policy_id: string;

  /** Policy version string. */
  policy_version: string;

  /** Schema version of this result format. Currently `"1.0.0"`. */
  schema_version: string;

  /** Runtime version that produced this result. Currently `"1.0.0"`. */
  runtime_version: string;

  /** SHA-256 hash of the runtime manifest definition, binding the result to a specific runtime build. */
  runtime_hash: string;

  /** The governance decision that was executed (e.g. `"approve"` or `"deny"`). */
  decision: string;

  /** SHA-256 hex digest of the input signals payload. */
  signals_hash: string;

  /** ISO 8601 UTC timestamp of when the decision was executed. */
  executed_at: string;
}




