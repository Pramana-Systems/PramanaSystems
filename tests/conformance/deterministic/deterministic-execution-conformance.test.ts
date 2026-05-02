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
  "Deterministic Execution Conformance",
  () => {

    test(
      "equivalent governed inputs produce equivalent deterministic outcomes",
      () => {

        const firstToken = {
          ...executionContext.token,

          execution_id:
            "deterministic-a",
        };

        const first =
          executeDecision({
            ...executionContext,

            token:
              firstToken,

            token_signature:
              signExecutionToken(
                firstToken,
                signer
              ),
          });

        const secondToken = {
          ...executionContext.token,

          execution_id:
            "deterministic-b",
        };

        const second =
          executeDecision({
            ...executionContext,

            token:
              secondToken,

            token_signature:
              signExecutionToken(
                secondToken,
                signer
              ),
          });

        expect(
          first.result.policy_id
        ).toBe(
          second.result.policy_id
        );

        expect(
          first.result.policy_version
        ).toBe(
          second.result.policy_version
        );

        expect(
          first.result.decision
        ).toBe(
          second.result.decision
        );

        expect(
          first.result.signals_hash
        ).toBe(
          second.result.signals_hash
        );

        expect(
          first.result.runtime_version
        ).toBe(
          second.result.runtime_version
        );
      }
    );
  }
);



