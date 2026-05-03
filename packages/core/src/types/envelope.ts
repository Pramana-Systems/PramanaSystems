import type {
  GovernanceMetadata
} from "./metadata";

/**
 * Generic signed wrapper for deterministic governance payloads.
 *
 * The `payload` is the deterministic content subject to signing and validation.
 * `metadata` carries operational context (host, trace IDs, etc.) that is
 * intentionally excluded from the deterministic signing scope.
 */
export interface SignedEnvelope<TPayload> {
  /** The deterministic payload to be signed and verified. */
  payload: TPayload;

  /** Optional operational metadata — excluded from signing and determinism checks. */
  metadata?: GovernanceMetadata;

  /** Base64-encoded Ed25519 signature over the canonical `payload`. */
  signature: string;
}