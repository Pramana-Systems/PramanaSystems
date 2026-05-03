# @pramanasystems/verifier

Independent attestation verification for the PramanaSystems governance runtime.

[![npm](https://img.shields.io/npm/v/@pramanasystems/verifier)](https://www.npmjs.com/package/@pramanasystems/verifier)

---

## Overview

`@pramanasystems/verifier` performs portable, independent verification of governance attestations. It has no trust dependency on the runtime that produced the attestation — any party with the signer's public key can verify.

Verification is a **three-check process**:

1. **Signature** — the `ExecutionResult` was signed by the trusted governance key
2. **Runtime hash** — the result was produced by the expected runtime version
3. **Schema compatibility** — the result's schema version is supported by the runtime

---

## Installation

```bash
npm install @pramanasystems/verifier
```

---

## Quick start

```ts
import { verifyAttestation } from "@pramanasystems/verifier";
import { getRuntimeManifest, LocalVerifier } from "@pramanasystems/execution";

const verifier = new LocalVerifier(publicKeyPem);
const manifest = getRuntimeManifest();

const result = verifyAttestation(attestation, verifier, manifest);

console.log(result.valid);
// true

console.log(result.checks);
// {
//   signature_verified: true,
//   runtime_verified:   true,
//   schema_compatible:  true,
// }
```

---

## API

### `verifyAttestation(attestation, verifier, manifest): VerificationResult`

The primary verification function. Runs all three checks and returns a structured result.

```ts
import { verifyAttestation } from "@pramanasystems/verifier";

const { valid, checks } = verifyAttestation(attestation, verifier, manifest);
```

`valid` is `true` only when all three checks pass. Individual check results are available in `checks`.

### `verifyBundle(bundle, verifier): boolean`

Verifies a signed governance policy bundle.

### `verifyRuntime(manifest, verifier): boolean`

Verifies the signature on a `RuntimeManifest`.

### `verifyRuntimeCompatibility(manifest, requirements): boolean`

Checks whether a runtime manifest satisfies a set of `RuntimeRequirements`.

### `verifyExecutionRequirements(manifest, requirements): boolean`

Checks whether a runtime manifest satisfies a set of `ExecutionRequirements`.

---

## Types

### `VerificationResult`

```ts
interface VerificationResult {
  valid: boolean;
  checks: {
    signature_verified: boolean;
    runtime_verified:   boolean;
    schema_compatible:  boolean;
  };
}
```

### `Verifier` interface

`verifyAttestation` accepts any object implementing the `Verifier` interface from `@pramanasystems/execution`:

```ts
interface Verifier {
  verify(payload: string, signature: string): boolean;
}
```

This makes verification portable across key types — `LocalVerifier` (Ed25519), custom AWS KMS verifiers (ECDSA-P256), or any other implementation.

---

## Independent verification

Verification is designed to be performed outside the production runtime:

```ts
// In a separate process, service, or auditor's environment:
import { verifyAttestation } from "@pramanasystems/verifier";

// All you need is the attestation, the public key, and the expected runtime manifest.
const result = verifyAttestation(attestation, verifier, manifest);
```

The verifier has no network calls, no service dependencies, and no trust in the runtime's self-reported state.

---

## License

Apache-2.0
