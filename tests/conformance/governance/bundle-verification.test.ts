import fs from "fs";
import os from "os";
import path from "path";

import {
  afterEach,
  describe,
  expect,
  test,
} from "vitest";

import {
  verifyBundle,
} from "@pramanasystems/verifier";

const temporaryDirectories:
  string[] = [];

function createBundleCopy(
  sourceDirectory: string
): string {
  const targetDirectory =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "pramanasystems-bundle-"
      )
    );

  temporaryDirectories.push(
    targetDirectory
  );

  fs.cpSync(
    sourceDirectory,
    targetDirectory,
    {
      recursive: true,
    }
  );

  return targetDirectory;
}

afterEach(() => {
  for (
    const directory of
    temporaryDirectories.splice(0)
  ) {
    fs.rmSync(
      directory,
      {
        recursive: true,
        force: true,
      }
    );
  }
});

describe(
  "bundle verification",
  () => {
    test(
      "signed bundle verifies against artifacts",
      () => {
        const directory =
          createBundleCopy(
            path.resolve(
              "policies/claims-approval/v1"
            )
          );

        const result =
          verifyBundle(
            path.join(
              directory,
              "bundle.manifest.json"
            ),
            path.join(
              directory,
              "bundle.sig"
            )
          );

        expect(result.valid)
          .toBe(true);

        expect(
          result.signature_verified
        ).toBe(true);

        expect(
          result.bundle_verified
        ).toBe(true);
      }
    );

    test(
      "tampered bundle fails verification",
      () => {
        const directory =
          createBundleCopy(
            path.resolve(
              "policies/claims-approval/v1"
            )
          );

        fs.writeFileSync(
          path.join(
            directory,
            "policy.json"
          ),
          JSON.stringify(
            {
              policy:
                "claims-approval",
              version: "v1",
              tampered: true,
            },
            null,
            2
          ),
          "utf8"
        );

        const result =
          verifyBundle(
            path.join(
              directory,
              "bundle.manifest.json"
            ),
            path.join(
              directory,
              "bundle.sig"
            )
          );

        expect(result.valid)
          .toBe(false);

        expect(
          result.bundle_verified
        ).toBe(false);
      }
    );
  }
);
