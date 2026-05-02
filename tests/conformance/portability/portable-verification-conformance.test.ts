import {
  describe,
  expect,
  test,
} from "vitest";

import {
  executeDecision,
  verifyExecutionResult,
} from "@pramanasystems/core";

import {
  signExecutionToken,
} from "@pramanasystems/execution";

import {
  executionContext,
  signer,
} from "../../fixtures/execution-context-fixture";

describe(
  "Portable Verification Conformance",
  () => {

    test(
      "execution artifacts remain independently verifiable",
      () => {

        const token = {
          ...executionContext.token,

          execution_id:
            "portable-verification-1",
        };

        const context = {
          ...executionContext,

          token,

          token_signature:
            signExecutionToken(
              token,
              signer
            ),
        };

        const execution =
          executeDecision(
            context
          );

        const verified =
          verifyExecutionResult(
            execution.result,
            execution.signature,
            executionContext.verifier
          );

        expect(
          verified
        ).toBe(
          true
        );
      }
    );
  }
);



