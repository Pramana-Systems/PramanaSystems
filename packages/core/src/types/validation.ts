/**
 * Per-stage pass/fail breakdown produced by {@link LocalValidator}.
 * Each stage is run in order; a `false` entry short-circuits subsequent
 * stages that depend on it.
 */
export interface ValidationStages {
  /** Envelope has both `payload` and `signature` fields of the correct types. */
  structure: boolean;

  /** The payload serializes without error through the canonical JSON pipeline. */
  canonical: boolean;

  /**
   * The payload contains no {@link forbiddenDeterministicFields} (e.g. `generatedAt`,
   * `traceId`) that would break deterministic reproducibility.
   */
  deterministic: boolean;

  /**
   * The canonical payload matches the canonical envelope-without-metadata, confirming
   * that metadata has not contaminated the deterministic signing scope.
   */
  metadataIsolation: boolean;

  /**
   * Cryptographic signature over the payload has been verified.
   * Currently always `false` — cryptographic verification is not yet wired into
   * `LocalValidator`.  Use `@pramanasystems/verifier` for signature verification.
   */
  cryptographic: boolean;
}

/** Full validation result returned by {@link LocalValidator.validate}. */
export interface ValidationResult {
  /**
   * `true` only when all five validation stages pass, including `cryptographic`.
   * Currently always `false` because the cryptographic stage is not yet implemented.
   */
  valid: boolean;

  /** `true` when cryptographic signature verification passed. Currently always `false`. */
  verified: boolean;

  /** Granular per-stage results for diagnostics. */
  stages: ValidationStages;

  /** Human-readable error messages for every failed stage. */
  errors: string[];
}