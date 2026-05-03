# @pramanasystems/execution

Deterministic execution runtime for the PramanaSystems governance infrastructure.

[![npm](https://img.shields.io/npm/v/@pramanasystems/execution)](https://www.npmjs.com/package/@pramanasystems/execution)

---

## Overview

`@pramanasystems/execution` is the core execution engine. It handles:

- **Execution tokens** — single-use, time-bounded authorization tokens
- **Deterministic execution** — every run of `executeDecision()` with the same inputs produces the same signed result
- **Replay protection** — each `execution_id` is consumed exactly once
- **Cryptographic attestation** — results are signed at execution time and independently verifiable
- **Runtime provenance** — `RuntimeManifest` links every attestation to the specific runtime version that produced it

---

## Installation

```bash
npm install @pramanasystems/execution
```

---

## Quick start

```ts
import {
  issueExecutionToken,
  signExecutionToken,
  executeDecision,
  getRuntimeManifest,
  LocalSigner,
  LocalVerifier,
  MemoryReplayStore,
  type ExecutionContext,
} from "@pramanasystems/execution";

const signer    = new LocalSigner();
const verifier  = new LocalVerifier(signer.publicKeyPem);
const store     = new MemoryReplayStore();
const manifest  = getRuntimeManifest();

// Issue a single-use execution token
const token     = issueExecutionToken("loan-approval", "v1", "approve", signalsHash);
const tokenSig  = signExecutionToken(token, signer);

const context: ExecutionContext = {
  token,
  token_signature:      tokenSig,
  signer,
  verifier,
  runtime_manifest:     manifest,
  runtime_requirements: { required_capabilities: [], supported_runtime_versions: ["1.0.0"], supported_schema_versions: ["1.0.0"] },
  execution_requirements: { replay_protection_required: false, attestation_required: false, audit_chain_required: false, independent_verification_required: false },
};

const attestation = executeDecision(context, store);
// attestation.result.decision === "approve"
// attestation.signature  — base64 Ed25519 signature over canonical result
```

### One-call shorthand

```ts
import { executeSimple, LocalSigner, LocalVerifier } from "@pramanasystems/execution";

const signer   = new LocalSigner();
const verifier = new LocalVerifier(signer.publicKeyPem);

const attestation = executeSimple(
  { policyId: "loan-approval", policyVersion: "v1", decisionType: "approve", signalsHash },
  signer,
  verifier
);
```

---

## API

### Token lifecycle

| Function | Description |
|---|---|
| `issueExecutionToken(policyId, version, decision, signalsHash)` | Creates a time-bounded, single-use execution token |
| `signExecutionToken(token, signer)` | Signs the token; signature must be verified before execution |
| `verifyExecutionToken(token, signature, verifier)` | Verifies the token signature; `executeDecision` calls this internally |

### Execution

| Function | Description |
|---|---|
| `executeDecision(context, replayStore?)` | Full execution pipeline — verifies token, checks replay, signs result |
| `executeSimple(input, signer, verifier, store?)` | Convenience wrapper that handles token issuance and context construction |

### Result signing and verification

| Function | Description |
|---|---|
| `signExecutionResult(result, signer)` | Signs a result object; returns base64 signature |
| `verifyExecutionResult(result, signature, verifier)` | Verifies a result signature; returns boolean |

### Runtime manifest

| Function | Description |
|---|---|
| `getRuntimeManifest()` | Returns the active runtime's `RuntimeManifest` |
| `hashRuntime()` | Returns the deterministic runtime hash |
| `signRuntimeManifest(manifest, signer)` | Signs a runtime manifest |
| `verifyRuntimeManifest(manifest, signature, verifier)` | Verifies a runtime manifest signature |

### Signers and verifiers

| Class | Description |
|---|---|
| `LocalSigner` | Ed25519 signer backed by Node.js `crypto`; generates a keypair on construction |
| `LocalVerifier` | Ed25519 verifier; takes a PEM public key |

### Replay protection

| Class/Interface | Description |
|---|---|
| `MemoryReplayStore` | In-process replay store; rejects duplicate `execution_id` values |
| `ReplayStore` | Synchronous replay store interface |
| `AsyncReplayStore` | Asynchronous replay store interface |

### AWS KMS

`AwsKmsSigner` is available at `@pramanasystems/execution/src/aws-kms-signer.js` (not exported from the package index). It implements `AsyncSigner` using ECDSA-SHA256 via AWS KMS. See [tests/integration/aws-kms/README.md](../../tests/integration/aws-kms/README.md) for usage.

---

## Types

```ts
import type {
  ExecutionToken,
  ExecutionResult,
  ExecutionAttestation,
  ExecutionContext,
  RuntimeManifest,
  Signer,
  AsyncSigner,
  Verifier,
  ReplayStore,
  AsyncReplayStore,
} from "@pramanasystems/execution";
```

### `ExecutionResult`

```ts
interface ExecutionResult {
  execution_id:    string;  // UUID
  policy_id:       string;
  policy_version:  string;
  schema_version:  string;
  runtime_version: string;
  runtime_hash:    string;
  decision:        string;
  signals_hash:    string;
  executed_at:     string;  // ISO 8601
}
```

### `ExecutionAttestation`

```ts
interface ExecutionAttestation {
  result:    ExecutionResult;
  signature: string;  // base64 signature over canonicalize(result)
}
```

---

## License

Apache-2.0
