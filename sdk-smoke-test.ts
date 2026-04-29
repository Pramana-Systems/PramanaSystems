import {
  createPolicy,
  generateBundle,
  executeDecision,
  verifyAttestation,
  canonicalize,
  sha256,
  signManifest,
  verifySignature,
  getRuntimeManifest
} from "@manthan/core";

console.log(
  "Manthan core SDK loaded successfully"
);

console.log({
  createPolicy,
  generateBundle,
  executeDecision,
  verifyAttestation,
  canonicalize,
  sha256,
  signManifest,
  verifySignature,
  getRuntimeManifest
});