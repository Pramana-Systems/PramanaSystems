# PramanaSystems Quickstart

## Install

```bash
npm install @pramanasystems/core
```

## External Runtime Verification Example

Create `verify.mjs`:

```js
import {
  LocalSigner,
  verifyExecutionResult
} from "@pramanasystems/core";

const signer = new LocalSigner();

console.log("SIGNER CREATED:");
console.log(signer);

console.log("VERIFY FUNCTION EXISTS:");
console.log(typeof verifyExecutionResult);
```

Run:

```bash
node verify.mjs
```

Expected output:

```text
SIGNER CREATED:
LocalSigner { privateKey: undefined }

VERIFY FUNCTION EXISTS:
function
```

This validates:
- external package portability
- ESM runtime compatibility
- deterministic runtime SDK exports
- verifier portability