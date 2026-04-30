import {
  createPolicy,
  generateBundle,
} from "@manthan/governance";

import {
  executeDecision,
  getRuntimeManifest,
} from "@manthan/execution";

import {
  verifyAttestation,
} from "@manthan/verifier";

import {
  canonicalize,
} from "@manthan/bundle";

import {
  verifySignature,
} from "@manthan/crypto";

console.log(
  "Manthan SDK packages loaded successfully"
);

console.log({
  createPolicy,
  generateBundle,
  executeDecision,
  verifyAttestation,
  canonicalize,
  verifySignature,
  getRuntimeManifest,
});