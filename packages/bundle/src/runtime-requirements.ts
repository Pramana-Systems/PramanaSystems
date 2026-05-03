/** Capability and version constraints that a runtime must satisfy to execute a bundle. */
export interface RuntimeRequirements {
  /** Runtime capability strings that must appear in the executing runtime's capability list (e.g. `"replay-protection"`). */
  required_capabilities: string[];

  /** Runtime version strings (e.g. `"1.0.0"`) that are acceptable to the bundle. */
  supported_runtime_versions: string[];

  /** Schema version strings (e.g. `"1.0.0"`) that the bundle's artifacts conform to. */
  supported_schema_versions: string[];
}




