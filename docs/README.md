# pramanasystems

Deterministic governance infrastructure for enforceable decisions requiring independently verifiable trust.

pramanasystems separates probabilistic AI evaluation from deterministic governance enforcement.

AI systems generate signals.

pramanasystems governs enforcement deterministically.

---

# Core Principles

pramanasystems is built around the following governance invariants:

- deterministic execution
- replay-safe enforcement
- immutable provenance
- fail-closed behavior
- portable verification
- explicit trust semantics
- runtime compatibility enforcement
- independently reproducible governance evidence

These invariants preserve governance integrity independently of infrastructure ownership.

---

# Governance Philosophy

pramanasystems separates:

```text
AI Evaluation
    ↓
Governed Signals
    ↓
Deterministic Governance Enforcement

AI systems may generate:

classifications
recommendations
extracted signals
risk assessments

AI systems do NOT directly determine enforcement outcomes.

Governance enforcement remains deterministic, reproducible, and independently verifiable.

Repository Structure
/
├── packages/
├── scripts/
├── tests/
├── trust/
├── workflows/
├── tools/
├── docs/
├── .github/
Quick Start
Install Dependencies
npm install
Run Conformance Validation
npm test
Run Governance Validation
npm run check
Run Full Release Validation
npm run release:validate
Verify Release Provenance
node tools/independent-verifier/index.mjs verify-release
Verify Execution Attestation
node tools/independent-verifier/index.mjs verify-attestation
Verify Runtime Identity
node tools/independent-verifier/index.mjs verify-runtime

The release validation workflow validates:

deterministic builds
conformance invariants
replay-safe enforcement
fail-closed behavior
runtime compatibility
portable verification
SDK portability
independently reproducible governance evidence
Package Overview
Package	Responsibility
@pramanasystems/bundle	Deterministic governance artifacts
@pramanasystems/crypto	Signing and verification primitives
@pramanasystems/governance	Governance lifecycle semantics
@pramanasystems/execution	Deterministic runtime execution
@pramanasystems/verifier	Independent governance verification
@pramanasystems/core	Public SDK orchestration surface
Deterministic Governance Guarantees

pramanasystems preserves:

deterministic execution semantics
replay-safe governance behavior
immutable governance lineage
portable release verification
independently reproducible provenance
fail-closed enforcement semantics
trust continuity guarantees
Verification Philosophy

Verification must remain independently executable.

External systems must be able to validate:

release provenance
execution attestations
governance lineage
trust-root continuity
runtime identity
reproducibility guarantees

without requiring centralized infrastructure trust.

Independent Verification

pramanasystems includes portable independent verifier tooling:

tools/independent-verifier/

The verifier validates:

release provenance
execution attestations
runtime identity
governance evidence integrity

without requiring centralized infrastructure trust.

Verify Release Provenance
node tools/independent-verifier/index.mjs verify-release

Expected output:

RELEASE VERIFIED: true
Verify Execution Attestation
node tools/independent-verifier/index.mjs verify-attestation

Expected output:

ATTESTATION VERIFIED: true
Verify Runtime Identity
node tools/independent-verifier/index.mjs verify-runtime

Expected output:

RUNTIME VERIFIED: true

The verifier operationalizes one of pramanasystems’s core guarantees:

governance verification without centralized trust dependency.

Portability Philosophy

pramanasystems is designed for portable governance execution.

Organizations may operate:

their own infrastructure
their own compute
their own storage
their own AI systems

while preserving deterministic governance integrity.

Documentation

Governance doctrine and operational specifications are organized under:

docs/
Recommended Reading
Core Architecture
ARCHITECTURE.md
docs/runtime/RUNTIME_CERTIFICATION.md
docs/runtime/EXECUTION_MODEL.md
Governance Doctrine
docs/governance/CONFORMANCE_MODEL.md
docs/governance/FAILURE_SEMANTICS.md
docs/governance/GOVERNANCE_ARTIFACTS.md
docs/governance/SIGNAL_SEMANTICS.md
Trust & Verification
docs/trust/TRUST_MODEL.md
docs/trust/THREAT_MODEL.md
docs/trust/ATTESTATION_LINEAGE.md
docs/verification/VERIFICATION_MODEL.md
docs/verification/RELEASE_VERIFICATION.md
docs/verification/INDEPENDENT_VERIFIER.md
docs/verification/END_TO_END_VERIFICATION.md
Operations & Compatibility
docs/operations/SDK_RELEASE_PROCESS.md
docs/operations/OPERATIONAL_COMMANDS.md
docs/operations/PUBLIC_API_POLICY.md
docs/operations/VERSIONING_POLICY.md
Specifications
docs/specifications/SPECIFICATION_INDEX.md
docs/specifications/SEMVER_AND_COMPATIBILITY.md
docs/specifications/TERMINOLOGY.md

For full doctrine navigation:

docs/README.md
Operational Validation

Run deterministic governance validation:

npm test

Run governance validation:

npm run check

Run authoritative release governance validation:

npm run release:validate
Governance Principle

pramanasystems provides deterministic governance infrastructure for enforceable decisions requiring independently verifiable trust.

