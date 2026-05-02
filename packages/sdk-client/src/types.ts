import type { paths } from "./openapi.js";

// ── Extracted from openapi.d.ts via indexed-access types ─────────────────
// All types here are derived directly from the generated spec — no manual
// duplication means they stay in sync whenever `npm run generate` is re-run.

/** Response body for GET /health */
export type HealthResponse =
  paths["/health"]["get"]["responses"][200]["content"]["application/json"];

/** Request body for POST /execute */
export type ExecuteRequest =
  paths["/execute"]["post"]["requestBody"]["content"]["application/json"];

/** The inner result record inside an ExecutionAttestation */
export type ExecutionResult =
  paths["/execute"]["post"]["responses"][200]["content"]["application/json"]["result"];

/** Response body for POST /execute — pass this directly to verify() */
export type ExecutionAttestation =
  paths["/execute"]["post"]["responses"][200]["content"]["application/json"];

/** Response body for POST /verify */
export type VerificationResult =
  paths["/verify"]["post"]["responses"][200]["content"]["application/json"];

/** Error body returned on 4xx / 5xx responses */
export type ApiErrorBody =
  paths["/execute"]["post"]["responses"][400]["content"]["application/json"];
