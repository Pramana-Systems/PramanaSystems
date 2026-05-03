import crypto from "crypto";

import {
  canonicalize,
} from "@pramanasystems/bundle";

/**
 * The static portion of the runtime manifest (everything except `runtime_hash`).
 * Used both as the canonical source of capability declarations and as the input
 * to {@link hashRuntime}.
 */
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

/**
 * Returns the SHA-256 hex digest of the canonicalized {@link runtimeManifestDefinition}.
 * This hash is embedded in every {@link ExecutionResult} as `runtime_hash`,
 * binding the result to a specific version of the runtime.
 */
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




