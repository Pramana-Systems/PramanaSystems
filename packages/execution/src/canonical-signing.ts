import {
  canonicalize,
} from "@pramanasystems/bundle";

export function canonicalizeForSigning(
  value: unknown
): string {

  return canonicalize(value);
}




