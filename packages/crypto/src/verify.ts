import fs from "fs";

import crypto from "crypto";

import {
  canonicalize,
} from "@pramanasystems/bundle";

import {
  loadPublicKey,
} from "./keys";

/**
 * Reads the manifest JSON at `manifestPath`, canonicalizes it, and verifies
 * `signature` (base64 Ed25519) against the dev public key.
 *
 * @param manifestPath - Path to the `bundle.manifest.json` file.
 * @param signature    - Base64-encoded Ed25519 signature to verify.
 */
export function verifySignature(
  manifestPath: string,
  signature: string
): boolean {

  const manifest =
    JSON.parse(
      fs.readFileSync(
        manifestPath,
        "utf8"
      )
    );

  const canonical =
    canonicalize(
      manifest
    );

  const publicKey =
    loadPublicKey();

  return crypto.verify(
    null,

    Buffer.from(
      canonical,
      "utf8"
    ),

    publicKey,

    Buffer.from(
      signature,
      "base64"
    )
  );
}

/**
 * Verifies a base64-encoded Ed25519 `signature` over an arbitrary UTF-8
 * `payload` using the provided `publicKey` PEM.  Unlike `verifySignature`,
 * this function accepts any payload string rather than reading a manifest
 * file from disk.
 *
 * @param payload   - The original signed UTF-8 string.
 * @param signature - Base64-encoded Ed25519 signature.
 * @param publicKey - PEM-encoded Ed25519 public key.
 */
export function verifyPayloadSignature(
  payload: string,
  signature: string,
  publicKey: string
): boolean {

  return crypto.verify(
    null,

    Buffer.from(
      payload,
      "utf8"
    ),

    publicKey,

    Buffer.from(
      signature,
      "base64"
    )
  );
}




