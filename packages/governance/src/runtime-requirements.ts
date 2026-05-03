/**
 * Capability and version constraints that a runtime must satisfy before it is
 * permitted to execute a bundle.  Stored inside every {@link BundleManifest}
 * and re-validated at execution time.
 */
export interface RuntimeRequirements {
  /** Runtime capability strings that must appear in the executing runtime's capability list. */
  required_capabilities: string[];

  /** Runtime version strings (e.g. `"1.0.0"`) acceptable to this bundle. */
  supported_runtime_versions: string[];

  /** Schema version strings (e.g. `"1.0.0"`) that this bundle's artifacts conform to. */
  supported_schema_versions: string[];
}




