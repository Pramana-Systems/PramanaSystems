/**
 * Synchronous verification interface used by the deterministic governance runtime.
 * See {@link LocalVerifier} for the in-process implementation.
 */
export interface Verifier {
  /**
   * Verifies that `signature` (base64 Ed25519) was produced over the canonical
   * UTF-8 `payload` with the corresponding private key.
   */
  verify(payload: string, signature: string): boolean;
}




