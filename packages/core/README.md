# @pramanasystems/core

Portable runtime SDK for the PramanaSystems deterministic governance ecosystem.

[![npm](https://img.shields.io/npm/v/@pramanasystems/core)](https://www.npmjs.com/package/@pramanasystems/core)

---

## Overview

`@pramanasystems/core` is the recommended single-package install for most applications. It re-exports the full governance lifecycle, execution runtime, and verification layer under one import, and adds the deterministic validator architecture.

Install this instead of installing `@pramanasystems/execution`, `@pramanasystems/governance`, and `@pramanasystems/verifier` separately.

---

## Installation

```bash
npm install @pramanasystems/core
```

---

## Quick start

```ts
import {
  definePolicy,
  executeDecision,
  verifyAttestation,
  LocalSigner,
  LocalVerifier,
  getRuntimeManifest,
  MemoryReplayStore,
  type ExecutionContext,
} from "@pramanasystems/core";

// 1. Define a policy
const policy = definePolicy({
  id:      "loan-approval",
  version: "v1",
  rules:   [...],
});

// 2. Set up signing infrastructure
const signer    = new LocalSigner();
const verifier  = new LocalVerifier(signer.publicKeyPem);
const store     = new MemoryReplayStore();
const manifest  = getRuntimeManifest();

// 3. Execute a governance decision
const token    = issueExecutionToken("loan-approval", "v1", "approve", signalsHash);
const tokenSig = signExecutionToken(token, signer);

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

// 4. Verify independently
const result = verifyAttestation(attestation, verifier, manifest);
console.log(result.valid);  // true
```

### One-call shorthand via `executeSimple`

```ts
import { executeSimple, LocalSigner, LocalVerifier } from "@pramanasystems/core";

const signer   = new LocalSigner();
const verifier = new LocalVerifier(signer.publicKeyPem);

const attestation = executeSimple(
  { policyId: "loan-approval", policyVersion: "v1", decisionType: "approve", signalsHash },
  signer,
  verifier
);
```

---

## Exports

### Governance lifecycle (from `@pramanasystems/governance`)

| Export | Description |
|---|---|
| `createPolicy` | Creates a governance policy |
| `upgradePolicy` | Creates an upgraded policy version |
| `validatePolicy` | Validates a policy structure |
| `generateBundle` | Generates a deterministic policy bundle |
| `definePolicy` | Typed policy builder |

### Deterministic execution (from `@pramanasystems/execution`)

| Export | Description |
|---|---|
| `executeDecision` | Full execution pipeline |
| `executeSimple` | One-call execution shorthand |
| `issueExecutionToken` | Issues a single-use execution token |
| `verifyExecutionToken` | Verifies a token signature |
| `signExecutionResult` | Signs an execution result |
| `verifyExecutionResult` | Verifies an execution result signature |
| `getRuntimeManifest` | Returns the active runtime manifest |
| `signRuntimeManifest` | Signs a runtime manifest |
| `verifyRuntimeManifest` | Verifies a runtime manifest signature |
| `LocalSigner` | Ed25519 signer |
| `LocalVerifier` | Ed25519 verifier |
| `MemoryReplayStore` | In-process replay protection |

### Portable verification (from `@pramanasystems/verifier`)

| Export | Description |
|---|---|
| `verifyAttestation` | Three-check attestation verification |
| `verifyBundle` | Bundle signature verification |
| `verifyRuntime` | Runtime manifest verification |
| `verifyRuntimeCompatibility` | Runtime compatibility check |
| `verifyExecutionRequirements` | Execution requirements check |

### Canonical types

```ts
import type {
  ExecutionContext,
  ExecutionResult,
  ExecutionAttestation,
  ExecutionToken,
  RuntimeManifest,
  Signer,
  Verifier,
  ReplayStore,
  RuntimeRequirements,
  ExecutionRequirements,
} from "@pramanasystems/core";
```

### Deterministic validator

```ts
import { canonicalize } from "@pramanasystems/core";
```

---

## License

Apache-2.0
