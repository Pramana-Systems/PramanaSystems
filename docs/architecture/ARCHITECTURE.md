# PramanaSystems Architecture

## Vision

PramanaSystems is a deterministic governance infrastructure for systems where decisions must be:

- **Provable** — every decision is cryptographically attested and independently verifiable.
- **Reproducible** — the same policy, signals, runtime version, and bundle hash always yield the same decision.
- **Auditable** — a hash-chained append-only audit log records every execution.
- **Independently verifiable** — any holder of the trust-root public key can verify an attestation without trusting the runtime operator.

PramanaSystems separates probabilistic evaluation (AI-generated signals and recommendations) from deterministic enforcement. AI systems may contribute signals; they never control execution.

---

## Core Principles

### Deterministic Execution

Given identical inputs — policy, signals, runtime version, bundle hash — the system always produces the same governance decision. Deterministic reproducibility is a foundational invariant, not an optimization goal.

### Governed Signals

Signals are the sole inputs to the execution engine. They are explicit, typed, versioned, and externally generated. Operational metadata (hostnames, trace IDs, timestamps) is excluded from the signing scope and preserved only for auditability.

### Fail-Closed Governance

Any unverifiable or invalid state terminates execution immediately. Invalid signatures, replay attacks, incompatible runtimes, missing capabilities, and failed attestations all result in hard errors. Silent degradation to permissive behavior is prohibited.

### Immutable Lineage

Governance artifacts preserve immutable lineage through versioned policies, signed manifests, release provenance, attestations, and trust-root history. Lineage must remain independently reconstructable from public artifacts alone.

### Replay-Safe Execution

Execution tokens are single-use. Every `execution_id` is recorded in the replay store on first use; duplicate IDs are deterministically rejected.

### Canonical Serialization

All hashing and signing operations act on canonical JSON: object keys recursively sorted, deterministic whitespace. Semantically equivalent content always produces identical bytes.

### Portable Verification

Verification must be independently executable outside the originating environment. Any entity with the public trust root can verify release integrity, attestations, manifests, signatures, and governance lineage without platform trust.

### No AI in the Enforcement Path

AI systems may assist signal generation or evaluation. They never directly control deterministic governance execution. Enforcement is exclusively policy-governed and deterministic.

---

## System Architecture

```
AI Systems
    │
    ▼  (governed signals)
Governance Policies
    │
    ▼  (bundle + manifest)
Deterministic Execution Runtime
    │
    ▼  (signed attestation)
Independent Verification

REST API (optional)         SDK Client (optional)       Dashboard (optional)
  @pramanasystems/server  ←→  @pramanasystems/sdk-client  ←→  @pramanasystems/dashboard
```

The architecture deliberately separates:

1. **Probabilistic evaluation** — performed outside the system boundary by AI or rule-based signal producers.
2. **Deterministic governance enforcement** — performed by the execution runtime using versioned, signed policy bundles.
3. **Independent verification** — performed by any party holding the trust-root public key.

---

## Package Responsibilities

| Package | Responsibility |
|---|---|
| `@pramanasystems/bundle` | Canonical serialization, content-addressed manifests, artifact hashing, and bundle verification. |
| `@pramanasystems/crypto` | Ed25519 signing, signature verification, and key persistence. |
| `@pramanasystems/governance` | Policy lifecycle — create, upgrade, validate, bundle generation. |
| `@pramanasystems/execution` | Deterministic runtime — token lifecycle, execution pipeline, attestation generation, audit logging. |
| `@pramanasystems/verifier` | Portable, independent verification of attestations, bundles, and runtime compatibility. |
| `@pramanasystems/core` | Public orchestration surface — re-exports all governance APIs and types as a single entry point. |
| `@pramanasystems/server` | Fastify REST API exposing governance execution and verification over HTTP. |
| `@pramanasystems/sdk-client` | Type-safe fetch client generated from the server's OpenAPI spec. |
| `@pramanasystems/dashboard` | React + Vite SPA for health monitoring, decision execution, and attestation verification. Private — not published to npm. |

