/**
 * Non-deterministic operational context attached to a governance envelope.
 * Fields in this interface are in the {@link forbiddenDeterministicFields} list
 * and must not appear inside a deterministic payload.
 */
export interface OperationalMetadata {
  /** ISO 8601 timestamp of when the envelope was generated. */
  generatedAt?: string;

  /** Deployment environment (e.g. `"production"`, `"staging"`). */
  environment?: string;

  /** Hostname of the generating process. */
  host?: string;

  /** Runtime identifier or version of the generating process. */
  runtime?: string;

  /** Distributed trace identifier. */
  traceId?: string;
}

/** Immutable provenance information that links an envelope to a specific runtime build. */
export interface ProvenanceMetadata {
  /** Semantic version of the governance runtime. */
  runtimeVersion?: string;

  /** SHA-256 bundle hash of the executing policy. */
  bundleHash?: string;

  /** Version of the trust root used for verification. */
  trustRootVersion?: string;

  /** CI build identifier that produced the artifact. */
  buildId?: string;
}

/**
 * Container for governance envelope metadata.
 * Split into `operational` (non-deterministic, excluded from signing) and
 * `provenance` (deterministic, included in signing) sections.
 */
export interface GovernanceMetadata {
  /** Non-deterministic operational context — excluded from determinism checks. */
  operational?: OperationalMetadata;

  /** Immutable provenance information — included in determinism checks. */
  provenance?: ProvenanceMetadata;
}