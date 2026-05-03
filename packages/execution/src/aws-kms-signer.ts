import {
  KMSClient,
  SignCommand,
} from "@aws-sdk/client-kms";

import type {
  AsyncSigner,
} from "./async-signer-interface";

/**
 * AWS KMS-backed implementation of {@link AsyncSigner} using ECDSA_SHA_256.
 *
 * The KMS key must be an asymmetric signing key with the `ECDSA_SHA_256`
 * signing algorithm enabled.  AWS credentials are resolved from the environment
 * via the standard AWS SDK credential chain.
 *
 * @example
 * ```ts
 * const signer = new AwsKmsSigner("arn:aws:kms:us-east-1:123456789012:key/...");
 * const sig = await signer.sign(canonicalPayload);
 * ```
 */
export class AwsKmsSigner
  implements AsyncSigner {

  private readonly client:
    KMSClient;

  /**
   * @param keyId  - KMS key ID or ARN of the signing key.
   * @param region - AWS region where the key is hosted (default: `"us-east-1"`).
   */
  constructor(
    private readonly keyId: string,
    region = "us-east-1"
  ) {

    this.client =
      new KMSClient({
        region,
      });
  }

  /**
   * Signs `payload` (raw bytes, UTF-8 encoded) using ECDSA_SHA_256 via KMS
   * and returns a base64-encoded DER signature.
   * @throws When KMS returns an empty or undefined `Signature`.
   */
  async sign(
    payload: string
  ): Promise<string> {

    const command =
      new SignCommand({
        KeyId:
          this.keyId,

        Message:
          Buffer.from(
            payload
          ),

        SigningAlgorithm:
          "ECDSA_SHA_256",

        MessageType:
          "RAW",
      });

    const result =
      await this.client.send(
        command
      );

    if (
      !result.Signature
    ) {
      throw new Error(
        "KMS signing failed"
      );
    }

    return Buffer.from(
      result.Signature
    ).toString(
      "base64"
    );
  }
}




