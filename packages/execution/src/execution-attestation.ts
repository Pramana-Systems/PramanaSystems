import type {
  ExecutionResult,
} from "./execution-result";

/**
 * The output of a successful {@link executeDecision} call.
 *
 * Combines the {@link ExecutionResult} with a base64 Ed25519 signature over
 * its canonical form, enabling any holder of the corresponding public key to
 * independently verify the decision without trusting the runtime operator.
 */
export interface ExecutionAttestation {
  /** The immutable record of the governance decision. */
  result: ExecutionResult;

  /** Base64-encoded Ed25519 signature over the canonical `result` bytes. */
  signature: string;
}




