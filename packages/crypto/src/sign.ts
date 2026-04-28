import crypto from "crypto";

import { canonicalize }
  from "../../../packages/bundle/src/canonicalize";

import type {
  BundleManifest,
} from "../../../packages/bundle/src/types";

import {
  loadPrivateKey,
} from "./keys";

export function signManifest(
  manifest: BundleManifest
): string {
  const canonical =
    canonicalize(manifest);

  const privateKey =
    loadPrivateKey();

  const signature =
    crypto.sign(
      null,
      Buffer.from(canonical),
      privateKey
    );

  return signature.toString("base64");
}