import crypto from "crypto";

/** Returns the SHA-256 hex digest of `content` (interpreted as UTF-8). */
export function sha256(content: string): string {
  return crypto
    .createHash("sha256")
    .update(content, "utf8")
    .digest("hex");
}




