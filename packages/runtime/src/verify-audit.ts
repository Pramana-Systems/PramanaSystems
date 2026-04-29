import crypto from "crypto";

import fs from "fs";

import path from "path";

const auditFile =
  path.resolve(
    "./runtime-audit/executions.jsonl"
  );

function hashRecord(
  record: unknown
): string {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify(
        record
      )
    )
    .digest("hex");
}

export function verifyAuditChain():
  boolean {

  if (
    !fs.existsSync(
      auditFile
    )
  ) {
    return true;
  }

  const content =
    fs.readFileSync(
      auditFile,
      "utf8"
    );

  const trimmed =
    content.trim();

  if (
    trimmed.length === 0
  ) {
    return true;
  }

  const lines =
    trimmed.split("\n");

  let previousHash =
    "GENESIS";

  for (const line of lines) {

    const record =
      JSON.parse(line);

    if (
      record.previous_record_hash !==
      previousHash
    ) {
      return false;
    }

    previousHash =
      hashRecord(
        record
      );
  }

  return true;
}