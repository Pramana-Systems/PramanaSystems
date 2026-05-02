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
  "Replay Conformance",
  () => {

    test(
      "identical execution identifiers cannot execute twice",
      () => {

        const replayStore = {
          store:
            new Set<string>(),

          hasExecuted(
            id: string
          ) {
            return this.store.has(
              id
            );
          },

          markExecuted(
            id: string
          ) {
            this.store.add(
              id
            );
          },
        };

        const token = {
          ...executionContext.token,

          execution_id:
            "conformance-replay-1",
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

        const first =
          executeDecision(
            context,
            replayStore
          );

        expect(
          first.result.execution_id
        ).toBe(
          "conformance-replay-1"
        );

        expect(() =>
          executeDecision(
            context,
            replayStore
          )
        ).toThrow(
          "Replay attack detected"
        );
      }
    );
  }
);



