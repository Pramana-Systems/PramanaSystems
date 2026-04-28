import crypto from "crypto";

import fs from "fs";

import type {
  ExecutionResult,
} from "./execution-result";

const publicKey =
  fs.readFileSync(
    "./manthan_bundle_key.pub",
    "utf8"
  );

export function verifyExecutionResult(
  result: ExecutionResult,
  signature: string
): boolean {
  return crypto.verify(
    null,

    Buffer.from(
      JSON.stringify(
        result
      )
    ),

    publicKey,

    Buffer.from(
      signature,
      "base64"
    )
  );
}