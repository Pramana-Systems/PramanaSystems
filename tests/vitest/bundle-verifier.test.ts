import {
  describe,
  expect,
  test,
} from "vitest";

import {
  verifyBundle,
} from "@manthan/verifier";

describe(
  "bundle verifier",
  () => {

    test(
      "valid governance bundle verifies",
      () => {

        const result =
          verifyBundle(
            "./tests/bundle-example/bundle.manifest.json",
            "./tests/bundle-example/bundle.sig"
          );

        expect(result.valid)
          .toBe(true);
      }
    );
  }
);