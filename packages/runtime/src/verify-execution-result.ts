import type {
  ExecutionResult,
} from "./execution-result";

import type {
  Verifier,
} from "./verifier-interface";

export function verifyExecutionResult(
  result: ExecutionResult,
  signature: string,
  verifier: Verifier
): boolean {

  return verifier.verify(
    JSON.stringify(
      result
    ),

    signature
  );
}