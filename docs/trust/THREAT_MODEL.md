# PramanaSystems Threat Model

## Security Philosophy

PramanaSystems is a deterministic governance infrastructure with explicit trust and fail-closed execution semantics. Security is based on:

- Deterministic verification — the same inputs always produce the same verification outcome
- Fail-closed execution — any unverifiable state terminates execution with an error
- Immutable lineage — governance artifacts preserve a cryptographically linked history
- Replay-safe execution — execution IDs are single-use and globally tracked
- Portable trust — verification does not depend on infrastructure ownership
- Independent verification — any party with the trust root can verify any artifact

Trust is never implicitly inherited from infrastructure, deployment environment, organizational authority, runtime location, or platform control.

---

## Threat Scope

This threat model covers:

- Governance artifact integrity
- Execution pipeline integrity
- Replay protection
- Release provenance
- Trust-root infrastructure
- Deterministic orchestration
- Independent verification
- Governance lineage
- Distributed trust governance

This model does **not** attempt to guarantee:

- Correctness of AI inference or signal generation
- Physical infrastructure security
- Safety of customer-managed infrastructure
- Confidentiality beyond configured system boundaries
- Correctness of external dependencies outside governance validation boundaries

---

## Threat Actors

| Actor | Capability | Example Attack |
|---|---|---|
| External attacker | Network access, artifact download | Manifest tampering after distribution |
| Supply-chain attacker | Build pipeline or registry access | Release tarball substitution |
| Malicious runtime operator | Process-level access | Altered runtime binary |
| Replay attacker | Captured execution tokens | Resubmit a previous token |
| Insider governance abuser | Authorized governance credentials | Unauthorized policy approval |
| Compromised signing authority | Signing key access | Invalid trust root operations |
| Infrastructure attacker | Deployment environment access | Environment variable manipulation |

---

## Threat Categories and Mitigations

### Replay Attacks

**Threat:** An attacker captures a previously authorized `ExecutionToken` or `ExecutionAttestation` and re-submits it to obtain a repeated execution.

**Mitigations:**
- Every `execution_id` is a UUIDv4 consumed by the `ReplayStore` on first use.
- Subsequent submissions of the same `execution_id` are rejected immediately.
- Tokens have a TTL (default 300 s); expired tokens are also rejected.
- For distributed deployments `RedisReplayStore` shares the consumed-ID set across instances.

---

### Artifact Tampering

**Threat:** An attacker modifies a governance artifact (policy file, bundle manifest, release tarball) after it has been signed.

**Mitigations:**
- `verifyManifest()` recomputes the SHA-256 hash of every artifact and compares against the manifest commitment.
- The manifest itself is signed; `verifySignature()` detects modification of the manifest file.
- Any hash mismatch produces `valid: false` and the artifact is rejected.

---

### Signature Forgery

**Threat:** An attacker produces an unauthorized signature over a governance artifact or attestation.

**Mitigations:**
- All signatures are Ed25519; forging a signature without the private key is computationally infeasible.
- All signing and verification operates on canonical bytes; non-canonical serializations cannot bypass verification.
- Unsigned artifacts are unconditionally rejected — there is no unsigned-but-trusted path.

---

### Runtime Substitution

**Threat:** An attacker substitutes an altered, downgraded, or unverifiable runtime binary.

**Mitigations:**
- `hashRuntime()` produces a SHA-256 commitment over the runtime manifest definition, embedded in every `ExecutionResult` as `runtime_hash`.
- `verifyAttestation()` compares the result's `runtime_hash` against the trusted manifest; a mismatch fails verification.
- Bundle `runtime_requirements` specify the exact runtime version and capabilities required.
- Version compatibility is validated before any execution side-effect occurs.

---

### Trust-Root Compromise

**Threat:** An attacker obtains a signing private key and issues unauthorized governance artifacts.

**Mitigations:**
- For production, keys should be stored in hardware security modules (e.g. AWS KMS) where the private key never leaves the HSM.
- Trust-root rotation requires explicit lineage: the prior root must authorize the next via a signed transition record.
- Observers can trace the full rotation history to verify every root in the chain.
- All prior attestations remain verifiable against the root that signed them — rotation does not retroactively invalidate history.

