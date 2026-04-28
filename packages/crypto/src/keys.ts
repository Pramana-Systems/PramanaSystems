import fs from "fs";

export function loadPrivateKey(): string {
  return fs.readFileSync(
    "./manthan_bundle_key",
    "utf8"
  );
}

export function loadPublicKey(): string {
  return fs.readFileSync(
    "./manthan_bundle_key.pub",
    "utf8"
  );
}