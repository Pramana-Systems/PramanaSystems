import crypto from "crypto";

import { canonicalize }
  from "../../../packages/bundle/src/canonicalize";

import type {
  BundleManifest,
} from "../../../packages/bundle/src/types";

import {
  loadPublicKey,
} from "./keys";

export function verifySignature(
  manifest: BundleManifest,
  signature: string
): boolean {
  const canonical =
    canonicalize(manifest);

  const publicKey =
    loadPublicKey();

  return crypto.verify(
    null,
    Buffer.from(canonical),
    publicKey,
    Buffer.from(signature, "base64")
  );
}