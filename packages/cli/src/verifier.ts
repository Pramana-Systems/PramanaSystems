import fs from "fs";

import {
  verifyExecutionResult,
} from "@manthan/runtime";

interface ExecutionAttestation {
  result: unknown;

  signature: string;
}

export function verifyAttestationFile(
  filePath: string
): void {
  const raw =
    fs.readFileSync(
      filePath,
      "utf8"
    );

  const attestation =
    JSON.parse(
      raw
    ) as ExecutionAttestation;

  const valid =
    verifyExecutionResult(
      attestation.result as never,
      attestation.signature
    );

  if (!valid) {
    console.error(
      "INVALID ATTESTATION"
    );

    process.exit(1);
  }

  console.log(
    "VALID ATTESTATION"
  );
}