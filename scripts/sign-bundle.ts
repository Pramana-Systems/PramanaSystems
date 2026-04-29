import fs from "fs";

import path from "path";

import crypto from "crypto";

const bundlePath =
  process.argv[2];

if (!bundlePath) {
  throw new Error(
    "Bundle path required"
  );
}

const privateKey =
  fs.readFileSync(
    "./test-keys/manthan_test_key",
    "utf8"
  );

const manifestPath =
  path.join(
    bundlePath,
    "bundle.manifest.json"
  );

const signaturePath =
  path.join(
    bundlePath,
    "bundle.sig"
  );

const manifest =
  fs.readFileSync(
    manifestPath
  );

const signature =
  crypto.sign(
    null,
    manifest,
    privateKey
  );

fs.writeFileSync(
  signaturePath,
  signature.toString(
    "base64"
  )
);

console.log(
  `Signed bundle: ${bundlePath}`
);