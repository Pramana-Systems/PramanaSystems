import {
  getRuntimeManifest,
} from "@manthan/execution";

import type {
  RuntimeRequirements,
  ExecutionRequirements,
} from "@manthan/governance";

export const runtimeManifest =
  getRuntimeManifest();

export const runtimeRequirements: RuntimeRequirements = {
  required_capabilities: [
    "replay-protection",
    "attestation-signing",
  ],

  supported_runtime_versions: [
    "1.0.0",
  ],

  supported_schema_versions: [
    "1.0.0",
  ],
};

export const executionRequirements: ExecutionRequirements = {
  replay_protection_required: true,

  attestation_required: true,

  audit_chain_required: true,

  independent_verification_required: true,
};