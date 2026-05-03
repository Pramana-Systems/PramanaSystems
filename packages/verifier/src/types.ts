/**
 * Structured result of an attestation verification.
 *
 * `valid` is `true` only when all three checks pass.  Individual check flags
 * allow callers to produce precise diagnostic messages on failure.
 */
export interface VerificationResult {
  /** `true` when all checks — signature, runtime, and schema — pass. */
  valid: boolean;

  checks: {
    /** `true` when the attestation signature is cryptographically valid. */
    signature_verified: boolean;

    /** `true` when the attestation's runtime hash and version match the provided manifest. */
    runtime_verified: boolean;

    /** `true` when the attestation's schema version is supported by the runtime manifest. */
    schema_compatible: boolean;
  };
}




