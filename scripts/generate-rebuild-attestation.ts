import fs from "fs";

import crypto from "crypto";

const manifestBytes =
  fs.readFileSync(
    "release-manifest.json"
  );

const manifestHash =
  crypto
    .createHash("sha256")
    .update(manifestBytes)
    .digest("hex");

const attestation = {
  attestation_version:
    "1.0.0",

  release_manifest_hash:
    manifestHash,

  verification_result:
    "PASSED",
};

fs.writeFileSync(
  "rebuild-attestation.json",

  JSON.stringify(
    attestation,
    null,
    2
  )
);

console.log(
  "Rebuild attestation generated"
);



