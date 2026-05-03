import {
  hashRuntime,
  runtimeManifestDefinition,
} from "./hash-runtime";

/**
 * Static description of the governance runtime's identity, capabilities, and
 * supported protocol versions.
 *
 * Included in every {@link ExecutionResult} so verifiers can confirm the
 * runtime environment without trusting the operator.  The `runtime_hash`
 * field is a deterministic SHA-256 commitment over the manifest definition,
 * binding the result to a specific runtime build.
 */
export interface RuntimeManifest {
  /** Semantic version of the governance runtime (e.g. `"1.0.0"`). */
  runtime_version: string;

  /** SHA-256 hex hash of the canonical runtime manifest definition. */
  runtime_hash: string;

  /** Schema version strings that this runtime can process. */
  supported_schema_versions: readonly string[];

  /** Capability strings advertised by this runtime (e.g. `"replay-protection"`). */
  capabilities: readonly string[];
}

/**
 * Returns the active {@link RuntimeManifest} for the current process,
 * combining the static manifest definition with a freshly computed `runtime_hash`.
 */
export function getRuntimeManifest(): RuntimeManifest {

  return {
    runtime_hash:
      hashRuntime(),
    ...runtimeManifestDefinition,
  };
}