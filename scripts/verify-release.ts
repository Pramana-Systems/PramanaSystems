import fs from "fs";

import crypto from "crypto";

import path from "path";

const manifestPath =
  "release-manifest.json";

const signaturePath =
  "release-manifest.sig";

if (
  !fs.existsSync(
    manifestPath
  )
) {
  throw new Error(
    "Missing release manifest"
  );
}

if (
  !fs.existsSync(
    signaturePath
  )
) {
  throw new Error(
    "Missing release signature"
  );
}

const signature =
  fs.readFileSync(
    signaturePath,
    "utf8"
  );

const trustRoot =
  JSON.parse(
    fs.readFileSync(
      "trust/trust-root.json",
      "utf8"
    )
  ) as {
    public_key_file: string;
  };

const publicKey =
  fs.readFileSync(
    path.join(
      "trust",
      trustRoot.public_key_file
    ),
    "utf8"
  );

const valid =
  crypto.verify(
    null,
    fs.readFileSync(
      manifestPath
    ),
    publicKey,
    Buffer.from(
      signature,
      "base64"
    )
  );

if (!valid) {
  throw new Error(
    "Release signature verification failed"
  );
}

const manifest =
  JSON.parse(
    fs.readFileSync(
      manifestPath,
      "utf8"
    )
  );

for (
  const artifact
  of manifest.artifacts
) {
  const content =
    fs.readFileSync(
      artifact.artifact
    );

  const hash =
    crypto
      .createHash(
        "sha256"
      )
      .update(content)
      .digest("hex");

  if (
    hash !==
    artifact.sha256
  ) {
    throw new Error(
      `Hash mismatch for ${artifact.artifact}`
    );
  }
}

console.log(
  "Release verification passed"
);



