import {
  canonicalize,
} from "@pramanasystems/bundle";

/**
 * Returns the canonical JSON string for `value` as used by all signing and
 * verification operations in the execution package.  Delegates to the bundle
 * package's `canonicalize` so the representation is consistent across packages.
 */
export function canonicalizeForSigning(
  value: unknown
): string {

  return canonicalize(value);
}




