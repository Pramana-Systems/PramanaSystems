/**
 * Async variant of {@link Signer} for remote key providers (e.g. AWS KMS).
 * The returned promise resolves to a base64-encoded signature.
 * See {@link AwsKmsSigner} for the AWS KMS implementation.
 */
export interface AsyncSigner {
  /** Signs the canonical UTF-8 `payload` and resolves to a base64-encoded signature. */
  sign(payload: string): Promise<string>;
}




