\# Manthan Core



Deterministic governance infrastructure for enforceable, auditable, and independently verifiable AI-driven decisions.



\## What is Manthan?



Manthan separates:

\- AI systems (probabilistic signal generation)

\- Governance systems (deterministic enforcement)



It ensures that decisions are:

\- reproducible

\- verifiable

\- replay-safe

\- cryptographically attestable



\---



\## Core Principle



AI → Signals → Deterministic Governance → Attested Decision



AI never directly enforces outcomes.



\---



\## Packages



| Package | Responsibility |

|--------|------|

| @manthan/bundle | Governance artifacts \& manifests |

| @manthan/crypto | Signing \& verification primitives |

| @manthan/governance | Policy lifecycle engine |

| @manthan/execution | Deterministic runtime execution |

| @manthan/verifier | Independent verification layer |

| @manthan/core | SDK orchestration layer |



\---



\## Install (local dev)



```bash

npm install

Build

npm run build

Test

npm run test

Validate full system

npm run release:validate

Key Properties

Deterministic execution

Replay protection

Fail-closed enforcement

Immutable provenance

Independent verification

Portable governance runtime

License



Apache-2.0





\---



\# 2. Add `.npmignore` safety check



Run:



```powershell id="9t1xqm"

notepad .\\.npmignore



Add:



node\_modules

dist

tests

examples

manthan-consumer-test

\*.tgz

.git

.github

3\. Ensure clean publish boundary



Run:



npm run pack:packages



Check only intended files exist.



4\. Final system validation

npm run release:validate

