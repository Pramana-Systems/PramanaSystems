import type {
  ExecutionContext,
} from "./execution-context";

import type {
  ExecutionResult,
} from "./execution-result";

import type {
  ExecutionAttestation,
} from "./execution-attestation";

import type {
  ReplayStore,
} from "./replay-store-interface";

import type {
  Signer,
} from "./signer-interface";

import type {
  Verifier,
} from "./verifier-interface";

import {
  appendAuditRecord,
} from "./audit";

import {
  hashRuntime,
} from "./hash-runtime";

import {
  MemoryReplayStore,
} from "./memory-replay-store";

import {
  signExecutionResult,
} from "./sign-execution-result";

import {
  verifyExecutionToken,
} from "./verify-token";

import {
  issueExecutionToken,
} from "./issue-token";

import {
  signExecutionToken,
} from "./sign-token";

import {
  getRuntimeManifest,
} from "./runtime-manifest";

function getMissingExecutionRequirements(
  capabilities: readonly string[],
  executionRequirements: ExecutionContext["execution_requirements"]
): string[] {
  const missing =
    new Set<string>();

  if (
    executionRequirements
      .replay_protection_required &&
    !capabilities.includes(
      "replay-protection"
    )
  ) {
    missing.add(
      "replay-protection"
    );
  }

  if (
    executionRequirements
      .attestation_required &&
    !capabilities.includes(
      "attestation-signing"
    )
  ) {
    missing.add(
      "attestation-signing"
    );
  }

  if (
    executionRequirements
      .audit_chain_required &&
    !capabilities.includes(
      "bundle-verification"
    )
  ) {
    missing.add(
      "bundle-verification"
    );
  }

  if (
    executionRequirements
      .independent_verification_required
  ) {
    if (
      !capabilities.includes(
        "attestation-signing"
      )
    ) {
      missing.add(
        "attestation-signing"
      );
    }

    if (
      !capabilities.includes(
        "bundle-verification"
      )
    ) {
      missing.add(
        "bundle-verification"
      );
    }
  }

  return [
    ...missing,
  ];
}

const defaultReplayStore =
  new MemoryReplayStore();

/**
 * Executes a governance decision through the full deterministic pipeline:
 *
 * 1. **Version compatibility** — verifies the runtime version and schema version
 *    satisfy the requirements declared in the bundle manifest.
 * 2. **Capability check** — ensures the runtime advertises every capability
 *    required by the bundle and by `execution_requirements`.
 * 3. **Token verification** — validates the cryptographic signature on the token.
 * 4. **Expiry check** — rejects tokens that have exceeded their TTL.
 * 5. **Replay protection** — rejects execution IDs already present in `replayStore`.
 * 6. **Audit logging** — appends a hash-chained audit record.
 * 7. **Attestation** — builds an {@link ExecutionResult} and signs it, returning an
 *    {@link ExecutionAttestation} that can be independently verified.
 *
 * @param context     - Full execution context including the pre-signed token.
 * @param replayStore - Store used for replay protection (default: module-level MemoryReplayStore).
 * @throws On any verification failure — execution fails closed.
 */
export function executeDecision(
  context: ExecutionContext,
  replayStore: ReplayStore =
    defaultReplayStore
): ExecutionAttestation {

  const {
    token,
    token_signature,
    signer,
    verifier,
    runtime_manifest,
    runtime_requirements,
    execution_requirements,
  } = context;

  if (
    !runtime_requirements
      .supported_runtime_versions
      .includes(
        runtime_manifest.runtime_version
      )
  ) {
    throw new Error(
      "Unsupported runtime version"
    );
  }

  if (
    !runtime_requirements
      .supported_schema_versions
      .includes(
        "1.0.0"
      )
  ) {
    throw new Error(
      "Unsupported schema version"
    );
  }

  if (
    !runtime_manifest
      .supported_schema_versions
      .includes(
        "1.0.0"
      )
  ) {
    throw new Error(
      "Unsupported runtime schema version"
    );
  }

  for (
    const capability of
    runtime_requirements
      .required_capabilities
  ) {
    if (
      !runtime_manifest.capabilities
        .includes(capability)
    ) {
      throw new Error(
        `Missing runtime capability: ${capability}`
      );
    }
  }

  const missingExecutionRequirements =
    getMissingExecutionRequirements(
      runtime_manifest.capabilities,
      execution_requirements
    );

  if (
    missingExecutionRequirements.length >
    0
  ) {
    throw new Error(
      `Missing execution requirement: ${missingExecutionRequirements.join(", ")}`
    );
  }

  const valid =
    verifyExecutionToken(
      token,
      token_signature,
      verifier
    );

  if (!valid) {
    throw new Error(
      "Execution token verification failed"
    );
  }

  const now =
    Date.now();

  const expiration =
    new Date(
      token.expires_at
    ).getTime();

  if (now > expiration) {
    throw new Error(
      "Execution token expired"
    );
  }

  const executionId =
    token.execution_id;

  if (
    replayStore.hasExecuted(
      executionId
    )
  ) {
    throw new Error(
      "Replay attack detected"
    );
  }

  replayStore.markExecuted(
    executionId
  );

  appendAuditRecord(
    token
  );

  const result: ExecutionResult = {
    execution_id:
      token.execution_id,

    policy_id:
      token.policy_id,

    policy_version:
      token.policy_version,

    schema_version:
      "1.0.0",

    runtime_version:
      "1.0.0",

    runtime_hash:
      hashRuntime(),

    decision:
      token.decision_type,

    signals_hash:
      token.signals_hash,

    executed_at:
      new Date()
        .toISOString(),
  };

  const executionSignature =
    signExecutionResult(
      result,
      signer
    );

  const attestation: ExecutionAttestation = {
    result,

    signature:
      executionSignature,
  };

  return attestation;
}

/**
 * Convenience wrapper around {@link executeDecision} that handles token issuance
 * and signing internally.
 *
 * Uses a minimal {@link ExecutionContext} with all security flags set to `false`,
 * making it suitable for simple integrations and the REST API's `/execute` route.
 * For high-assurance deployments construct the {@link ExecutionContext} manually
 * with the appropriate {@link ExecutionRequirements}.
 *
 * @param input   - Policy reference and decision inputs.
 * @param signer  - Signer used for both token signing and result attestation.
 * @param verifier - Verifier used to authenticate the token.
 * @param store   - Optional replay store (default: module-level MemoryReplayStore).
 */
export function executeSimple(
  input: {
    policyId: string;
    policyVersion: string;
    decisionType: string;
    signalsHash: string;
  },
  signer: Signer,
  verifier: Verifier,
  store?: ReplayStore
): ExecutionAttestation {

  const token =
    issueExecutionToken(
      input.policyId,
      input.policyVersion,
      input.decisionType,
      input.signalsHash
    );

  const tokenSignature =
    signExecutionToken(
      token,
      signer
    );

  const runtimeManifest =
    getRuntimeManifest();

  const runtimeRequirements = {
    required_capabilities: [],

    supported_runtime_versions:
      ["1.0.0"],

    supported_schema_versions:
      ["1.0.0"],
  };

  const executionRequirements = {
    replay_protection_required:
      false,

    attestation_required:
      false,

    audit_chain_required:
      false,

    independent_verification_required:
      false,
  };

  const context: ExecutionContext = {
    token,

    token_signature:
      tokenSignature,

    signer,

    verifier,

    runtime_manifest:
      runtimeManifest,

    runtime_requirements:
      runtimeRequirements,

    execution_requirements:
      executionRequirements,
  };

  return executeDecision(
    context,
    store ||
      defaultReplayStore
  );
}




