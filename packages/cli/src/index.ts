#!/usr/bin/env node

import {
  createPolicy,
  upgradePolicy,
  validatePolicy,
} from "@manthan/governance";

function main(): void {
  try {
    const [
      ,
      ,
      domain,
      command,
      policyId,
    ] = process.argv;

    if (domain !== "governance") {
      throw new Error(
        "Unknown domain"
      );
    }

    if (!policyId) {
      throw new Error(
        "Policy ID required"
      );
    }

    switch (command) {
      case "create-policy": {
        const result =
          createPolicy(policyId);

        console.log(
          JSON.stringify(
            {
              success: true,
              created: result,
            },
            null,
            2
          )
        );

        return;
      }

      case "upgrade-policy": {
        const result =
          upgradePolicy(policyId);

        console.log(
          JSON.stringify(
            {
              success: true,
              upgraded: result,
            },
            null,
            2
          )
        );

        return;
      }

      case "validate-policy": {
        const result =
          validatePolicy(policyId);

        console.log(
          JSON.stringify(
            {
              success: result,
            },
            null,
            2
          )
        );

        if (!result) {
          process.exit(1);
        }

        return;
      }

      default:
        throw new Error(
          `Unknown command: ${command}`
        );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    console.error(
      JSON.stringify(
        {
          success: false,
          error: message,
        },
        null,
        2
      )
    );

    process.exit(1);
  }
}

main();