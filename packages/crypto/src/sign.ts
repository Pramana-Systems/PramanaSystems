import fs from "fs";

import crypto from "crypto";

import {
  loadPrivateKey,
} from "./keys";

export function signManifest(
  manifestPath: string
): string {

  const manifest =
    fs.readFileSync(
      manifestPath
    );

  const privateKey =
    loadPrivateKey();

  const signature =
    crypto.sign(
      null,
      manifest,
      privateKey
    );

  return signature.toString(
    "base64"
  );
}