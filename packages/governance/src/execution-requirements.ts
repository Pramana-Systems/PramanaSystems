/**
 * Security properties that the execution environment must provide before a
 * governance decision may proceed.  All flags default to `false`; set them to
 * `true` for high-assurance deployments.
 */
export interface ExecutionRequirements {
  /** When `true`, the runtime must expose the `"replay-protection"` capability. */
  replay_protection_required: boolean;

  /** When `true`, the runtime must expose the `"attestation-signing"` capability. */
  attestation_required: boolean;

  /** When `true`, the runtime must expose the `"bundle-verification"` capability. */
  audit_chain_required: boolean;

  /**
   * When `true`, requires both `"attestation-signing"` and `"bundle-verification"`.
   * Ensures the runtime can produce independently verifiable attestations.
   */
  independent_verification_required: boolean;
}




