# Verification

PramanaSystems separates three concerns:

1. **Decision generation** — AI systems or rule-based logic produce signals.
2. **Governance enforcement** — the deterministic runtime evaluates the policy and produces a signed `ExecutionAttestation`.
3. **Independent verification** — any party with the trust-root public key can verify the attestation without trusting the runtime operator.

---

## Verification Goals

Every governed decision must be:

- **Reproducible** — given the same policy, signals hash, runtime version, and bundle hash, the decision is always identical.
- **Replay-safe** — execution IDs are single-use; duplicate submissions are rejected.
- **Cryptographically attestable** — the `ExecutionResult` is signed by the governance runtime's Ed25519 key.
- **Independently verifiable** — verification requires only the public key and the attestation; no runtime access needed.

---

## Core Verification Properties

### Deterministic Evaluation

The policy evaluation engine (`evaluatePolicy`) is purely functional: the same `policy.json`, rule tree, signals, and schema version always produce the same decision string. There are no random or time-based inputs in the evaluation path.

### Canonical Serialization

All signing and verification operates on canonical JSON — object keys sorted recursively, deterministic whitespace. This prevents ambiguity-based verification bypass and ensures that semantically identical content always produces identical signatures.

### Replay Protection

`executeDecision` checks the `ReplayStore` before taking any action:

```
has_executed(execution_id) → reject if true
execute()
mark_executed(execution_id)
```

For distributed deployments replace the default `MemoryReplayStore` with `RedisReplayStore` to share the consumed-ID set across instances.

### Runtime Provenance

Every `ExecutionResult` embeds `runtime_hash` (SHA-256 of the canonical runtime manifest) and `runtime_version`. Verifiers compare these fields against a trusted `RuntimeManifest` to confirm the exact runtime version that produced the decision.

### Independent Verification

`verifyAttestation` performs three independent checks:

| Check | Pass condition |
|---|---|
| `signature_verified` | Ed25519 signature over canonical `ExecutionResult` is valid |
| `runtime_verified` | `result.runtime_hash === manifest.runtime_hash` AND `result.runtime_version === manifest.runtime_version` |
| `schema_compatible` | `result.schema_version` is in `manifest.supported_schema_versions` |

`valid: true` requires all three checks to pass.

---

## Verification Flow

```
ExecutionAttestation (from executeDecision or POST /execute)
    │
    ├─ attestation.result           (ExecutionResult)
    │      execution_id, policy_id, policy_version
    │      runtime_version, runtime_hash
    │      schema_version, decision, signals_hash, executed_at
    │
    └─ attestation.signature        (base64 Ed25519)
           over canonical(attestation.result)
    
    ↓ verifyAttestation(attestation, verifier, runtimeManifest)
    
    VerificationResult
    ├─ valid: boolean
    └─ checks: { signature_verified, runtime_verified, schema_compatible }
```

---

## SDK Verification

### Using `@pramanasystems/verifier`

```ts
import { verifyAttestation } from "@pramanasystems/verifier";
import { LocalVerifier, getRuntimeManifest } from "@pramanasystems/execution";

const verifier = new LocalVerifier(publicKeyPem);
const manifest = getRuntimeManifest();

const result = verifyAttestation(attestation, verifier, manifest);

if (!result.valid) {
  console.error("Verification failed:", result.checks);
  // { signature_verified: false, runtime_verified: true, schema_compatible: true }
}
```

### Using `@pramanasystems/core`

```ts
import {
  verifyAttestation,
  LocalVerifier,
  getRuntimeManifest,
} from "@pramanasystems/core";
```

`@pramanasystems/core` re-exports all verification functions.

---

## HTTP Verification (via server)

### POST /verify

```bash
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PRAMANA_API_KEY" \
  -d '{
    "result": {
      "execution_id": "...",
      "policy_id": "access-control",
      "policy_version": "v1",
      "schema_version": "1.0.0",
      "runtime_version": "1.0.0",
      "runtime_hash": "...",
      "decision": "approve",
      "signals_hash": "...",
      "executed_at": "2026-05-03T12:00:00.000Z"
    },
    "signature": "base64=="
  }'
```

Response:

```json
{
  "valid": true,
  "checks": {
    "signature_verified": true,
    "runtime_verified": true,
    "schema_compatible": true
  }
}
```

### Using the SDK client

```ts
import { PramanaClient } from "@pramanasystems/sdk-client";

const client = new PramanaClient({ baseUrl: "http://localhost:3000" });

// The attestation returned by execute() can be passed directly to verify()
const attestation = await client.execute({ ... });
const result = await client.verify(attestation);

console.log(result.valid); // true
```

---

## Bundle Verification

Verify a policy bundle's on-disk integrity before using it:

```ts
import { verifyBundle } from "@pramanasystems/verifier";

const result = verifyBundle(
  "./policies/access-control/v1/bundle.manifest.json",
  "./policies/access-control/v1/bundle.sig"
);

// result.valid, result.bundle_verified, result.signature_verified
```

This re-hashes every artifact in the bundle directory and compares against the manifest commitment, then validates the manifest signature.

---

## Runtime Compatibility Verification

Before executing, confirm the runtime satisfies all bundle requirements:

```ts
import { verifyRuntimeCompatibility } from "@pramanasystems/verifier";
import { getRuntimeManifest } from "@pramanasystems/execution";

const manifest = getRuntimeManifest();
const requirements = {
  required_capabilities: ["replay-protection", "attestation-signing"],
  supported_runtime_versions: ["1.0.0"],
  supported_schema_versions: ["1.0.0"],
};

const result = verifyRuntimeCompatibility(manifest, requirements);

if (!result.valid) {
  console.error("Missing capabilities:", result.missing_capabilities);
  console.error("Unsupported runtime:", result.unsupported_runtime_version);
  console.error("Unsupported schema:", result.unsupported_schema_version);
}
```

---

## Release Artifact Verification

See [docs/verification/RELEASE_VERIFICATION.md](./verification/RELEASE_VERIFICATION.md) for the complete release verification workflow, including trust-root validation, manifest signature verification, artifact hash verification, and independent rebuild attestations.

---

## Validation Status

The PramanaSystems ecosystem has been validated through:

- External clean-room npm installation
- Independent runtime attestation verification
- Deterministic conformance testing
- GitHub Actions governance CI
- Reproducible package builds with hash comparison
- AWS KMS sign/verify/attestation integration tests
