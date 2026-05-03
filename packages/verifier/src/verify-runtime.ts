import type {
  RuntimeManifest,
} from "@pramanasystems/execution";

/** Result of verifying that a runtime manifest declares a required set of capabilities. */
export interface RuntimeVerificationResult {
  /** `true` when the runtime declares all required capabilities. */
  valid: boolean;

  /** Capability strings that are required but not declared by the runtime. */
  missing_capabilities: string[];
}

/**
 * Checks that `manifest.capabilities` contains every entry in `requiredCapabilities`.
 *
 * @param manifest             - The runtime manifest to check.
 * @param requiredCapabilities - The capability strings that must be present.
 */
export function verifyRuntime(
  manifest: RuntimeManifest,
  requiredCapabilities: string[]
): RuntimeVerificationResult {

  const missing =
    requiredCapabilities.filter(
      capability =>
        !manifest.capabilities.includes(
          capability
        )
    );

  return {
    valid:
      missing.length === 0,

    missing_capabilities:
      missing,
  };
}




