import {
  canonicalize,
} from "@pramanasystems/bundle";

import type {
  RuntimeManifest,
} from "./runtime-manifest";

import type {
  Signer,
} from "./signer-interface";

export function signRuntimeManifest(
  manifest: RuntimeManifest,
  signer: Signer
): string {

  return signer.sign(
    canonicalize(manifest)
  );
}