---

### Governance Workflow Manipulation

**Threat:** An attacker bypasses required workflow steps, inserts unauthorized steps, or alters execution ordering.

**Mitigations:**
- Governance execution follows a fixed, code-enforced pipeline: token issue → sign → verify → expiry → replay → audit → sign result.
- Each step is a precondition for the next; there is no path to skip or reorder steps.
- Policy evaluation is deterministic: given the same inputs the result is always identical, so injecting alternative paths is not possible.

---

### Supply-Chain Manipulation

**Threat:** An attacker replaces release tarballs, alters provenance metadata, or forges release manifests in the distribution pipeline.

**Mitigations:**
- `release-manifest.json` records SHA-256 hashes of every release artifact.
- The manifest is signed with the trust root; `release-manifest.sig` must validate against the public key.
- Independent rebuild attestations (`rebuild-attestation.json`) provide third-party evidence that a clean rebuild produces bit-identical artifacts.

---

### Metadata Contamination

**Threat:** Non-deterministic operational metadata (timestamps, hostnames, trace IDs) leaks into the signing scope, breaking reproducibility and verification.

**Mitigations:**
- `LocalValidator.validate()` explicitly scans payloads for forbidden fields (`generatedAt`, `environment`, `host`, `runtime`, `traceId`).
- `SignedEnvelope` separates `payload` (signed) from `metadata` (audit-only).
- The `metadataIsolation` validation stage confirms the canonical payload equals the canonical envelope-without-metadata.

---

## Mitigation Summary

| Threat | Primary Mitigation |
|---|---|
| Replay attacks | Single-use execution IDs in ReplayStore |
| Artifact tampering | Signed canonical manifests with SHA-256 artifact hashes |
| Signature forgery | Ed25519 with canonical serialization |
| Runtime substitution | `runtime_hash` in attestation + version compatibility check |
| Release manipulation | Trust-root signed release manifest + rebuild attestations |
| Workflow manipulation | Fixed, code-enforced execution pipeline |
| Supply-chain tampering | Release provenance verification |
| Unauthorized trust rotation | Signed trust lineage with predecessor authorization |
| Metadata contamination | Forbidden-field scanning + metadata isolation validation |

---

## Canonical Verification Semantics

Signing and verification operate exclusively on canonical serialized bytes. Equivalent semantic content must produce identical hashes and signatures. Canonicalization prevents:

- Ambiguity-based signature bypass (different serializations of the same object)
- Key-ordering attacks
- Whitespace injection

Verification of non-canonical artifacts is invalid.

---

## Explicit Non-Goals

PramanaSystems does not guarantee:

- Correctness of AI-generated outputs or signals
- Protection against all insider threats without quorum controls
- Confidentiality outside configured infrastructure
- Physical hardware security
- Safety of uncontrolled third-party systems

---

## Compromise Handling

Any unverifiable or compromised state fails closed. Silent fallback to permissive behavior is prohibited at every layer. Compromise recovery must:

- Preserve explicit lineage (rotation records, audit logs)
- Not retroactively invalidate prior verifiable attestations
- Be independently auditable using only distributed public artifacts

---

## Infrastructure Assumptions

PramanaSystems assumes infrastructure may be:

- Mutable and externally operated
- Partially or fully customer-owned
- Operating in adversarial network environments
- Running on shared or untrusted compute

Security depends on explicit cryptographic verification, not infrastructure trust.

---

## Security Invariants

The following are mandatory at every layer of the stack:

- Unsigned artifacts are invalid
- Unverifiable lineage is rejected
- Replayed execution is rejected
- Unverifiable trust transitions are invalid
- Governance operations require explicit authorization
- Deterministic verification semantics are mandatory
- Runtime compatibility validation is required
- Provenance validation failures terminate execution
- Trust assumptions must remain explicit and documented

---

## Future Direction

Planned security evolution:

- Programmable governance security policies
- Distributed governance federation with quorum verification
- Deterministic workflow-state validation
- Advanced trust-governance controls (multi-party authorization)
- Policy-governed governance execution
- Reproducible governance supply-chain verification
