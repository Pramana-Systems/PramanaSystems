import fs from "fs";
import child_process from "child_process";

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  test,
} from "vitest";

const backupFiles = new Map<
  string,
  string | null
>();

for (
  const file of [
    "release-manifest.json",
    "rebuild-attestation.json",
  ]
) {
  backupFiles.set(
    file,
    fs.existsSync(file)
      ? fs.readFileSync(
          file,
          "utf8"
        )
      : null
  );
}

function restoreBackups() {
  for (
    const [file, content] of
    backupFiles
  ) {
    if (
      content === null
    ) {
      if (
        fs.existsSync(file)
      ) {
        fs.rmSync(
          file,
          {
            force: true,
          }
        );
      }
      continue;
    }

    fs.writeFileSync(
      file,
      content,
      "utf8"
    );
  }
}

describe(
  "release reproducibility",
  () => {
    beforeAll(() => {
      child_process.execSync(
        "npm run pack:packages",
        {
          stdio: "pipe",
        }
      );
    });

    afterAll(() => {
      restoreBackups();
    });

    test(
      "release manifest and rebuild attestation are deterministic across reruns",
      () => {
        child_process.execSync(
          "npm run release:manifest",
          {
            stdio: "pipe",
          }
        );

        child_process.execSync(
          "npm run release:attest",
          {
            stdio: "pipe",
          }
        );

        const firstManifest =
          fs.readFileSync(
            "release-manifest.json",
            "utf8"
          );

        const firstAttestation =
          fs.readFileSync(
            "rebuild-attestation.json",
            "utf8"
          );

        child_process.execSync(
          "npm run release:manifest",
          {
            stdio: "pipe",
          }
        );

        child_process.execSync(
          "npm run release:attest",
          {
            stdio: "pipe",
          }
        );

        expect(
          fs.readFileSync(
            "release-manifest.json",
            "utf8"
          )
        ).toBe(
          firstManifest
        );

        expect(
          fs.readFileSync(
            "rebuild-attestation.json",
            "utf8"
          )
        ).toBe(
          firstAttestation
        );
      }
    );
  }
);
