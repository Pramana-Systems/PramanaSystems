import type {
  ExecutionToken,
} from "./execution-token";

import type {
  Signer,
} from "./signer-interface";

import type {
  Verifier,
} from "./verifier-interface";

import type {
  RuntimeManifest,
} from "./runtime-manifest";

import type {
  RuntimeRequirements,
} from "@pramanasystems/governance";

import type {
  ExecutionRequirements,
} from "@pramanasystems/governance";

/**
 * Full context required by {@link executeDecision}.
 *
 * Bundles the pre-signed execution token with the cryptographic infrastructure
 * (signer/verifier), the active runtime manifest, and the governance requirement
 * flags that must be satisfied before the decision proceeds.
 */
export interface ExecutionContext {
  /** The pre-issued, time-limited execution token. */
  token: ExecutionToken;

  /** Base64 Ed25519 signature over the canonical token, produced by the issuing authority. */
  token_signature: string;

  /** Signer used to sign the {@link ExecutionResult} at the end of the execution pipeline. */
  signer: Signer;

  /** Verifier used to authenticate the execution token at the start of the execution pipeline. */
  verifier: Verifier;

  /** Manifest describing the currently active governance runtime. */
  runtime_manifest: RuntimeManifest;

  /** Version and capability constraints the runtime must satisfy to execute this bundle. */
  runtime_requirements: RuntimeRequirements;

  /** Security properties the execution environment must provide. */
  execution_requirements: ExecutionRequirements;
}




