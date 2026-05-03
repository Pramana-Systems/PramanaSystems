import crypto from "crypto";

import fs from "fs";

import path from "path";

import {
  canonicalize
} from "@pramanasystems/core";

import type {
  ExecutionToken,
} from "./execution-token";

const auditDirectory =
  path.resolve(
    "./runtime-audit"
  );

const auditFile =
  path.join(
    auditDirectory,
    "executions.jsonl"
  );

function hashRecord(
  record: unknown
): string {
  return crypto
    .createHash("sha256")
    .update(
      canonicalize(
        record
      )
    )
    .digest("hex");
}

function getLastRecordHash():
  string {

  if (
    !fs.existsSync(
      auditFile
    )
  ) {
    return "GENESIS";
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
    return "GENESIS";
  }

  const lines =
    trimmed.split("\n");

  const lastLine =
    lines[
      lines.length - 1
    ];

  const parsed =
    JSON.parse(
      lastLine
    );

  return hashRecord(
    parsed
  );
}

/**
 * Appends a hash-chained audit record for `token` to `./runtime-audit/executions.jsonl`.
 *
 * Each record includes a `previous_record_hash` field (SHA-256 of the prior JSONL
 * entry, or `"GENESIS"` for the first record), creating an append-only chain that
 * makes undetected record deletion or insertion infeasible.
 *
 * The audit directory is created on first write if it does not exist.
 *
 * @param token - The execution token being recorded.
 */
export function appendAuditRecord(
  token: ExecutionToken
): void {

  if (
    !fs.existsSync(
      auditDirectory
    )
  ) {
    fs.mkdirSync(
      auditDirectory,
      {
        recursive: true,
      }
    );
  }

  const record = {
    previous_record_hash:
      getLastRecordHash(),

    execution_id:
      token.execution_id,

    policy_id:
      token.policy_id,

    policy_version:
      token.policy_version,

    decision_type:
      token.decision_type,

    bundle_hash:
      token.bundle_hash,

    signals_hash:
      token.signals_hash,

    issued_at:
      token.issued_at,

    expires_at:
      token.expires_at,

    executed_at:
      new Date()
        .toISOString(),
  };

  fs.appendFileSync(
    auditFile,

    JSON.stringify(
      record
    ) + "\n",

    "utf8"
  );
}