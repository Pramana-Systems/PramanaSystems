export interface BundleArtifact {
  path: string;
  hash: string;
}

export interface BundleManifest {
  manifest_version: string;

  policy_id: string;
  policy_version: string;

  artifacts: BundleArtifact[];

  bundle_hash: string;
}

export interface VerifyResult {
  valid: boolean;

  expected_bundle_hash: string;

  actual_bundle_hash: string;
}