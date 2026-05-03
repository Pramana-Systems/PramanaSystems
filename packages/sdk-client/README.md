# @pramanasystems/sdk-client

Type-safe fetch client for the PramanaSystems governance server.

[![npm](https://img.shields.io/npm/v/@pramanasystems/sdk-client)](https://www.npmjs.com/package/@pramanasystems/sdk-client)

---

## Overview

`@pramanasystems/sdk-client` is a zero-dependency TypeScript client for `@pramanasystems/server`. Types are generated directly from `openapi.json` using `openapi-typescript`, so the client types are always in sync with the server API.

- **Zero runtime dependencies** — native `fetch` only
- **Fully typed** — all request bodies, responses, and error types are inferred from the OpenAPI spec
- **Throws on non-2xx** — errors surface as `PramanaApiError` with the HTTP status code attached

---

## Installation

```bash
npm install @pramanasystems/sdk-client
```

Requires Node.js ≥ 18 (for native `fetch`) or any environment with a global `fetch` implementation.

---

## Quick start

```ts
import { PramanaClient } from "@pramanasystems/sdk-client";

const client = new PramanaClient({
  baseUrl: "http://localhost:3000",
  // apiKey: "my-secret-key",  // include if PRAMANA_API_KEY is set on the server
});

// Check server health
const health = await client.health();
console.log(health.status);   // "ok"
console.log(health.version);  // "1.0.0"

// Execute a governance decision
const attestation = await client.execute({
  policy_id:      "loan-approval",
  policy_version: "v1",
  decision_type:  "approve",
  signals_hash:   "abc123signals",
});

console.log(attestation.result.decision);  // "approve"
console.log(attestation.signature);         // base64 Ed25519 signature

// Independently verify the attestation
const verification = await client.verify(attestation);
console.log(verification.valid);                          // true
console.log(verification.checks.signature_verified);      // true
console.log(verification.checks.runtime_verified);        // true
console.log(verification.checks.schema_compatible);       // true
```

---

## API

### `new PramanaClient(options)`

```ts
const client = new PramanaClient({
  baseUrl: "https://governance.example.com",
  apiKey:  "your-bearer-token",  // optional
});
```

| Option | Type | Required | Description |
|---|---|---|---|
| `baseUrl` | `string` | Yes | Base URL of the PramanaSystems server |
| `apiKey` | `string` | No | Sent as `Authorization: Bearer <apiKey>` |

---

### `client.health(): Promise<HealthResponse>`

```ts
const { status, version, timestamp } = await client.health();
```

---

### `client.execute(request): Promise<ExecutionAttestation>`

Runs the governance execution pipeline. Returns a signed `ExecutionAttestation`.

```ts
const attestation = await client.execute({
  policy_id:      "claims-processing",
  policy_version: "v2",
  decision_type:  "approve-claim",
  signals_hash:   "sha256-of-signals-payload",
});
```

| Field | Type | Description |
|---|---|---|
| `policy_id` | `string` | Policy identifier |
| `policy_version` | `string` | Semantic version of the policy |
| `decision_type` | `string` | Decision type to execute |
| `signals_hash` | `string` | SHA-256 hex digest of the input signals |

---

### `client.verify(attestation): Promise<VerificationResult>`

Independently verifies an attestation. Pass the return value from `execute()` directly.

```ts
const result = await client.verify(attestation);

if (!result.valid) {
  console.error("Attestation verification failed:", result.checks);
}
```

---

## Error handling

Non-2xx responses throw `PramanaApiError`:

```ts
import { PramanaClient, PramanaApiError } from "@pramanasystems/sdk-client";

try {
  await client.execute({ ... });
} catch (err) {
  if (err instanceof PramanaApiError) {
    console.error(`HTTP ${err.status}: ${err.message}`);
  }
}
```

`PramanaApiError.message` is populated from the server's `{ error: string }` response body, or from the HTTP status text if parsing fails.

---

## Types

All types are generated from `openapi.json` and re-exported from the package index:

```ts
import type {
  HealthResponse,
  ExecuteRequest,
  ExecutionResult,
  ExecutionAttestation,
  VerificationResult,
  ApiErrorBody,
  PramanaClientOptions,
} from "@pramanasystems/sdk-client";
```

---

## Regenerating types

If you modify `openapi.json`, regenerate the type definitions:

```bash
cd packages/sdk-client
npm run generate   # runs: openapi-typescript ../../openapi.json -o src/openapi.d.ts
npm run build
```

---

## License

Apache-2.0
