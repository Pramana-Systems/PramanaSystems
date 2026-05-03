# @pramanasystems/bundle

Deterministic artifact canonicalization, hashing, and bundle I/O for the PramanaSystems governance runtime.

[![npm](https://img.shields.io/npm/v/@pramanasystems/bundle)](https://www.npmjs.com/package/@pramanasystems/bundle)

---

## Overview

`@pramanasystems/bundle` provides the canonical serialization foundation that makes PramanaSystems governance decisions independently verifiable.

Every signed governance artifact — execution results, runtime manifests, policy bundles — is signed over the **canonical JSON** form produced by this package. This ensures that:

- the same object always serializes to the same byte sequence regardless of property insertion order
- signatures can be independently reproduced and verified by any party
- artifact hashes are stable across platforms and runtimes

---

## Installation

```bash
npm install @pramanasystems/bundle
```

---

## API

### `canonicalize(value: unknown): string`

Produces a deterministic JSON string following RFC 8785 (JSON Canonicalization Scheme). Keys are sorted recursively; the output is stable across property insertion orders.

```ts
import { canonicalize } from "@pramanasystems/bundle";

const json = canonicalize({ b: 2, a: 1 });
// '{"a":1,"b":2}'
```

### `hashArtifact(content: string): string`

Returns a SHA-256 hex digest of the given string.

```ts
import { hashArtifact } from "@pramanasystems/bundle";

const hash = hashArtifact('{"a":1,"b":2}');
// "e3b0c44298fc1c14..." (hex)
```

### Bundle I/O

```ts
import { readBundle, writeBundle } from "@pramanasystems/bundle";

// Write a governance bundle to disk
await writeBundle("./output/bundle.json", bundle);

// Read it back
const loaded = await readBundle("./output/bundle.json");
```

### Manifest generation

```ts
import { generateManifest } from "@pramanasystems/bundle";

const manifest = generateManifest(artifacts);
```

### `traverseBundle(dir: string): string[]`

Returns sorted file paths within a bundle directory, enabling deterministic hash computation over the bundle tree.

### Runtime requirements

```ts
import { checkRuntimeRequirements } from "@pramanasystems/bundle";

checkRuntimeRequirements(requirements);
```

---

## Role in the governance pipeline

```
ExecutionResult (object)
        │
   canonicalize()   ← this package
        │
   canonical JSON string
        │
   sign / hash / verify
```

`canonicalize()` is called internally by `signExecutionResult()` and `verifyExecutionResult()` in `@pramanasystems/execution`. You only need to call it directly when building custom signing or verification flows.

---

## License

Apache-2.0
