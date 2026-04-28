import fs from "fs";
import path from "path";

import { generateManifest }
  from "../packages/bundle/src/manifest";

import { writeManifest }
  from "../packages/bundle/src/write";

import { readManifest }
  from "../packages/bundle/src/read";

import { signManifest }
  from "../packages/crypto/src/sign";

import { verifySignature }
  from "../packages/crypto/src/verify";

import {
  writeSignature,
  readSignature,
} from "../packages/crypto/src/persist";

const directory = path.resolve(
  "./tests/bundle-example"
);

const policyFile = path.join(
  directory,
  "policy.json"
);

const originalContent =
  fs.readFileSync(
    policyFile,
    "utf8"
  );

const manifest =
  generateManifest(
    "claims-approval",
    "v1",
    directory
  );

writeManifest(
  manifest,
  directory
);

const signature =
  signManifest(manifest);

writeSignature(
  signature,
  directory
);

fs.writeFileSync(
  policyFile,
  JSON.stringify(
    {
      policy:
        "claims-approval",

      version: "v2"
    },
    null,
    2
  ),
  "utf8"
);

const tamperedManifest =
  generateManifest(
    "claims-approval",
    "v1",
    directory
  );

const loadedSignature =
  readSignature(directory);

const valid =
  verifySignature(
    tamperedManifest,
    loadedSignature
  );

console.log({
  tampered: true,
  valid,
});

fs.writeFileSync(
  policyFile,
  originalContent,
  "utf8"
);