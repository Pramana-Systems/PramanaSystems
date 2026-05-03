/** Deterministic payload for a release artifact attestation. */
export interface ReleasePayload {
  /** Semantic version of the release (e.g. `"1.0.5"`). */
  version: string;
  /** List of artifact identifiers (e.g. package names or SHA-256 hashes) included in the release. */
  artifacts: string[];
}

/** Deterministic payload for a runtime version attestation. */
export interface RuntimePayload {
  /** Runtime identifier. */
  runtime: string;
  /** Semantic version of the runtime. */
  version: string;
  /** Schema or protocol versions the runtime is compatible with. */
  compatibility: string[];
}

/** Deterministic payload for a governance decision attestation. */
export interface AttestationPayload {
  /** The governance decision (e.g. `"approve"` or `"deny"`). */
  decision: string;
  /** The policy version that produced the decision. */
  policyVersion: string;
  /** ISO 8601 UTC timestamp of when the decision was made. */
  timestamp: string;
}