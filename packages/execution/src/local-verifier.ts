import crypto from "crypto";

import type {
  Verifier,
} from "./verifier-interface";

/**
 * In-process Ed25519 {@link Verifier} backed by Node.js `crypto`.
 *
 * Paired with {@link LocalSigner}; both must use the same Ed25519 key pair.
 */
export class LocalVerifier
  implements Verifier {

  /**
   * @param publicKey - PEM-encoded Ed25519 public key (SPKI format).
   */
  constructor(
    private readonly publicKey: string
  ) {}

  /**
   * Verifies that `signature` (base64 Ed25519) was produced over the UTF-8
   * `payload` by the holder of the corresponding private key.
   */
  verify(
    payload: string,
    signature: string
  ): boolean {

    return crypto.verify(
      null,

      Buffer.from(
        payload,
        "utf8"
      ),

      this.publicKey,

      Buffer.from(
        signature,
        "base64"
      )
    );
  }
}




