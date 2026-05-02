import Fastify, {
  type FastifyInstance,
  type FastifyRequest,
  type FastifyReply,
} from "fastify";

import {
  executeSimple,
  type ExecutionAttestation,
} from "@pramanasystems/execution";

import { verifyAttestation } from "@pramanasystems/verifier";

import { signer, verifier, runtimeManifest } from "./runtime.js";
import { authHook } from "./auth.js";

interface ExecuteBody {
  policy_id: string;
  policy_version: string;
  decision_type: string;
  signals_hash: string;
}

export function createServer(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.addHook("preHandler", authHook);

  // ── Fully implemented ──────────────────────────────────────────────────

  app.get("/health", async () => ({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  }));

  app.post<{ Body: ExecuteBody }>(
    "/execute",
    async (req: FastifyRequest<{ Body: ExecuteBody }>, reply: FastifyReply): Promise<void> => {
      const { policy_id, policy_version, decision_type, signals_hash } =
        req.body ?? ({} as ExecuteBody);

      if (!policy_id || !policy_version || !decision_type || !signals_hash) {
        reply.code(400).send({
          error:
            "Missing required fields: policy_id, policy_version, decision_type, signals_hash",
        });
        return;
      }

      try {
        const attestation = executeSimple(
          {
            policyId: policy_id,
            policyVersion: policy_version,
            decisionType: decision_type,
            signalsHash: signals_hash,
          },
          signer,
          verifier
        );
        reply.send(attestation);
      } catch (err) {
        reply.code(422).send({ error: (err as Error).message });
      }
    }
  );

  app.post<{ Body: ExecutionAttestation }>(
    "/verify",
    async (
      req: FastifyRequest<{ Body: ExecutionAttestation }>,
      reply: FastifyReply
    ): Promise<void> => {
      const body = req.body;

      if (!body?.result || typeof body.signature !== "string") {
        reply.code(400).send({
          error:
            "Body must be an ExecutionAttestation with result and signature fields",
        });
        return;
      }

      try {
        const result = verifyAttestation(body, verifier, runtimeManifest);
        reply.send(result);
      } catch (err) {
        reply.code(422).send({ error: (err as Error).message });
      }
    }
  );

  // ── 501 stubs ──────────────────────────────────────────────────────────

  const notImplemented = async (
    _req: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    reply.code(501).send({ error: "Not implemented" });
  };

  app.get("/runtime/manifest", notImplemented);
  app.get("/runtime/capabilities", notImplemented);
  app.post("/evaluate", notImplemented);
  app.post("/simulate", notImplemented);

  return app;
}
