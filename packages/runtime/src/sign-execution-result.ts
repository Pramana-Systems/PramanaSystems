import type {
  ExecutionResult,
} from "./execution-result";

import type {
  Signer,
} from "./signer-interface";

export function signExecutionResult(
  result: ExecutionResult,
  signer: Signer
): string {

  return signer.sign(
    JSON.stringify(
      result
    )
  );
}