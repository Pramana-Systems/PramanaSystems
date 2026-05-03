# Security Policy

## Purpose

PramanaSystems is deterministic governance infrastructure for enforceable decisions requiring independently verifiable trust.

Security vulnerabilities may affect:

- deterministic execution guarantees
- replay-safe enforcement
- immutable provenance
- portable verification
- trust continuity
- governance integrity

Security correctness is treated as governance correctness.

---

## Security Philosophy

PramanaSystems prioritizes:

- deterministic behavior
- fail-closed semantics
- explicit trust boundaries
- immutable governance evidence
- independently reproducible verification
- portable trust

The system is intentionally designed to minimize hidden trust assumptions.

---

## Security Scope

Security-sensitive components include:

- signing and verification primitives (`@pramanasystems/crypto`)
- execution attestations (`@pramanasystems/execution`)
- runtime manifests and hash chain (`@pramanasystems/execution`)
- trust-root continuity
- replay protection (`MemoryReplayStore`, `AsyncReplayStore`)
- canonical serialization (`@pramanasystems/bundle`)
- governance provenance
- release verification
- API authentication (`@pramanasystems/server` — `PRAMANA_API_KEY`)

---

## Vulnerability Reporting

Please report security vulnerabilities responsibly by emailing the maintainers.

Include:

- affected component and package version
- deterministic reproduction steps
- security impact
- compatibility implications
- trust implications

Avoid public disclosure before remediation coordination when possible.

---

## Trust Assumptions

PramanaSystems assumes:

- trusted cryptographic primitives (Node.js `crypto`, AWS KMS)
- trusted governance signing keys
- deterministic runtime execution
- immutable signed governance artifacts

PramanaSystems intentionally avoids:

- centralized trust dependency
- hidden verification infrastructure
- opaque governance execution

---

## Validating a Release

After any security fix, validate deterministic reproducibility:

```bash
npm run release:validate
```

This runs the full release reproducibility test suite and verifies all signed artifacts match their expected hashes.

---

## Operational Principle

Verification must remain independently executable.

Governance trust must remain portable.

Security mitigations must preserve deterministic governance semantics.
