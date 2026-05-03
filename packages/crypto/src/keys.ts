import fs from "fs";

import path from "path";

const PRIVATE_KEY_PATH =
  path.resolve(
    "./dev-keys/bundle_signing_key"
  );

const PUBLIC_KEY_PATH =
  path.resolve(
    "./dev-keys/bundle_signing_key.pub"
  );

/**
 * Reads the Ed25519 private key PEM from `./dev-keys/bundle_signing_key`.
 * For production deployments inject the key via `PRAMANA_PRIVATE_KEY` instead.
 */
export function loadPrivateKey(): string {

  return fs.readFileSync(
    PRIVATE_KEY_PATH,
    "utf8"
  );
}

/**
 * Reads the Ed25519 public key PEM from `./dev-keys/bundle_signing_key.pub`.
 * For production deployments inject the key via `PRAMANA_PUBLIC_KEY` instead.
 */
export function loadPublicKey(): string {

  return fs.readFileSync(
    PUBLIC_KEY_PATH,
    "utf8"
  );
}




