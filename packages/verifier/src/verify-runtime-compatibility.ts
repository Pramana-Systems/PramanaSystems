import type {
  RuntimeManifest,
} from "@pramanasystems/execution";

import type {
  RuntimeRequirements,
} from "@pramanasystems/governance";

/**
 * Full compatibility result produced by {@link verifyRuntimeCompatibility}.
 * Separates capability gaps from version incompatibilities so each dimension
 * can be reported or acted on independently.
 */
export interface RuntimeCompatibilityResult {
  /** `true` when the runtime satisfies all capability, version, and schema requirements. */
  valid: boolean;

  /** Capability strings required by the bundle but absent from the runtime. */
  missing_capabilities: string[];

  /** `true` when the runtime version is not in `requirements.supported_runtime_versions`. */
  unsupported_runtime_version: boolean;

  /**
   * `true` when none of the schema versions supported by the runtime appear in
   * `requirements.supported_schema_versions`.
   */
  unsupported_schema_version: boolean;
}

/**
 * Performs a comprehensive compatibility check between a runtime manifest and
 * the requirements declared by a bundle.  Checks capabilities, runtime version,
 * and schema version overlap in a single pass.
 *
 * Use this before issuing an execution token to surface all incompatibilities
 * at once rather than discovering them one at a time.
 *
 * @param manifest     - The runtime manifest to evaluate.
 * @param requirements - The bundle's declared runtime requirements.
 */
export function verifyRuntimeCompatibility(
  manifest: RuntimeManifest,
  requirements: RuntimeRequirements
): RuntimeCompatibilityResult {

  const missingCapabilities =
    requirements.required_capabilities.filter(
      capability =>
        !manifest.capabilities.includes(
          capability
        )
    );

  const unsupportedRuntime =
    !requirements.supported_runtime_versions.includes(
      manifest.runtime_version
    );

  const unsupportedSchema =
    requirements.supported_schema_versions.every(
      (
        schemaVersion
      ) =>
        !manifest.supported_schema_versions.includes(
          schemaVersion
        )
    );

  return {
    valid:
      missingCapabilities.length === 0 &&
      !unsupportedRuntime &&
      !unsupportedSchema,

    missing_capabilities:
      missingCapabilities,

    unsupported_runtime_version:
      unsupportedRuntime,

    unsupported_schema_version:
      unsupportedSchema,
  };
}




