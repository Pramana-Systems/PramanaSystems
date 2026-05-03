# Getting Started with PramanaSystems

PramanaSystems is a deterministic governance infrastructure for systems where AI-generated signals drive decisions that must be cryptographically attested and independently verified.

---

## Installation

### Core SDK (governance lifecycle + execution + verification)

```bash
npm install @pramanasystems/core
```

### Individual packages

```bash
npm install @pramanasystems/bundle      # canonical manifests + artifact hashing
npm install @pramanasystems/crypto      # Ed25519 signing + verification
npm install @pramanasystems/governance  # policy lifecycle
npm install @pramanasystems/execution   # deterministic runtime
npm install @pramanasystems/verifier    # portable independent verification
```

### HTTP server + SDK client

```bash
npm install @pramanasystems/server      # Fastify REST API
npm install @pramanasystems/sdk-client  # type-safe fetch client
```

---

## Prerequisites

- Node.js 20+
- ESM (`"type": "module"` in `package.json`, or `.mjs` files)

---

## Quickstart — Core SDK

### 1. Set up a key pair

For development, generate an Ed25519 key pair and place it in `./dev-keys/`:

```bash
mkdir -p dev-keys
openssl genpkey -algorithm ed25519 -out dev-keys/bundle_signing_key
openssl pkey -pubout -in dev-keys/bundle_signing_key -out dev-keys/bundle_signing_key.pub
```

For production, inject keys via environment variables:

```bash
export PRAMANA_PRIVATE_KEY="$(cat private.pem)"
export PRAMANA_PUBLIC_KEY="$(cat public.pem)"
```

### 2. Create and bundle a policy

```ts
import {
  createPolicy,
  generateBundle,
  validatePolicy,
} from "@pramanasystems/core";

// Scaffold ./policies/access-control/v1/policy.json
createPolicy("access-control");

// Write your policy rules to ./policies/access-control/v1/policy.json
// then generate the signed bundle manifest:
generateBundle("access-control", "v1", "./policies/access-control/v1");

// Validate all versions of the policy (manifest hashes + signatures)
const valid = validatePolicy("access-control");
console.log("Policy valid:", valid); // true
```

### 3. Execute a governance decision

```ts
import crypto from "crypto";
import {
  LocalSigner,
  LocalVerifier,
  executeDecision,
  issueExecutionToken,
  signExecutionToken,
  getRuntimeManifest,
} from "@pramanasystems/core";
import { loadPrivateKey, loadPublicKey } from "@pramanasystems/crypto";

const signer = new LocalSigner(loadPrivateKey());
const verifier = new LocalVerifier(loadPublicKey());

// Hash your signals payload deterministically
const signals = { user_role: "admin", resource: "billing" };
const signalsHash = crypto
  .createHash("sha256")
  .update(JSON.stringify(signals))
  .digest("hex");

// Issue a time-limited execution token (5-minute TTL by default)
const token = issueExecutionToken(
  "access-control",
  "v1",
  "approve",
  signalsHash
);
const tokenSignature = signExecutionToken(token, signer);

// Execute the decision
import { MemoryReplayStore } from "@pramanasystems/core";

const attestation = executeDecision({
  token,
  token_signature: tokenSignature,
  signer,
  verifier,
  runtime_manifest: getRuntimeManifest(),
  runtime_requirements: {
    required_capabilities: [],
    supported_runtime_versions: ["1.0.0"],
    supported_schema_versions: ["1.0.0"],
  },
  execution_requirements: {
    replay_protection_required: false,
    attestation_required: false,
    audit_chain_required: false,
    independent_verification_required: false,
  },
});

console.log("Decision:", attestation.result.decision);
console.log("Signature:", attestation.signature);
```

### 4. Verify an attestation independently

