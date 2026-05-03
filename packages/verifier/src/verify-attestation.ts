import type {
  ExecutionAttestation,
  RuntimeManifest,
} from "@pramanasystems/execution";

import type {
  Verifier,
} from "@pramanasystems/execution";

import {
  verifyExecutionResult,
} from "@pramanasystems/execution";

import type {
  VerificationResult,
} from "./types";

/**
 * Verifies an {@link ExecutionAttestation} against a trusted runtime manifest.
 *
 * Performs three independent checks:
 * - **Signature** — cryptographic verification of `attestation.signature` over `attestation.result`.
 * - **Runtime** — the result's `runtime_hash` and `runtime_version` match `runtimeManifest`.
 * - **Schema** — the result's `schema_version` is in `runtimeManifest.supported_schema_versions`.
 *
 * All three must pass for `valid` to be `true`.  This function is the primary
 * entry point for independent out-of-runtime verification.
 *
 * @param attestation    - The attestation to verify.
 * @param verifier       - Verifier holding the public key of the signing authority.
 * @param runtimeManifest - The trusted runtime manifest to compare against.
 */
export function verifyAttestation(
  attestation: ExecutionAttestation,
  verifier: Verifier,
  runtimeManifest: RuntimeManifest
): VerificationResult {

  const signatureVerified =
    verifyExecutionResult(
      attestation.result,
      attestation.signature,
      verifier
    );

  const runtimeVerified =
    attestation.result.runtime_hash ===
      runtimeManifest.runtime_hash &&
    attestation.result.runtime_version ===
      runtimeManifest.runtime_version;

  const schemaCompatible =
    runtimeManifest
      .supported_schema_versions
      .includes(
        attestation.result.schema_version
      );

  return {
    valid:
      signatureVerified &&
      runtimeVerified &&
      schemaCompatible,

    checks: {
      signature_verified:
        signatureVerified,

      runtime_verified:
        runtimeVerified,

      schema_compatible:
        schemaCompatible,
    },
  };
}




