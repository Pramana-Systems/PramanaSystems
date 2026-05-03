import {
  canonicalizeForSigning
} from "./canonical-signing";

import type {
  Verifier,
} from "./verifier-interface";

/** A single audit log entry with arbitrary governance fields. */
export interface AuditEntry {
  [key: string]: unknown;
}

/**
 * Verifies that `signature` (base64 Ed25519) was produced over the canonical
 * form of `entry` by the authority whose key `verifier` holds.
 */
export function verifyAuditEntry(
  entry: AuditEntry,
  signature: string,
  verifier: Verifier
): boolean {

  return verifier.verify(
    canonicalizeForSigning(entry),
    signature
  );
}

/**
 * Placeholder for full audit-chain integrity verification.
 * A complete implementation would re-hash every JSONL record and validate
 * the `previous_record_hash` linkage.
 *
 * @returns `true` — full chain verification is not yet implemented.
 */
export function verifyAuditChain(): boolean {
  return true;
}




