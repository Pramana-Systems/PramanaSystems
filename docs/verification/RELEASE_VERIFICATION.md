# PramanaSystems Release Verification

## Philosophy

Release verification is designed for:

- **Portability** — executable outside the originating CI environment
- **Determinism** — the same source always produces the same artifacts
- **Cryptographic authenticity** — all artifacts are signed by the trust root
- **Independent reproducibility** — third parties can rebuild and confirm bit-identical output
- **Minimized infrastructure trust** — verification depends on cryptography, not CI or registry trust

Release verification must not require trust in CI systems, infrastructure providers, deployment environments, package registries, runtime operators, or platform ownership.

---

## Release Artifacts

| Artifact | Purpose |
|---|---|
| `*.tgz` packages | Distribution artifacts for each `@pramanasystems/*` package |
| `release-manifest.json` | Deterministic SHA-256 hashes for all release artifacts |
| `release-manifest.sig` | Ed25519 signature over the canonical release manifest |
| `trust/PramanaSystems-root.pub` | Portable trust-root public key (Ed25519 SPKI PEM) |
| `trust/trust-root.json` | Trust-root metadata and version |
| `rebuild-attestation.json` | Independent rebuild evidence |

All artifacts are independently verifiable.

---

## Verification Flow

```
1. Obtain Public Trust Root
       trust/PramanaSystems-root.pub

2. Verify Release Signature
       verify(release-manifest.sig, canonical(release-manifest.json), root.pub)

3. Validate Artifact Hashes
       for each entry in release-manifest.json:
           sha256(artifact_file) == manifest_entry.hash

4. Validate Provenance Metadata
       inspect release-manifest.json for commit, tag, build metadata

5. (Optional) Independent Rebuild
       build from source with same Node.js version
       compare sha256(rebuilt_artifact) == manifest_entry.hash

6. (Optional) Validate Rebuild Attestation
       verify rebuild-attestation.json against expected hashes
```

---

## Step 1 — Trust-Root Verification

Release verification begins with the trust root. The public key at `trust/PramanaSystems-root.pub` is the authoritative verification anchor for all release signatures. It must be obtained through a channel independent of the release being verified (e.g., a prior trusted release, a known-good repository mirror, or out-of-band distribution).

Trust roots are:

- Immutable once published
- Independently distributable without trusting a registry
- Versioned — `trust/trust-root.json` records the version and rotation history
- Publicly readable — private key material is never distributed

---

## Step 2 — Signature Verification

```bash
# Using openssl (Ed25519)
openssl pkeyutl \
  -verify \
  -pubin -inkey trust/PramanaSystems-root.pub \
  -sigfile release-manifest.sig \
  -in <(node -e "
    const fs = require('fs');
    const m = JSON.parse(fs.readFileSync('release-manifest.json'));
    // canonical: sorted keys, 2-space indent
    process.stdout.write(JSON.stringify(sortKeys(m), null, 2));
    function sortKeys(v) {
      if (Array.isArray(v)) return v.map(sortKeys);
      if (v && typeof v === 'object')
        return Object.keys(v).sort().reduce((a,k)=>({...a,[k]:sortKeys(v[k])}),{});
      return v;
    }
  ")
```

Or via the Node.js crypto API:

```ts
import crypto from "crypto";
import fs from "fs";
import { canonicalize } from "@pramanasystems/bundle";

const manifest = JSON.parse(fs.readFileSync("release-manifest.json", "utf8"));
const sig = fs.readFileSync("release-manifest.sig", "utf8");
const pub = fs.readFileSync("trust/PramanaSystems-root.pub", "utf8");

const valid = crypto.verify(
  null,
  Buffer.from(canonicalize(manifest), "utf8"),
  pub,
  Buffer.from(sig, "base64")
);

console.log("Signature valid:", valid);
```

An invalid signature means the manifest was modified after signing or was signed with a different key.

---

## Step 3 — Artifact Hash Verification

`release-manifest.json` records a SHA-256 hash for every distribution artifact:

```json
{
  "artifacts": [
    { "name": "@pramanasystems/core", "version": "1.0.4", "hash": "sha256:abc123..." },
    ...
  ]
}
```

Verification:

```bash
# For each artifact
sha256sum @pramanasystems-core-1.0.4.tgz
# Compare against manifest entry
```

A hash mismatch indicates the artifact was tampered with after the manifest was generated.

---

## Step 4 — Provenance Metadata

`release-manifest.json` includes provenance metadata:

```json
{
  "release": {
    "version": "1.0.4",
    "commit": "<git-sha>",
    "tag": "v1.0.4",
    "built_at": "<iso-timestamp>",
    "node_version": "20.x"
  }
}
```

Provenance verification:

- Confirm `commit` maps to the expected tag in the public repository
- Confirm `tag` matches the release version
- Confirm `built_at` is consistent with the release timeline

---

## Step 5 — Independent Rebuild (Optional)

Deterministic builds allow independent parties to confirm that a release was produced from its declared source.

Prerequisites:

```bash
node --version   # must match manifest node_version
npm --version
```

Rebuild:

```bash
git checkout <tag>
npm ci
npm run build --workspaces
```

Verify:

```bash
# Pack each package and compare hashes
npm pack --workspace packages/core
sha256sum pramanasystems-core-1.0.4.tgz
# Compare against manifest hash
```

Equivalent hashes confirm the build is reproducible. Divergent hashes indicate either a non-deterministic build step or a manifest discrepancy.

---

## Step 6 — Rebuild Attestation

`rebuild-attestation.json` records independent rebuild evidence:

```json
{
  "attested_at": "<iso-timestamp>",
  "node_version": "20.x",
  "platform": "<os>",
  "artifacts": [
    { "name": "@pramanasystems/core", "hash": "sha256:abc123...", "matches_manifest": true }
  ]
}
```

Third-party rebuild attestations provide distributed evidence of reproducibility without requiring trust in any single party.

---

## Canonical Serialization

All manifest signing operates on canonical JSON: object keys sorted recursively, 2-space indentation (`JSON.stringify(sortedValue, null, 2)`). This is the same algorithm used by `@pramanasystems/bundle`'s `canonicalize()` function.

Verification of non-canonicalized content is invalid. Use `canonicalize()` from `@pramanasystems/bundle` to reproduce the exact bytes that were signed.

---

## Failure Semantics

Release verification fails closed. Verification terminates with an error when:

- The release signature is invalid
- An artifact hash mismatches the manifest
- Provenance metadata is internally inconsistent
- Trust-root validation fails
- The manifest cannot be canonicalized

Silent fallback is prohibited. A failed check is a hard failure.

---

## Trust-Lineage Verification

When the trust root has been rotated:

1. Obtain all historical root public keys from `trust/trust-root.json`.
2. Verify that each rotation record is signed by the prior root.
3. Confirm the current root is the terminal entry in the chain.
4. Use the root version that was active at release time to verify that release's signature.

Unverifiable trust transitions invalidate the entire chain.

---

## Verification Invariants

The following invariants apply to every release:

- Unsigned releases are invalid
- Unverifiable provenance is rejected
- Reproducibility mismatches are treated as failures
- Trust-root lineage must remain verifiable
- Canonical serialization is required for all signing and verification
- Provenance must remain independently reconstructable
- Portable verification must remain possible without infrastructure trust
