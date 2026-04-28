import {
  describe,
  expect,
  test,
} from "vitest";

import {
  issueExecutionToken,
  signExecutionToken,
  executeDecision,
} from "@manthan/runtime";

describe(
  "replay protection",
  () => {
    test(
      "same token cannot execute twice",
      () => {
        const token =
          issueExecutionToken(
            "claims-approval",
            "v1",
            "approve-claim",
            "signals-hash-example"
          );

        const signature =
          signExecutionToken(
            token
          );

        executeDecision(
          token,
          signature
        );

        expect(() =>
          executeDecision(
            token,
            signature
          )
        ).toThrow(
          "Replay attack detected"
        );
      }
    );
  }
);