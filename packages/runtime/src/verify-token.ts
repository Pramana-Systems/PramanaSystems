import crypto from "crypto";

import {
  loadPublicKey,
} from "@manthan/crypto";

import type {
  ExecutionToken,
} from "./execution-token";

export function verifyExecutionToken(
  token: ExecutionToken,
  signature: string
): boolean {
  const publicKey =
    loadPublicKey();

  return crypto.verify(
    null,

    Buffer.from(
      JSON.stringify(token)
    ),

    publicKey,

    Buffer.from(
      signature,
      "base64"
    )
  );
}