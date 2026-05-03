# Contributing to PramanaSystems

## Purpose

PramanaSystems is deterministic governance infrastructure.

Contributions must preserve:

- deterministic execution
- replay-safe enforcement
- fail-closed behavior
- immutable provenance
- portable verification
- independently reproducible governance evidence
- compatibility discipline

Governance correctness is prioritized over feature velocity.

---

## Before Contributing

Read these documents before modifying core infrastructure:

- [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md)
- [`docs/governance/CONFORMANCE_MODEL.md`](docs/governance/CONFORMANCE_MODEL.md)
- [`docs/runtime/RUNTIME_CERTIFICATION.md`](docs/runtime/RUNTIME_CERTIFICATION.md)
- [`docs/verification/VERIFICATION_MODEL.md`](docs/verification/VERIFICATION_MODEL.md)
- [`docs/trust/TRUST_MODEL.md`](docs/trust/TRUST_MODEL.md)

Understanding deterministic governance semantics is required before modifying core infrastructure.

---

## Development Setup

```bash
# Install all workspace dependencies
npm install

# Build all packages (respects turbo dependency order)
npm run build

# Run all tests
npm test

# Typecheck + lint
npm run check

# Full deterministic validation pipeline (required before committing)
npm run release:validate
```

### Running individual packages

```bash
# Build a single package
npx turbo run build --filter=@pramanasystems/execution

# Test a single package
npx vitest run packages/execution
```

### AWS KMS integration tests

These are skipped automatically when credentials are absent:

```bash
AWS_KMS_KEY_ID=<key>  AWS_ACCESS_KEY_ID=<key>  AWS_SECRET_ACCESS_KEY=<secret>  AWS_REGION=us-east-1 \
npx vitest run tests/integration/aws-kms
```

See [`tests/integration/aws-kms/README.md`](tests/integration/aws-kms/README.md) for full setup.

---

## Required Validation

All contributions **must** pass:

```bash
npm test
npm run check
npm run release:validate
```

The pre-commit hook runs `release:validate` automatically. Do not bypass it with `--no-verify`.

---

## Governance Invariants

Contributions **must not** weaken:

- deterministic reproducibility
- replay protection
- fail-closed semantics
- immutable provenance
- runtime compatibility enforcement
- portable verification
- trust continuity semantics

These are governance invariants. Weakening them requires an architectural RFC.

---

## Compatibility Discipline

Public governance contracts are compatibility-sensitive.

Changes affecting any of these types require compatibility review:

- `ExecutionToken`
- `ExecutionContext`
- `ExecutionResult`
- `ExecutionAttestation`
- `RuntimeManifest`
- `RuntimeRequirements`
- `ExecutionRequirements`

Breaking governance semantics requires an explicit major-version bump with migration notes in `CHANGELOG.md`.

---

## Monorepo Structure

```
packages/
  bundle/         Canonicalization and artifact hashing
  core/           Portable SDK (re-exports execution + governance + verifier)
  crypto/         Ed25519 signing and verification primitives
  execution/      Deterministic execution runtime
  governance/     Policy lifecycle tooling
  verifier/       Independent attestation verification
  verifier-cli/   CLI for offline verification
  server/         Fastify REST API server
  sdk-client/     Type-safe fetch client for the server

tests/
  integration/
    aws-kms/      AWS KMS integration tests (skipped without credentials)

docs/             Architecture, governance, trust, and verification documentation
examples/         Reference implementations
scripts/          Build-time tooling (OpenAPI export, etc.)
```

---

## Publishing

Packages are published to npm under the `@pramanasystems` scope with public access.

To publish (requires OTP if 2FA is enabled):

```bash
npm run build
npm publish --workspace=packages/<name> --access public --otp=<code>
```

After publishing, tag the release:

```bash
git tag v<version>
git push origin main --tags
```

---

## Operational Principle

Governance infrastructure must remain independently verifiable without centralized trust dependency.

Operational simplicity is preferred over unnecessary abstraction complexity.
