/**
 * Synchronous signing interface used by the deterministic governance runtime.
 * Implementations must produce a base64-encoded Ed25519 signature over the
 * UTF-8 `payload`.  See {@link LocalSigner} for the in-process implementation.
 */
export interface Signer {
  /**
   * Signs the canonical UTF-8 `payload` and returns a base64-encoded signature.
   * Must be deterministic: the same key and payload always produce the same bytes.
   */
  sign(payload: string): string;
}




