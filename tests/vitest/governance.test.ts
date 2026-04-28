import path from "path";

import {
  describe,
  expect,
  test,
} from "vitest";

import {
  generateBundle,
  validatePolicy,
} from "@manthan/governance";

describe(
  "governance validation",
  () => {
    test(
      "valid policy lineage passes validation",
      () => {
        const v1Directory =
          path.resolve(
            "./policies/claims-approval/v1"
          );

        const v2Directory =
          path.resolve(
            "./policies/claims-approval/v2"
          );

        generateBundle(
          "claims-approval",
          "v1",
          v1Directory
        );

        generateBundle(
          "claims-approval",
          "v2",
          v2Directory
        );

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