Each package maintains explicit deterministic boundaries; packages higher in the stack depend on packages lower in the stack, never the reverse.

---

## Execution Pipeline

```
issueExecutionToken()
    │  validates policy + reads bundle hash
    ▼
signExecutionToken()
    │  Ed25519 over canonical token
    ▼
executeDecision()
    ├─ verify runtime version compatibility
    ├─ verify runtime capabilities
    ├─ verify token signature
    ├─ check token expiry
    ├─ check replay store (single-use)
    ├─ append hash-chained audit record
    └─ sign ExecutionResult → ExecutionAttestation
```

### ExecutionAttestation

The terminal artifact of every successful execution.  It contains:

- An `ExecutionResult` — immutable record of the decision, policy version, runtime hash, signals hash, and timestamp.
- A base64 Ed25519 signature over the canonical `ExecutionResult`, enabling independent verification.

---

## Verification Model

Independent verification proceeds in three checks via `verifyAttestation()`:

| Check | What is verified |
|---|---|
| **Signature** | The Ed25519 signature over the canonical `ExecutionResult`. |
| **Runtime** | The `runtime_hash` and `runtime_version` match the trusted manifest. |
| **Schema** | The `schema_version` is supported by the runtime. |

All three must pass for `valid: true`.

---

## REST API Layer (`@pramanasystems/server`)

The server exposes a Fastify HTTP API on port `3000` (configurable via `PORT`).

| Route | Method | Description |
|---|---|---|
| `/health` | GET | Runtime health and version. |
| `/execute` | POST | Run a governance decision; returns a signed `ExecutionAttestation`. |
| `/verify` | POST | Independently verify an `ExecutionAttestation`. |
| `/runtime/manifest` | GET | Signed bundle manifest (stub — 501). |
| `/runtime/capabilities` | GET | Runtime capability list (stub — 501). |
| `/evaluate` | POST | Policy dry-run without attestation (stub — 501). |
| `/simulate` | POST | Full pipeline simulation with no side effects (stub — 501). |

Authentication is Bearer-token gated when `PRAMANA_API_KEY` is set; unauthenticated in dev mode.

The key pair is resolved in priority order: environment variables → dev-keys on disk → ephemeral in-process key pair.

---

## SDK Client Layer (`@pramanasystems/sdk-client`)

`PramanaClient` is a type-safe fetch wrapper generated from the server's OpenAPI spec.  All request and response types are derived via indexed-access types on the generated `openapi.d.ts`, so they stay in sync automatically.

```ts
const client = new PramanaClient({ baseUrl: "http://localhost:3000" });
const attestation = await client.execute({ ... });
const result = await client.verify(attestation);
```

Non-2xx responses throw `PramanaApiError` with the HTTP status code and server error message.

---

## Deterministic Guarantees

The following are guaranteed to be deterministic given identical inputs and versions:

- Policy evaluation
- Canonical serialization
- Signature verification
- Manifest hashing
- Attestation validation
- Replay protection
- Compatibility enforcement
- Governance workflow execution

Explicitly excluded from deterministic guarantees:

- External AI inference
- Uncontrolled external services
- Non-versioned runtime dependencies
- Mutable infrastructure state

---

## Trust Model Summary

PramanaSystems uses explicit cryptographic trust. Core trust primitives:

- Immutable trust roots (Ed25519 public keys distributed as portable artifacts)
- Signed bundle manifests
- Release provenance records
- Execution attestations
- Trust-root rotation lineage

Trust is established through deterministic cryptographic verification, never through infrastructure ownership or deployment location.

---

## Failure Semantics

Execution is rejected and an error is thrown when:

- Token signature is invalid
- Token has expired
- Execution ID has already been consumed (replay)
- Runtime version is unsupported
- Required capability is missing
- Runtime schema version is incompatible
- Policy validation fails

Silent fallback behavior is prohibited at every level of the stack.

---

## Portability Philosophy

Customers may operate their own infrastructure, compute, storage, and AI systems. PramanaSystems governs deterministic enforcement semantics independently of infrastructure ownership. Portable verification is a core architectural requirement, not an operational convenience.
