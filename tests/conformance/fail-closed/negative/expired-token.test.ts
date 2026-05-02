import {
  describe,
  expect,
  test,
} from "vitest";

import {
  executeDecision,
  MemoryReplayStore,
  signExecutionToken,
} from "@pramanasystems/execution";

import {
  executionContext,
  signer,
} from "../../../fixtures/execution-context-fixture";

describe(
  "Expired Token Negative Conformance",
  () => {
    test(
      "expired execution tokens fail closed",
      () => {

        const replayStore =
          new MemoryReplayStore();

        const token = {
          ...executionContext.token,

          expires_at:
            new Date(
              Date.now() - 60000
            ).toISOString(),
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

        expect(() =>
          executeDecision(
            context,
            replayStore
          )
        ).toThrow(
          "Execution token expired"
        );
      }
    );
  }
);



