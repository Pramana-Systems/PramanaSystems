import fs from "fs";

import path from "path";

import crypto from "crypto";

function sha256(
  filePath: string
): string {

  const content =
    fs.readFileSync(
      filePath
    );

  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");
}

const packages = [
  "bundle",
  "crypto",
  "governance",
  "execution",
  "verifier",
  "core",
  "verifier-cli",
];

const artifacts =
  packages.map(
    (pkg) => {
      const packageManifestPath =
        path.join(
          "packages",
          pkg,
          "package.json"
        );

      const packageManifest =
        JSON.parse(
          fs.readFileSync(
            packageManifestPath,
            "utf8"
          )
        ) as {
          name: string;
          version: string;
        };

      const tarball =
        `${packageManifest.name
          .replace(/^@/, "")
          .replace(/\//g, "-")}-${packageManifest.version}.tgz`;

      const tarballPath =
        path.resolve(
          tarball
        );

      if (
        !fs.existsSync(
          tarballPath
        )
      ) {
        throw new Error(
          `Missing tarball for ${packageManifest.name}: ${tarball}`
        );
      }

      return {
        package:
          packageManifest.name,

        version:
          packageManifest.version,

        artifact:
          tarball,

        sha256:
          sha256(
            tarballPath
          ),
      };
    }
  );

const manifest = {
  manifest_version:
    "1.0.0",

  artifacts,
};

fs.writeFileSync(
  "release-manifest.json",

  JSON.stringify(
    manifest,
    null,
    2
  )
);

console.log(
  "Release manifest generated"
);



