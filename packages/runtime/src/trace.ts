import crypto from "crypto";

export function
resolveTraceId(
  provided?: string
): string {
  if (provided) {
    return provided;
  }

  return crypto.randomUUID();
}