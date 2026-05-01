\# pramanasystems Quickstart Example



\## Purpose



This example demonstrates a minimal deterministic governance workflow using pramanasystems.



The example shows:



\- governed signals

\- deterministic execution

\- execution attestation

\- independent verification



\---



\# Governance Flow



```text

Governed Signals

&#x20;       ↓

Deterministic Execution

&#x20;       ↓

Execution Attestation

&#x20;       ↓

Independent Verification

Step 1 — Run Governance Validation

npm run check



This validates:



deterministic governance invariants

runtime compatibility

replay-safe semantics

fail-closed behavior

verifier compatibility

Step 2 — Generate Execution Attestation

node tools/independent-verifier/generate-attestation.mjs



Expected output:



Execution attestation generated

Step 3 — Verify Execution Attestation

node tools/independent-verifier/index.mjs verify-attestation



Expected output:



ATTESTATION VERIFIED: true

Step 4 — Verify Release Provenance

node tools/independent-verifier/index.mjs verify-release



Expected output:



RELEASE VERIFIED: true

Step 5 — Verify Runtime Identity

node tools/independent-verifier/index.mjs verify-runtime



Expected output:



RUNTIME VERIFIED: true

Deterministic Governance Guarantees



This workflow preserves:



deterministic execution

immutable provenance

replay-safe enforcement

fail-closed verification

portable trust semantics

independently reproducible governance evidence

Governance Principle



pramanasystems exists to preserve deterministic governance trust independently of infrastructure ownership.





\---



\# Then Add README Reference



Open:



```text id="5t1xwr"

D:\\last\\pramanasystems-core\\README.md



Under:



\# Quick Start



add:



Minimal runnable example:



\- `examples/quickstart/README.md`



