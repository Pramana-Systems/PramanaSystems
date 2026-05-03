# PramanaSystems Trust Model

## Trust Philosophy

PramanaSystems is built on explicit, portable, and cryptographically verifiable trust. Trust is never assumed implicitly through:

- Infrastructure ownership
- Deployment location
- Runtime environment
- Platform control
- Organizational authority

All critical governance operations are:

- Explicitly authorized
- Cryptographically verifiable
- Independently reproducible
- Auditable
- Deterministic

Verification remains portable across environments.

---

## Trust Boundaries

| Component | Trust Model |
|---|---|
| Governance artifacts | Cryptographically verified |
| Policies | Explicitly versioned and signed |
| Execution runtime | Version-governed and attestable |
| Signals | Externally generated but governed by policy schema |
| AI systems | Not trusted for deterministic enforcement |
| Release artifacts | Independently verifiable |
| Verifiers | Portable and independently executable |
| Infrastructure providers | Intentionally untrusted |
| External storage | Not trusted without signature verification |
| Runtime metadata | Audit-only — excluded from deterministic decisions |

Trust is established through deterministic verification, not infrastructure ownership.

---

## Trust Roots

PramanaSystems uses explicit cryptographic trust roots. A trust root is an Ed25519 public key that serves as the authoritative verification anchor for:

- Release manifest signatures
- Attestation signatures
- Governance artifact signatures
- Trust governance operations

Trust roots are distributed as portable public verification artifacts. They are designed to remain:

- Immutable — a published root key is never modified in place
- Independently distributable — available without trusting any platform
- Reproducibly verifiable — multiple independent sources can confirm authenticity
- Version-governed — root versions are explicit and tracked

Private trust material (private keys) must never be distributed publicly.

---

## Signing Model

All signing and verification operations act on **canonical serialized bytes** — JSON with object keys sorted recursively. This prevents ambiguity-based signature bypass where different serializations of semantically identical content would produce different signatures.

Signing operations include:

- Bundle manifest signing (`bundle.sig`)
- Release provenance signing (`release-manifest.sig`)
- Execution result attestation signing
- Runtime manifest signing
- Trust governance operations

Unsigned or unverifiable artifacts are treated as invalid and rejected.

---

## Key Infrastructure

### Development Keys

Located at `./dev-keys/bundle_signing_key` and `./dev-keys/bundle_signing_key.pub`. Used for local development and CI. Never used in production.

### Production Keys

Injected via `PRAMANA_PRIVATE_KEY` and `PRAMANA_PUBLIC_KEY` environment variables. The server falls back to dev-keys and then generates ephemeral keys if neither is available.

### AWS KMS

For production deployments requiring hardware-backed or auditable signing, `AwsKmsSigner` provides ECDSA_SHA_256 signing via AWS KMS. Key material never leaves the HSM.

---

## Distributed Governance Authorities

PramanaSystems is designed to support distributed governance authority models where operations may require:

- Multiple signers
- Quorum-based approval
- Role-specific authorization
- Distributed trust control

Examples include release approval, trust-root rotation, governance certification, and runtime authorization. Distributed governance reduces dependence on single-authority trust.

---

## Trust-Root Rotation

Trust evolution is explicitly governed. Rotation requires:

- Explicit lineage preservation — the prior root authorizes the next
- Signed trust transition records
- Deterministic authorization
- Independently verifiable rotation history

Trust rotation preserves cryptographic continuity rather than replacing trust implicitly. An observer with only the original root can trace the chain to the current root.

---

## Independent Verification Model

External verifiers must be able to validate all of the following using only distributed artifacts and the trust root — without trusting PramanaSystems infrastructure, CI systems, deployment environments, or runtime operators:

- Release artifact integrity
- Bundle manifest signatures
- Execution attestations
- Governance lineage
- Reproducibility equivalence
- Trust-root transitions

---

## Explicit Non-Trust Assumptions

PramanaSystems intentionally does not trust:

- AI-generated outputs (signals are trusted only after policy schema validation)
- Probabilistic inference systems
- Unsigned artifacts
- Unverifiable runtimes
- Mutable infrastructure
- Uncontrolled external services
- Implicit deployment trust
- Non-versioned dependencies
- Unverifiable execution environments

All critical governance operations require explicit, deterministic verification.

---

## Compromise Model

PramanaSystems assumes compromise scenarios must be survivable through deterministic governance controls:

| Compromise | Response |
|---|---|
| Signing key compromise | Rotate trust root with explicit lineage; prior attestations remain verifiable against old root |
| Release artifact tampering | Manifest hash mismatch detected; artifact rejected |
| Replay attack | Single-use execution IDs; replay detected and execution terminated |
| Unauthorized governance changes | Signature verification fails; change rejected |
| Invalid trust transition | Lineage break detected; transition rejected |
| Runtime incompatibility | Capability/version check fails; execution terminated |

Compromised or unverifiable states fail closed. Trust recovery preserves explicit lineage.

---

## Replay Protection

Replay-safe execution is a mandatory trust invariant. Execution identifiers are single-use. The replay store (in-process `MemoryReplayStore` or distributed `RedisReplayStore`) records every consumed `execution_id`. Duplicate submissions are deterministically rejected at the start of the execution pipeline.

---

## Runtime Trust Semantics

An execution runtime is trusted only when:

- Its version satisfies the bundle's `supported_runtime_versions`
- Its capabilities satisfy the bundle's `required_capabilities`
- Its schema versions overlap with the bundle's `supported_schema_versions`
- Attestation verification succeeds against the expected `runtime_hash`

Runtime trust is governed deterministically through explicit compatibility validation — not through operator identity or deployment location.

---

## Release Provenance Trust

Release artifacts are trusted only when:

- Artifact hashes in `release-manifest.json` match on-disk files
- The release signature validates against the trust root
- Provenance metadata is internally consistent
- Reproducibility verification produces equivalent hashes
- Trust-root verification succeeds

Release verification must remain independently executable.

---

## Trust Invariants

The following invariants are mandatory and enforced at every layer:

- Unsigned artifacts are invalid
- Unverifiable lineage is rejected
- Replayed execution is rejected
- Unverifiable trust transitions are invalid
- Governance operations require explicit authorization
- Trust-root lineage must remain preservable
- Execution fails closed on verification failure
- Deterministic verification semantics are mandatory
- Portable verification must remain possible

---

## Future Direction

Planned trust infrastructure evolution:

- Programmable trust governance policies
- Distributed governance federation
- Deterministic governance DAG authorization
- Multi-party trust orchestration
- Policy-governed trust execution
- Reproducible governance supply-chain verification

All future evolution must preserve deterministic reproducibility and independent verifiability.
