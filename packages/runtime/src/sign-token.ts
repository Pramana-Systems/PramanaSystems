import fs from "fs";

import type {
  ExecutionToken,
} from "./execution-token";

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

export function signExecutionToken(
  token: ExecutionToken,
  signer: Signer =
    defaultSigner
): string {
  return signer.sign(
    JSON.stringify(
      token
    )
  );
}