import crypto from "crypto";

import path from "path";

import {
  readManifest,
} from "@pramanasystems/bundle";

import {
  validatePolicy,
} from "@pramanasystems/governance";

import type {
  ExecutionToken,
} from "./execution-token";

/**
 * Issues a signed, time-limited {@link ExecutionToken} authorizing a single
 * governance decision execution.
 *
 * The policy must pass {@link validatePolicy} before the token is issued, and
 * the bundle hash is read directly from the policy's manifest so the token is
 * bound to the exact bundle version on disk.
 *
 * @param policyId      - The policy to authorize.
 * @param policyVersion - The specific policy version directory (e.g. `"v1"`).
 * @param decisionType  - The decision type to execute (e.g. `"approve"`).
 * @param signalsHash   - SHA-256 hex digest of the input signals payload.
 * @param ttlSeconds    - Token validity window in seconds (default: 300 s / 5 min).
 * @returns A populated {@link ExecutionToken} ready to be signed and passed to {@link executeDecision}.
 * @throws When `validatePolicy` fails for the given `policyId`.
 */
export function issueExecutionToken(
  policyId: string,
  policyVersion: string,
  decisionType: string,
  signalsHash: string,
  ttlSeconds = 300
): ExecutionToken {
  const valid =
    validatePolicy(
      policyId
    );

  if (!valid) {
    throw new Error(
      `Policy validation failed: ${policyId}`
    );
  }

  const manifest =
    readManifest(
      path.join(
        "./policies",
        policyId,
        policyVersion
      )
    );

  const issuedAt =
    new Date();

  const expiresAt =
    new Date(
      issuedAt.getTime() +
      ttlSeconds * 1000
    );

  return {
    execution_id:
      crypto.randomUUID(),

    policy_id:
      policyId,

    policy_version:
      policyVersion,

    bundle_hash:
      manifest.bundle_hash,

    decision_type:
      decisionType,

    signals_hash:
      signalsHash,

    issued_at:
      issuedAt
        .toISOString(),

    expires_at:
      expiresAt
        .toISOString(),
  };
}




