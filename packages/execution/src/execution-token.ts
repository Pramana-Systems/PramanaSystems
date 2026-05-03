/**
 * A short-lived, single-use authorization credential issued immediately before
 * executing a governance decision.  The token is cryptographically signed; its
 * `execution_id` is recorded in the {@link ReplayStore} upon execution to
 * prevent re-use.
 */
export interface ExecutionToken {
  /** Unique execution identifier (UUIDv4).  Single-use — consumed by the ReplayStore. */
  execution_id: string;

  /** Policy identifier this token authorizes execution for. */
  policy_id: string;

  /** Policy version string (e.g. `"v1"`). */
  policy_version: string;

  /** Bundle hash from the policy manifest, binding the token to a specific bundle version. */
  bundle_hash: string;

  /** The governance decision type to be executed (e.g. `"approve"` or `"deny"`). */
  decision_type: string;

  /** SHA-256 hex digest of the input signals payload, committing the token to specific inputs. */
  signals_hash: string;

  /** ISO 8601 UTC timestamp of when the token was issued. */
  issued_at: string;

  /** ISO 8601 UTC timestamp after which the token is no longer valid. */
  expires_at: string;
}




