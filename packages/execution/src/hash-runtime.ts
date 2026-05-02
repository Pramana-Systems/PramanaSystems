import crypto from "crypto";

import {
  canonicalize,
} from "@pramanasystems/bundle";

export const runtimeManifestDefinition = {
  runtime_version:
    "1.0.0",

  supported_schema_versions: [
    "1.0.0",
  ],

  capabilities: [
    "deterministic-evaluation",
    "attestation-signing",
    "replay-protection",
    "bundle-verification",
  ],
} as const;

export function hashRuntime(): string {
  return crypto
    .createHash(
      "sha256"
    )
    .update(
      canonicalize(
        runtimeManifestDefinition
      )
    )
    .digest(
      "hex"
    );
}




