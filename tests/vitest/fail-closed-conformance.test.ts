import {
  describe,
  expect,
  test,
} from "vitest";

import {
  executeDecision,
} from "@manthan/core";

import {
  executionContext,
} from "./execution-context-fixture";

describe(
  "Fail-Closed Conformance",
  () => {

    test(
      "invalid governance execution fails closed",
      () => {

        expect(() =>
          executeDecision({
            ...executionContext,

            token:
              undefined as any,
          })
        ).toThrow();
      }
    );
  }
);