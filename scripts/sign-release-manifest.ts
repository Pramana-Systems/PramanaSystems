import fs from "fs";

import path from "path";

import {
  signManifest,
} from "@manthan/crypto";

const manifestPath =
  path.resolve(
    "release-manifest.json"
  );

const signature =
  signManifest(
    manifestPath
  );

fs.writeFileSync(
  "release-manifest.sig",

  signature
);

console.log(
  "Release manifest signed"
);