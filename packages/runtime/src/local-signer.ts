import crypto from "crypto";

import fs from "fs";

import type {
  Signer,
} from "./signer-interface";

export class LocalSigner
  implements Signer {
  private readonly privateKey =
    fs.readFileSync(
      "./manthan_bundle_key",
      "utf8"
    );

  sign(
    payload: string
  ): string {
    return crypto
      .sign(
        null,
        Buffer.from(
          payload
        ),
        this.privateKey
      )
      .toString(
        "base64"
      );
  }
}