import {
  hashRuntime,
  runtimeManifestDefinition,
} from "./hash-runtime";

export interface RuntimeManifest {
  runtime_version: string;

  runtime_hash: string;

  supported_schema_versions: readonly string[];

  capabilities: readonly string[];
}

export function getRuntimeManifest(): RuntimeManifest {

  return {
    runtime_hash:
      hashRuntime(),
    ...runtimeManifestDefinition,
  };
}