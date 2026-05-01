#!/usr/bin/env node

import fs from "node:fs";

console.log("");
console.log("PramanaSystems Verifier CLI");
console.log("");

const command = process.argv[2];

switch (command) {
  case "verify-attestation": {
    const file = process.argv[3];

    if (!file) {
      console.log(
        "Usage: pramanasystems-verifier verify-attestation <file>"
      );

      process.exit(1);
    }

    if (!fs.existsSync(file)) {
      console.log("Attestation file not found.");
      process.exit(1);
    }

    try {
      const content =
        fs.readFileSync(file, "utf8");

      const parsed =
        JSON.parse(content);

      console.log("");
      console.log("ATTESTATION:");
      console.log(parsed);

      if (
        !parsed.decision ||
        !parsed.policyVersion
      ) {
        throw new Error(
          "Invalid attestation structure."
        );
      }

      console.log("");
      console.log(
        "Attestation verification succeeded."
      );

    } catch (err) {
      console.log("");
      console.log(
        "Attestation verification failed."
      );

      console.log(
        err instanceof Error
          ? err.message
          : String(err)
      );

      process.exit(1);
    }

    break;
  }

  case "verify-runtime":
    console.log("Runtime verification placeholder.");
    break;

  case "verify-release":
    console.log("Release verification placeholder.");
    break;

  case "verify-compatibility":
    console.log("Compatibility verification placeholder.");
    break;

  default:
    console.log("Unknown command.");
}