import {
  describe,
  expect,
  test,
} from "vitest";

import {
  issueExecutionToken,

  signExecutionToken,

  executeDecision,

  verifyExecutionResult,
} from "@manthan/runtime";

describe(
  "execution attestation verification",
  () => {
    test(
      "signed execution attestation verifies",
      () => {
        const token =
          issueExecutionToken(
            "claims-approval",
            "v1",
            "approve-claim",
            "signals-hash-example"
          );

        const tokenSignature =
          signExecutionToken(
            token
          );

        const attestation =
          executeDecision(
            token,
            tokenSignature
          );

        const valid =
          verifyExecutionResult(
            attestation.result,
            attestation.signature
          );

        expect(valid)
          .toBe(true);
      }
    );
  }
);