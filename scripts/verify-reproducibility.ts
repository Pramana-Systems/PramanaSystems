import fs from "fs";

import crypto from "crypto";

import path from "path";

import child_process from "child_process";

import {
  canonicalize,
} from "@pramanasystems/bundle";

function sha256Bytes(
  bytes: Uint8Array
): string {
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

function sha256File(
  filePath: string
): string {
  return sha256Bytes(
    fs.readFileSync(
      filePath
    )
  );
}

function buildExpectedManifest() {
  const packages = [
    "bundle",
    "crypto",
    "governance",
    "execution",
    "verifier",
    "core",
    "verifier-cli",
  ];

  return {
    manifest_version:
      "1.0.0",

    artifacts:
      packages.map((pkg) => {
        const packageManifest =
          JSON.parse(
            fs.readFileSync(
              path.join(
                "packages",
                pkg,
                "package.json"
              ),
              "utf8"
            )
          ) as {
            name: string;
            version: string;
          };

        const artifact =
          `${packageManifest.name
            .replace(/^@/, "")
            .replace(/\//g, "-")}-${packageManifest.version}.tgz`;

        return {
          package:
            packageManifest.name,
          version:
            packageManifest.version,
          artifact,
          sha256:
            sha256File(
              artifact
            ),
        };
      }),
  };
}

function buildExpectedAttestation(
  manifestPath: string
) {
  return {
    attestation_version:
      "1.0.0",
    release_manifest_hash:
      sha256File(
        manifestPath
      ),
    verification_result:
      "PASSED",
  };
}

const manifest =
  JSON.parse(
    fs.readFileSync(
      "release-manifest.json",
      "utf8"
    )
  );

const expectedManifest =
  buildExpectedManifest();

if (
  canonicalize(manifest) !==
  canonicalize(
    expectedManifest
  )
) {
  throw new Error(
    "Release manifest is not deterministic for the current artifacts"
  );
}

for (
  const artifact
  of manifest.artifacts
) {
  const currentHash =
    sha256File(
      artifact.artifact
    );

  if (
    currentHash !==
    artifact.sha256
  ) {
    throw new Error(
      `Reproducibility verification failed for ${artifact.artifact}`
    );
  }

  console.log(
    `Verified ${artifact.artifact}`
  );
}

child_process.execSync(
  "npm run pack:packages",
  {
    stdio: "inherit",
  }
);

const rebuiltManifest =
  buildExpectedManifest();

if (
  canonicalize(
    rebuiltManifest
  ) !==
  canonicalize(
    expectedManifest
  )
) {
  throw new Error(
    "Repacked release artifacts are not reproducible"
  );
}

if (
  fs.existsSync(
    "rebuild-attestation.json"
  )
) {
  const attestation =
    JSON.parse(
      fs.readFileSync(
        "rebuild-attestation.json",
        "utf8"
      )
    );

  const expectedAttestation =
    buildExpectedAttestation(
      "release-manifest.json"
    );

  if (
    canonicalize(
      attestation
    ) !==
    canonicalize(
      expectedAttestation
    )
  ) {
    throw new Error(
      "Rebuild attestation is not deterministic"
    );
  }
}

console.log(
  "Release reproducibility verification passed"
);



