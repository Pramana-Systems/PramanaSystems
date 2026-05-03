import type {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";

// Pull in @fastify/swagger's FastifySchema augmentation (tags, summary, etc.)
import type {} from "@fastify/swagger";

import type {
  Signer,
  Verifier,
  RuntimeManifest,
  ExecutionAttestation,
} from "@pramanasystems/execution";

import { executeSimple } from "@pramanasystems/execution";
import { verifyAttestation } from "@pramanasystems/verifier";

// ── Reusable JSON Schema fragments ────────────────────────────────────────

const S_EXECUTION_RESULT = {
  type: "object",
  properties: {
    execution_id:   { type: "string", format: "uuid" },
    policy_id:      { type: "string" },
    policy_version: { type: "string" },
    schema_version: { type: "string" },
    runtime_version:{ type: "string" },
    runtime_hash:   { type: "string" },
    decision:       { type: "string" },
    signals_hash:   { type: "string" },
    executed_at:    { type: "string", format: "date-time" },
  },
  required: [
    "execution_id", "policy_id", "policy_version", "schema_version",
    "runtime_version", "runtime_hash", "decision", "signals_hash", "executed_at",
  ],
};

const S_ATTESTATION = {
  type: "object",
  properties: {
    result:    S_EXECUTION_RESULT,
    signature: { type: "string", description: "Base64 Ed25519 signature over the result" },
  },
  required: ["result", "signature"],
};

const S_VERIFICATION_RESULT = {
  type: "object",
  properties: {
    valid: { type: "boolean" },
    checks: {
      type: "object",
      properties: {
        signature_verified: { type: "boolean" },
        runtime_verified:   { type: "boolean" },
        schema_compatible:  { type: "boolean" },
      },
      required: ["signature_verified", "runtime_verified", "schema_compatible"],
    },
  },
  required: ["valid", "checks"],
};

const S_ERROR = {
  type: "object",
  properties: { error: { type: "string" } },
  required: ["error"],
};

const S_NOT_IMPLEMENTED = {
  ...S_ERROR,
  properties: { error: { type: "string", enum: ["Not implemented"] } },
};

// ── Deps / body types ─────────────────────────────────────────────────────

/** Runtime dependencies injected into each route handler at registration time. */
export interface RouteDeps {
  /** Signer used to produce attestations in the `/execute` route. */
  signer: Signer;
  /** Verifier used to check attestation signatures in the `/verify` route. */
  verifier: Verifier;
  /** Active runtime manifest embedded in every execution result. */
  runtimeManifest: RuntimeManifest;
}

interface ExecuteBody {
  policy_id: string;
  policy_version: string;
  decision_type: string;
  signals_hash: string;
}

// ── Route registration ────────────────────────────────────────────────────

/**
 * Registers all governance API routes on `app`.
 *
 * Active routes (fully implemented):
 * - `GET  /health`   — runtime health and version.
 * - `POST /execute`  — deterministic governance decision with signed attestation.
 * - `POST /verify`   — independent attestation verification.
 *
 * Stub routes (return `501 Not Implemented`):
 * - `GET  /runtime/manifest`    — signed runtime bundle manifest.
 * - `GET  /runtime/capabilities` — runtime capability declarations.
 * - `POST /evaluate`             — policy dry-run (no attestation).
 * - `POST /simulate`             — full pipeline dry-run (no side effects).
 *
 * @param app  - The Fastify instance to register routes on.
 * @param deps - Signer, verifier, and runtime manifest to inject into route handlers.
 */
export function registerRoutes(
  app: FastifyInstance,
  deps: RouteDeps
): void {
  const { signer, verifier, runtimeManifest } = deps;

  // GET /health ─────────────────────────────────────────────────────────

  app.get("/health", {
    schema: {
      tags: ["Runtime"],
      summary: "Health check",
      response: {
        200: {
          description: "Server is healthy",
          type: "object",
          properties: {
            status:    { type: "string", enum: ["ok"] },
            version:   { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
          required: ["status", "version", "timestamp"],
        },
      },
    },
  }, async () => ({
    status: "ok" as const,
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  }));

  // POST /execute ───────────────────────────────────────────────────────

  app.post<{ Body: ExecuteBody }>("/execute", {
    schema: {
      tags: ["Execution"],
      summary: "Execute a governance decision",
      description:
        "Issues an execution token, runs the deterministic governance runtime, " +
        "and returns a signed ExecutionAttestation.",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          policy_id:      { type: "string", description: "Policy identifier" },
          policy_version: { type: "string", description: "Semantic version of the policy" },
          decision_type:  { type: "string", description: "Decision type to execute (e.g. approve, deny)" },
          signals_hash:   { type: "string", description: "SHA-256 hex digest of the input signals payload" },
        },
        required: ["policy_id", "policy_version", "decision_type", "signals_hash"],
      },
      response: {
        200: { description: "Signed execution attestation", ...S_ATTESTATION },
        400: { description: "Missing or invalid request fields", ...S_ERROR },
        422: { description: "Execution failed (policy not found, token expired, replay detected)", ...S_ERROR },
      },
    },
  }, async (
    req: FastifyRequest<{ Body: ExecuteBody }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { policy_id, policy_version, decision_type, signals_hash } =
      req.body ?? ({} as ExecuteBody);

    if (!policy_id || !policy_version || !decision_type || !signals_hash) {
      reply.code(400).send({
        error: "Missing required fields: policy_id, policy_version, decision_type, signals_hash",
      });
      return;
    }

    try {
      const attestation = executeSimple(
        {
          policyId:      policy_id,
          policyVersion: policy_version,
          decisionType:  decision_type,
          signalsHash:   signals_hash,
        },
        signer,
        verifier
      );
      reply.send(attestation);
    } catch (err) {
      reply.code(422).send({ error: (err as Error).message });
    }
  });

  // POST /verify ────────────────────────────────────────────────────────

  app.post<{ Body: ExecutionAttestation }>("/verify", {
    schema: {
      tags: ["Verification"],
      summary: "Verify an execution attestation",
      description:
        "Checks the cryptographic signature, runtime hash, and schema version " +
        "of an attestation produced by POST /execute.",
      security: [{ bearerAuth: [] }],
      body: {
        ...S_ATTESTATION,
        description: "An ExecutionAttestation as returned by POST /execute",
      },
      response: {
        200:  { description: "Verification result with per-check breakdown", ...S_VERIFICATION_RESULT },
        400:  { description: "Malformed attestation body", ...S_ERROR },
        422:  { description: "Verification threw an unexpected error", ...S_ERROR },
      },
    },
  }, async (
    req: FastifyRequest<{ Body: ExecutionAttestation }>,
    reply: FastifyReply
  ): Promise<void> => {
    const body = req.body;

    if (!body?.result || typeof body.signature !== "string") {
      reply.code(400).send({
        error: "Body must be an ExecutionAttestation with result and signature fields",
      });
      return;
    }

    try {
      const result = verifyAttestation(body, verifier, runtimeManifest);
      reply.send(result);
    } catch (err) {
      reply.code(422).send({ error: (err as Error).message });
    }
  });

  // ── 501 stubs ─────────────────────────────────────────────────────────

  const stub = async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.code(501).send({ error: "Not implemented" });
  };

  app.get("/runtime/manifest", {
    schema: {
      tags: ["Runtime"],
      summary: "Runtime bundle manifest",
      description: "Returns the signed bundle manifest for the active governance runtime.",
      security: [{ bearerAuth: [] }],
      response: { 501: { description: "Not yet implemented", ...S_NOT_IMPLEMENTED } },
    },
  }, stub);

  app.get("/runtime/capabilities", {
    schema: {
      tags: ["Runtime"],
      summary: "Runtime capability declarations",
      description: "Lists the capabilities supported by this runtime instance.",
      security: [{ bearerAuth: [] }],
      response: { 501: { description: "Not yet implemented", ...S_NOT_IMPLEMENTED } },
    },
  }, stub);

  app.post("/evaluate", {
    schema: {
      tags: ["Execution"],
      summary: "Evaluate a policy without executing",
      description: "Dry-run policy evaluation — computes a decision without issuing an attestation or consuming a replay slot.",
      security: [{ bearerAuth: [] }],
      body: { type: "object" },
      response: { 501: { description: "Not yet implemented", ...S_NOT_IMPLEMENTED } },
    },
  }, stub);

  app.post("/simulate", {
    schema: {
      tags: ["Execution"],
      summary: "Simulate a governance decision dry-run",
      description: "Runs the full execution pipeline in simulation mode — no side effects, no attestation produced.",
      security: [{ bearerAuth: [] }],
      body: { type: "object" },
      response: { 501: { description: "Not yet implemented", ...S_NOT_IMPLEMENTED } },
    },
  }, stub);
}
