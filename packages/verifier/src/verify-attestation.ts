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




