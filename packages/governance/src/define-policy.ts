import type {
  PolicyDefinition,
  PolicyRule,
} from "./types";

/**
 * Constructs a {@link PolicyDefinition} from a plain config object.
 * Use this as the first step in the policy-authoring pipeline before
 * serializing the policy to disk and calling {@link generateBundle}.
 *
 * @param config - Policy id, version, and rules.
 */
export function definePolicy(config: {
  id: string;
  version: string;
  rules: PolicyRule[];
}): PolicyDefinition {

  return {
    id: config.id,

    version: config.version,

    rules: config.rules,
  };
}
