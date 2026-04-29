import {
  describe,
  expect,
  test,
} from "vitest";

import {
  verifyAuditChain,
} from "@manthan/execution";

describe(
  "audit chain integrity",
  () => {
    test(
      "audit chain remains valid",
      () => {
        const valid =
          verifyAuditChain();

        expect(valid)
          .toBe(true);
      }
    );
  }
);