```ts
import { verifyAttestation } from "@pramanasystems/core";
import { LocalVerifier } from "@pramanasystems/core";
import { loadPublicKey } from "@pramanasystems/crypto";
import { getRuntimeManifest } from "@pramanasystems/core";

const verifier = new LocalVerifier(loadPublicKey());

const result = verifyAttestation(
  attestation,
  verifier,
  getRuntimeManifest()
);

console.log("Valid:", result.valid);
// { valid: true, checks: { signature_verified: true, runtime_verified: true, schema_compatible: true } }
```

---

## Quickstart — REST API

### Start the server

```bash
# Development (ephemeral keys, no auth)
npx @pramanasystems/server

# Production
PRAMANA_PRIVATE_KEY="$(cat private.pem)" \
PRAMANA_PUBLIC_KEY="$(cat public.pem)" \
PRAMANA_API_KEY="your-secret-key" \
PORT=3000 \
npx @pramanasystems/server
```

### Call the API directly

```bash
# Health check
curl http://localhost:3000/health

# Execute a governance decision
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "policy_id": "access-control",
    "policy_version": "v1",
    "decision_type": "approve",
    "signals_hash": "abc123def456..."
  }'

# Verify an attestation
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -d '<paste ExecutionAttestation JSON here>'
```

---

## Quickstart — SDK Client

```ts
import { PramanaClient } from "@pramanasystems/sdk-client";

const client = new PramanaClient({
  baseUrl: "http://localhost:3000",
  apiKey: "your-secret-key", // omit if PRAMANA_API_KEY is not set
});

// Check server health
const health = await client.health();
console.log(health.status, health.version);

// Execute a governance decision
const attestation = await client.execute({
  policy_id: "access-control",
  policy_version: "v1",
  decision_type: "approve",
  signals_hash: "abc123def456...",
});

// Verify the attestation
const verification = await client.verify(attestation);
console.log("Valid:", verification.valid);
console.log("Checks:", verification.checks);
```

### Error handling

```ts
import { PramanaClient, PramanaApiError } from "@pramanasystems/sdk-client";

try {
  const attestation = await client.execute({ ... });
} catch (err) {
  if (err instanceof PramanaApiError) {
    console.error(`HTTP ${err.status}: ${err.message}`);
  }
}
```

---

## Core Concepts

### Architecture

```
AI System → Signals → Governance Policy → Deterministic Runtime → ExecutionAttestation
                                                                        ↓
                                                              Independent Verification
```

### Signal Hash

Signals are always passed as a hash (`signals_hash: string`), not in-line. Compute it before calling `execute`:

```ts
import crypto from "crypto";
import { canonicalize } from "@pramanasystems/bundle";

const signalsHash = crypto
  .createHash("sha256")
  .update(canonicalize(signals))
  .digest("hex");
```

Using `canonicalize()` ensures the hash is deterministic regardless of object key order.

### Replay Protection

Each `execution_id` is consumed exactly once. The default `MemoryReplayStore` is process-local (resets on restart). For distributed deployments:

```ts
import { RedisReplayStore } from "@pramanasystems/execution";

const store = new RedisReplayStore("redis://redis.internal:6379");
```

### Attestation Verification

Attestations are self-contained: any holder of the trust-root public key can verify them without access to the runtime that produced them:

```ts
import { verifyAttestation } from "@pramanasystems/verifier";

const result = verifyAttestation(attestation, verifier, runtimeManifest);
// result.valid, result.checks.signature_verified, etc.
```

---

## Next Steps

- [Architecture](./architecture/ARCHITECTURE.md) — full system design and package responsibilities
- [Verification](./verification.md) — independent verification workflows
- [Trust Model](./trust/TRUST_MODEL.md) — cryptographic trust infrastructure
- [Release Verification](./verification/RELEASE_VERIFICATION.md) — verifying release artifacts
- Package READMEs: [`bundle`](../packages/bundle/README.md) · [`crypto`](../packages/crypto/README.md) · [`governance`](../packages/governance/README.md) · [`execution`](../packages/execution/README.md) · [`verifier`](../packages/verifier/README.md) · [`core`](../packages/core/README.md) · [`server`](../packages/server/README.md) · [`sdk-client`](../packages/sdk-client/README.md)
