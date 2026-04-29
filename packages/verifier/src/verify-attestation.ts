import type {
  ExecutionAttestation,
} from "@manthan/runtime";

import type {
  Verifier,
} from "@manthan/runtime";

import {
  verifyExecutionResult,
} from "@manthan/runtime";

import {
  hashRuntime,
} from "@manthan/runtime";

import type {
  VerificationResult,
} from "./types";

export function verifyAttestation(
  attestation: ExecutionAttestation,
  verifier: Verifier
): VerificationResult {

  const signatureVerified =
    verifyExecutionResult(
      attestation.result,
      attestation.signature,
      verifier
    );

  const runtimeVerified =
    attestation.result.runtime_hash ===
    hashRuntime();

  const schemaCompatible =
    attestation.result.schema_version ===
    "1.0.0";

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