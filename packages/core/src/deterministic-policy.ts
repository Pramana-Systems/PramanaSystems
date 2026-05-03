/**
 * Field names that must not appear inside a deterministic payload.
 *
 * These are operational-metadata fields that introduce non-determinism
 * (timestamps, hostnames, trace IDs, deployment context) and would break
 * reproducible verification if present in the signed payload scope.
 *
 * Used as the default for {@link ValidatorConfig.forbiddenDeterministicFields}.
 */
export const forbiddenDeterministicFields = [
  "generatedAt",
  "environment",
  "host",
  "runtime",
  "traceId"
] as const;