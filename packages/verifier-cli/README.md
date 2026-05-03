# @pramanasystems/verifier-cli

Command-line interface for offline PramanaSystems attestation verification.

[![npm](https://img.shields.io/npm/v/@pramanasystems/verifier-cli)](https://www.npmjs.com/package/@pramanasystems/verifier-cli)

---

## Overview

`@pramanasystems/verifier-cli` is a standalone CLI tool for verifying governance artifacts outside the production runtime. It reads a public key from `./dev-keys/bundle_signing_key.pub` and performs cryptographic verification of attestations, release manifests, and runtime manifests.

---

## Installation

```bash
npm install -g @pramanasystems/verifier-cli
```

Or run without installing via:

```bash
npx @pramanasystems/verifier-cli <command> <file>
```

---

## Prerequisites

The CLI reads the signing public key from:

```
./dev-keys/bundle_signing_key.pub
```

This path is relative to your current working directory. Generate or copy your public key there before running verification commands.

---

## Commands

### `verify-attestation <file>`

Verifies the cryptographic signature of a governance attestation.

```bash
pramanasystems-verifier verify-attestation ./attestation.json
```

The attestation file must contain `decision`, `policyVersion`, `timestamp`, and `signature` fields.

### `verify-release <file>`

Verifies the cryptographic signature of a release manifest.

```bash
pramanasystems-verifier verify-release ./release-manifest.json
```

The release manifest must contain `version`, `artifacts`, and `signature` fields.

### `verify-runtime <file>`

Verifies the cryptographic signature of a runtime manifest.

```bash
pramanasystems-verifier verify-runtime ./runtime-manifest.json
```

The runtime manifest must contain `runtime`, `version`, `compatibility`, and `signature` fields.

---

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Verification succeeded |
| `1` | Verification failed, file not found, or malformed input |

---

## Example

```bash
$ pramanasystems-verifier verify-attestation ./governance/attestation.json

PramanaSystems Verifier CLI

ATTESTATION:
{ decision: 'approve', policyVersion: 'v1', timestamp: '...', signature: '...' }

Cryptographic attestation verification succeeded.
```

---

## License

Apache-2.0
