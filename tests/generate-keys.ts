import fs from "fs";

import crypto from "crypto";

const {
  publicKey,
  privateKey,
} = crypto.generateKeyPairSync(
  "ed25519"
);

fs.writeFileSync(
  "./test-keys/manthan_test_key",

  privateKey.export({
    format: "pem",
    type: "pkcs8",
  }),

  "utf8"
);

fs.writeFileSync(
  "./test-keys/manthan_test_key.pub",

  publicKey.export({
    format: "pem",
    type: "spki",
  }),

  "utf8"
);

console.log(
  "Ed25519 PEM test keys generated."
);