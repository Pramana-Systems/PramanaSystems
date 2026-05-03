import {
  validatePolicy,
} from "@pramanasystems/governance";

/**
 * Validates that `policyId` passes full bundle and signature verification.
 * Delegates to {@link validatePolicy} and throws if validation fails.
 *
 * @throws When the policy does not exist or any version fails verification.
 */
export function verifyRuntimePolicy(
  policyId: string
): void {
  const valid =
    validatePolicy(
      policyId
    );

  if (!valid) {
    throw new Error(
      `Runtime verification failed for policy: ${policyId}`
    );
  }
}




