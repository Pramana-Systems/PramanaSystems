# @pramanasystems/governance

Policy lifecycle tooling for the PramanaSystems deterministic governance runtime.

[![npm](https://img.shields.io/npm/v/@pramanasystems/governance)](https://www.npmjs.com/package/@pramanasystems/governance)

---

## Overview

`@pramanasystems/governance` provides the policy management layer — creating, validating, upgrading, and bundling governance policies before they enter the deterministic execution runtime.

---

## Installation

```bash
npm install @pramanasystems/governance
```

---

## API

### `definePolicy(options): PolicyDefinition`

Typed policy builder. Use this to define governance policies with full TypeScript inference.

```ts
import { definePolicy } from "@pramanasystems/governance";

const policy = definePolicy({
  id:      "loan-approval",
  version: "v1",
  rules: [
    { decision: "approve", condition: (ctx) => ctx.creditScore >= 700 },
    { decision: "deny",    condition: () => true },
  ],
});
```

### `createPolicy(definition): Policy`

Creates a governance policy from a definition object.

```ts
import { createPolicy } from "@pramanasystems/governance";

const policy = createPolicy({
  id:      "claims-processing",
  version: "v1",
  rules:   [...],
});
```

### `validatePolicy(policy): void`

Validates a policy structure. Throws if the policy is malformed or violates governance invariants.

```ts
import { validatePolicy } from "@pramanasystems/governance";

validatePolicy(policy);  // throws on invalid policy
```

### `upgradePolicy(policy, nextVersion): Policy`

Creates an upgraded version of an existing policy, preserving provenance.

```ts
import { upgradePolicy } from "@pramanasystems/governance";

const v2 = upgradePolicy(policyV1, "v2");
```

### `generateBundle(policy): PolicyBundle`

Generates a deterministic, hashable bundle from a policy.

```ts
import { generateBundle } from "@pramanasystems/governance";

const bundle = generateBundle(policy);
```

---

## Types

### `RuntimeRequirements`

Specifies minimum runtime version and schema version compatibility requirements for a governance deployment.

```ts
import type { RuntimeRequirements } from "@pramanasystems/governance";
```

### `ExecutionRequirements`

Specifies execution-level constraints — allowed decision types, required signal fields, etc.

```ts
import type { ExecutionRequirements } from "@pramanasystems/governance";
```

---

## License

Apache-2.0
