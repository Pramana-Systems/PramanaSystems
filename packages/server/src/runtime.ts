import crypto from "crypto";

import {
  LocalSigner,
  LocalVerifier,
  getRuntimeManifest,
} from "@pramanasystems/execution";

import {
  loadPrivateKey,
  loadPublicKey,
} from "@pramanasystems/crypto";

/**
 * Resolves the Ed25519 key pair for the server in priority order:
 * 1. `PRAMANA_PRIVATE_KEY` + `PRAMANA_PUBLIC_KEY` environment variables.
 * 2. Dev keys on disk at `./dev-keys/bundle_signing_key{,.pub}`.
 * 3. Ephemeral in-process key pair (new on every restart — dev only).
 */
function resolveKeyPair(): { privateKey: string; publicKey: string } {
  if (process.env.PRAMANA_PRIVATE_KEY && process.env.PRAMANA_PUBLIC_KEY) {
    return {
      privateKey: process.env.PRAMANA_PRIVATE_KEY,
      publicKey: process.env.PRAMANA_PUBLIC_KEY,
    };
  }

  try {
    return {
      privateKey: loadPrivateKey(),
      publicKey: loadPublicKey(),
    };
  } catch {
    // no dev keys on disk — fall through to ephemeral
  }

  const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519", {
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });

  return { privateKey, publicKey };
}

const keys = resolveKeyPair();

export const signer = new LocalSigner(keys.privateKey);
export const verifier = new LocalVerifier(keys.publicKey);
export const runtimeManifest = getRuntimeManifest();
