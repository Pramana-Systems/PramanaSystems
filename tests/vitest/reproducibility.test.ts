import path from "path";

import {
  describe,
  expect,
  test,
} from "vitest";

import {
  readManifest,
} from "@manthan/bundle";

import {
  generateBundle,
} from "@manthan/governance";

const policyDirectory =
  path.resolve(
    "./policies/claims-approval/v1"
  );

describe(
  "deterministic reproducibility",
  () => {
    test(
      "same policy generates identical bundle hash",
      () => {
        generateBundle(
          "claims-approval",
          "v1",
          policyDirectory
        );

        const manifest1 =
          readManifest(
            policyDirectory
          );

        generateBundle(
          "claims-approval",
          "v1",
          policyDirectory
        );

        const manifest2 =
          readManifest(
            policyDirectory
          );

        expect(
          manifest1.bundle_hash
        ).toBe(
          manifest2.bundle_hash
        );
      }
    );
  }
);