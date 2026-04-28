import fs from "fs";
import path from "path";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";

import {
  readManifest,
  verifyManifest,
} from "@manthan/bundle";

import {
  generateBundle,
} from "@manthan/governance";

import {
  readSignature,
  verifySignature,
} from "@manthan/crypto";

const policyDirectory =
  path.resolve(
    "./policies/claims-approval/v1"
  );

const policyFile =
  path.join(
    policyDirectory,
    "policy.json"
  );

let originalContent = "";

describe(
  "signature invalidation",
  () => {
    beforeEach(() => {
      originalContent =
        fs.readFileSync(
          policyFile,
          "utf8"
        );

      generateBundle(
        "claims-approval",
        "v1",
        policyDirectory
      );
    });

    afterEach(() => {
      fs.writeFileSync(
        policyFile,
        originalContent,
        "utf8"
      );

      generateBundle(
        "claims-approval",
        "v1",
        policyDirectory
      );
    });

    test(
      "modified bundle invalidates manifest integrity",
      () => {
        const manifest =
          readManifest(
            policyDirectory
          );

        const signature =
          readSignature(
            policyDirectory
          );

        const initialValid =
          verifySignature(
            manifest,
            signature
          );

        expect(initialValid)
          .toBe(true);

        fs.writeFileSync(
          policyFile,

          JSON.stringify(
            {
              policy:
                "claims-approval",

              version:
                "mutated"
            },
            null,
            2
          ),

          "utf8"
        );

        const mutatedManifest =
          readManifest(
            policyDirectory
          );

        const manifestResult =
          verifyManifest(
            mutatedManifest,
            policyDirectory
          );

        expect(
          manifestResult.valid
        ).toBe(false);
      }
    );
  }
);