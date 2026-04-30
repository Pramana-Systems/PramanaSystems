import {
  describe,
  expect,
  test,
} from "vitest";

import {
  validatePolicy,
} from "@manthan/governance";

describe(
  "governance validation",
  () => {
    test(
      "valid policy lineage passes validation",
      () => {
        const valid =
          validatePolicy(
            "claims-approval"
          );

        expect(valid)
          .toBe(true);
      }
    );
  }
);