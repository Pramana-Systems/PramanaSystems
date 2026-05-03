# @pramanasystems/crypto

Ed25519 key management, signing, and verification primitives for the PramanaSystems governance runtime.

[![npm](https://img.shields.io/npm/v/@pramanasystems/crypto)](https://www.npmjs.com/package/@pramanasystems/crypto)

---

## Overview

`@pramanasystems/crypto` provides the low-level cryptographic primitives used throughout PramanaSystems. It handles:

- Ed25519 keypair generation
- PEM key serialization and persistence
- Payload signing (returns base64)
- Signature verification
- Runtime manifest signature verification

All operations use Node.js's built-in `crypto` module — no external cryptographic dependencies.

---

## Installation

```bash
npm install @pramanasystems/crypto
```

---

## API

### Key generation

```ts
import { generateKeyPair } from "@pramanasystems/crypto";

const { privateKeyPem, publicKeyPem } = generateKeyPair();
```

### Key loading

```ts
import { loadPrivateKey, loadPublicKey } from "@pramanasystems/crypto";

const privateKey = loadPrivateKey(privateKeyPem);
const publicKey  = loadPublicKey(publicKeyPem);
```

### Signing

```ts
import { sign } from "@pramanasystems/crypto";

const signature = sign(payload, privateKey);
// Returns a base64-encoded Ed25519 signature
```

### Verification

```ts
import { verify } from "@pramanasystems/crypto";

const ok = verify(payload, signature, publicKey);
// Returns boolean
```

### Key persistence

```ts
import { saveKeyPair, loadKeyPair } from "@pramanasystems/crypto";

await saveKeyPair("./dev-keys", privateKeyPem, publicKeyPem);
const { privateKeyPem, publicKeyPem } = await loadKeyPair("./dev-keys");
```

### Manifest signature verification

```ts
import { verifyManifestSignature } from "@pramanasystems/crypto";

const ok = verifyManifestSignature(manifest, publicKey);
```

---

## Algorithm

All signatures use **Ed25519** via Node.js `crypto.sign` / `crypto.verify` with `algorithm: null` (the algorithm is encoded in the key type for Ed25519).

For AWS KMS integration using ECDSA-P256, see `AwsKmsSigner` in `@pramanasystems/execution`.

---

## License

Apache-2.0
