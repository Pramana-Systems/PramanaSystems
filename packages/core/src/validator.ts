import { canonicalize } from "./canonicalize";

import {
  assertNoOperationalMetadata
} from "./invariants";

import {
  forbiddenDeterministicFields
} from "./deterministic-policy";

import {
  ValidatorConfig
} from "./types/validator-config";

import { ValidationResult } from "./types/validation";

import { SignedEnvelope } from "./types/envelope";

/**
 * Multi-stage validator for {@link SignedEnvelope} values.
 *
 * Runs up to five sequential checks (structure → canonical → deterministic →
 * metadata isolation → cryptographic) and returns a detailed
 * {@link ValidationResult} with per-stage flags and error messages.
 *
 * **Note:** the `cryptographic` stage is not yet implemented and always returns
 * `false`, so `valid` is always `false`.  Use `@pramanasystems/verifier` for
 * cryptographic attestation verification.
 */
export class LocalValidator {

  private readonly config:
    ValidatorConfig;

  /**
   * @param config - Optional override for {@link ValidatorConfig}.
   *   Defaults to using {@link forbiddenDeterministicFields}.
   */
  constructor(
    config: ValidatorConfig = {}
  ) {
    this.config = {
      forbiddenDeterministicFields,
      ...config
    };
  }

  private extractDeterministicPayload(
    envelope: SignedEnvelope<unknown>
  ): unknown {
    return envelope.payload;
  }

  /** Returns `true` when `envelope` has `payload` (any value) and `signature` (string). */
  validateStructure(
    envelope: SignedEnvelope<unknown>
  ): boolean {

    return (
      typeof envelope === "object" &&
      envelope !== null &&
      "payload" in envelope &&
      "signature" in envelope &&
      typeof envelope.signature === "string"
    );
  }

  /** Returns `true` when `payload` can be serialized through the canonical JSON pipeline without error. */
  validateCanonical(
    payload: unknown
  ): boolean {

    try {

      canonicalize(payload);

      return true;

    } catch {

      return false;
    }
  }

  /**
   * Returns `true` when the canonical form of the payload alone equals the
   * canonical form of `{ payload }`, confirming that no metadata fields have
   * leaked into the deterministic signing scope.
   */
  validateMetadataIsolation(
    envelope: SignedEnvelope<unknown>
  ): boolean {

    try {

      const canonicalPayload =
        canonicalize(
          this.extractDeterministicPayload(
            envelope
          )
        );

      const canonicalEnvelope =
        canonicalize({
          payload:
            this.extractDeterministicPayload(
              envelope
            )
        });

      return (
        canonicalPayload ===
        canonicalEnvelope
      );

    } catch {

      return false;
    }
  }

  /**
   * Runs all five validation stages against `envelope` and returns a
   * {@link ValidationResult} with per-stage flags and accumulated error messages.
   */
  validate(
    envelope: SignedEnvelope<unknown>
  ): ValidationResult {

    const structure =
      this.validateStructure(
        envelope
      );

    const canonical =
      structure &&
      this.validateCanonical(
        envelope.payload
      );

    const deterministic =
      structure &&
      assertNoOperationalMetadata(
        envelope.payload,
        this.config
          .forbiddenDeterministicFields ??
          []
      );

    const metadataIsolation =
      structure &&
      this.validateMetadataIsolation(
        envelope
      );

    const cryptographic =
      false;

    const errors: string[] =
      [];

    if (!structure) {
      errors.push(
        "Invalid structure."
      );
    }

    if (!canonical) {
      errors.push(
        "Canonicalization validation failed."
      );
    }

    if (!deterministic) {
      errors.push(
        "Operational metadata contamination detected."
      );
    }

    if (!metadataIsolation) {
      errors.push(
        "Metadata isolation validation failed."
      );
    }

    return {
      valid:
        structure &&
        canonical &&
        deterministic &&
        metadataIsolation &&
        cryptographic,

      verified:
        cryptographic,

      stages: {
        structure,
        canonical,
        deterministic,
        metadataIsolation,
        cryptographic
      },

      errors
    };
  }
}