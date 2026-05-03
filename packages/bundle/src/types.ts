import type {
  RuntimeRequirements,
} from "./runtime-requirements";

/** A single file artifact tracked by a BundleManifest, identified by its relative path and SHA-256 hash. */
export interface BundleArtifact {
  /** Normalized POSIX-style path relative to the bundle directory. */
  path: string;

  /** SHA-256 hex digest of the canonical file content. */
  hash: string;
}

/**
 * Signed, content-addressed manifest describing all artifacts in a policy bundle.
 * The `bundle_hash` is a SHA-256 commitment over the full manifest (with `bundle_hash`
 * zeroed), making the manifest self-verifying.
 */
export interface BundleManifest {
  /** Manifest format version. Currently `"1"`. */
  manifest_version: string;

  /** Policy identifier this bundle belongs to. */
  policy_id: string;

  /** Policy version string (e.g. `"v1"`). */
  policy_version: string;

  /** Ordered list of all content-addressed artifacts in the bundle. */
  artifacts: BundleArtifact[];

  /** Runtime capability and version constraints required to execute this bundle. */
  runtime_requirements: RuntimeRequirements;

  /**
   * SHA-256 hex digest of the canonical manifest with `bundle_hash` set to `""`.
   * A tamper-evident commitment over all artifact hashes and metadata.
   */
  bundle_hash: string;
}

/** Result returned by {@link verifyManifest}, including the expected and actual bundle hashes. */
export interface VerifyResult {
  /** `true` when the re-computed bundle hash matches the manifest commitment. */
  valid: boolean;

  /** The bundle hash stored in the manifest (expected value). */
  expected_bundle_hash: string;

  /** The bundle hash re-computed from the directory contents (actual value). */
  actual_bundle_hash: string;
}




