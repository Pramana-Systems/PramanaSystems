import path from "path";

import { generateManifest }
  from "../packages/bundle/src/manifest";

import { signManifest }
  from "../packages/crypto/src/sign";

import { verifySignature }
  from "../packages/crypto/src/verify";

const directory = path.resolve(
  "./tests/bundle-example"
);

const manifest =
  generateManifest(
    "claims-approval",
    "v1",
    directory
  );

const signature =
  signManifest(manifest);

const valid =
  verifySignature(
    manifest,
    signature
  );

console.log({
  signature,
  valid,
});