import fs from "fs";

import type {
  ExecutionResult,
} from "./execution-result";

import type {
  Signer,
} from "./signer-interface";

import {
  LocalSigner,
} from "./local-signer";

const defaultSigner =
  new LocalSigner(
    fs.readFileSync(
      "./manthan_bundle_key",
      "utf8"
    )
  );

export function signExecutionResult(
  result: ExecutionResult,
  signer: Signer =
    defaultSigner
): string {
  return signer.sign(
    JSON.stringify(
      result
    )
  );
}