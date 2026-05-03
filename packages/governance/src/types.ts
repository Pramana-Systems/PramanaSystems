/** Outcome of a {@link generateBundle} call. */
export interface BundleGenerationResult {
  /** `true` when the manifest was generated and signed successfully. */
  success: boolean;

  /** Absolute path of the written `bundle.manifest.json` file. */
  manifest_path: string;

  /** Absolute path of the written `bundle.sig` file. */
  signature_path: string;

  /** Deterministic bundle hash embedded in the manifest. */
  bundle_hash: string;
}

/** A single rule within a {@link PolicyDefinition}. */
export interface PolicyRule {
  /** Unique rule identifier. */
  id: string;

  /** Condition expression that must evaluate to true for the rule to apply. */
  condition: string;

  /** Action to take when the condition is satisfied. */
  action: string;
}

/**
 * An in-memory policy definition constructed by {@link definePolicy} before
 * being serialized and passed to {@link generateBundle}.
 */
export interface PolicyDefinition {
  /** Policy identifier. */
  id: string;

  /** Semantic version string (e.g. `"v1"`). */
  version: string;

  /** Ordered list of rules that make up the policy. */
  rules: PolicyRule[];
}




