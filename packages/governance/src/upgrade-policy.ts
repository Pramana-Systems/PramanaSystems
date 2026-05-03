import fs from "fs";
import path from "path";

/**
 * Creates the next version directory for `policyId` by copying the latest
 * existing version and incrementing its numeric suffix (e.g. `v1` → `v2`).
 * The copied `policy.json` has its `version` field updated to the new version
 * string.
 *
 * @param policyId - An existing policy identifier under `./policies/`.
 * @returns Absolute path of the newly created version directory.
 * @throws When the policy does not exist on disk.
 */
export function upgradePolicy(
  policyId: string
): string {
  const policyRoot = path.join(
    "./policies",
    policyId
  );

  if (!fs.existsSync(policyRoot)) {
    throw new Error(
      `Policy does not exist: ${policyId}`
    );
  }

  const versions = fs
    .readdirSync(policyRoot)
    .filter((entry) =>
      entry.startsWith("v")
    )
    .sort();

  const latestVersion =
    versions[
      versions.length - 1
    ];

  const latestNumber =
    Number(
      latestVersion.replace("v", "")
    );

  const nextVersion =
    `v${latestNumber + 1}`;

  const latestDirectory =
    path.join(
      policyRoot,
      latestVersion
    );

  const nextDirectory =
    path.join(
      policyRoot,
      nextVersion
    );

  fs.cpSync(
    latestDirectory,
    nextDirectory,
    {
      recursive: true,
    }
  );

  const policyFile =
    path.join(
      nextDirectory,
      "policy.json"
    );

  const content =
    JSON.parse(
      fs.readFileSync(
        policyFile,
        "utf8"
      )
    );

  content.version =
    nextVersion;

  fs.writeFileSync(
    policyFile,
    JSON.stringify(
      content,
      null,
      2
    ),
    "utf8"
  );

  return nextDirectory;
}




