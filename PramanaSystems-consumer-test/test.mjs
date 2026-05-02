import {
  executeDecision,
  verifyExecutionResult,
  getRuntimeManifest,
  MemoryReplayStore,
  LocalSigner,
  LocalVerifier,
  signExecutionToken,
} from "@pramanasystems/execution";

import fs from "node:fs";
import path from "node:path";

const replayStore =
  new MemoryReplayStore();

const privateKey =
  fs.readFileSync(
    path.resolve(
      "dev-keys/bundle_signing_key"
    ),
    "utf8"
  );

const publicKey =
  fs.readFileSync(
    path.resolve(
      "dev-keys/bundle_signing_key.pub"
    ),
    "utf8"
  );

const signer =
  new LocalSigner(privateKey);

const verifier =
  new LocalVerifier(publicKey);

const token = {
  execution_id:
    "external-consumer-test",

  policy_id:
    "policy-1",

  policy_version:
    "1.0.0",

  bundle_hash:
    "bundle-hash",

  decision_type:
    "approve",

  signals_hash:
    "signals-hash",

  issued_at:
    new Date().toISOString(),

  expires_at:
    new Date(
      Date.now() + 60000
    ).toISOString(),
};

const tokenSignature =
  signExecutionToken(
    token,
    signer
  );

const context = {
  token,

  token_signature:
    tokenSignature,

  signer,

  verifier,

  runtime_manifest:
    getRuntimeManifest(),

  runtime_requirements: {
    required_capabilities: [
      "replay-protection",
    ],

    supported_runtime_versions: [
      "1.0.0",
    ],

    supported_schema_versions: [
      "1.0.0",
    ],
  },

  execution_requirements: {
    replay_protection_required:
      true,

    attestation_required:
      true,

    audit_chain_required:
      true,

    independent_verification_required:
      true,
  },
};

const execution =
  executeDecision(
    context,
    replayStore
  );

console.log(
  "EXTERNAL EXECUTION VERIFIED"
);

const verification =
  verifyExecutionResult(
    execution.result,
    execution.signature,
    verifier
  );

console.log(
  "EXTERNAL VERIFICATION:",
  verification
);

console.log(
  "RUNTIME MANIFEST VERIFIED"
);



