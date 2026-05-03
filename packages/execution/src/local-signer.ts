import crypto from "crypto";

import type {
  Signer,
} from "./signer-interface";

/**
 * In-process Ed25519 {@link Signer} backed by Node.js `crypto`.
 *
 * Suitable for development and environments where the private key can be
 * securely injected at process start.  For hardware-backed or remote signing
 * see {@link AwsKmsSigner}.
 */
export class LocalSigner
  implements Signer {

  /**
   * @param privateKey - PEM-encoded Ed25519 private key (PKCS8 format).
   */
  constructor(
    private readonly privateKey: string
  ) {}

  /**
   * Signs `payload` (UTF-8) with the Ed25519 private key and returns a
   * base64-encoded signature.
   */
  sign(
    payload: string
  ): string {

    return crypto
      .sign(
        null,

        Buffer.from(
          payload,
          "utf8"
        ),

        this.privateKey
      )

      .toString(
        "base64"
      );
  }
}




