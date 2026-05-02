import {
  describe,
  expect,
  test,
} from "vitest";

import {
  executeDecision,
} from "@pramanasystems/core";

import {
  signExecutionToken,
} from "@pramanasystems/execution";

import {
  executionContext,
  signer,
} from "../../fixtures/execution-context-fixture";

describe(
  "Attestation Lineage Conformance",
  () => {

    test(
      "execution attestations preserve governance lineage",
      () => {

        const token = {
          ...executionContext.token,

          execution_id:
            "attestation-lineage-1",
        };

        const execution =
          executeDecision({
            ...executionContext,

            token,

            token_signature:
              signExecutionToken(
                token,
                signer
              ),
          });

        expect(
          execution.result.execution_id
        ).toBe(
          "attestation-lineage-1"
        );

        expect(
          execution.result.policy_id
        ).toBe(
          "policy-1"
        );

        expect(
          execution.result.policy_version
        ).toBe(
          "1.0.0"
        );

        expect(
          execution.result.runtime_version
        ).toBe(
          "1.0.0"
        );

        expect(
          execution.signature
        ).toBeTruthy();
      }
    );
  }
);



