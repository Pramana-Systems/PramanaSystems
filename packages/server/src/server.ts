import Fastify, { type FastifyInstance } from "fastify";

import { signer, verifier, runtimeManifest } from "./runtime.js";
import { authHook } from "./auth.js";
import { registerRoutes } from "./routes.js";

/**
 * Creates and configures the PramanaSystems Fastify HTTP server.
 *
 * Wires up the Bearer-token auth pre-handler and registers all seven governance
 * routes via {@link registerRoutes}.  The returned instance must be started with
 * `app.listen(...)` by the caller.
 *
 * Key points:
 * - The signer/verifier/runtimeManifest are resolved from environment variables,
 *   dev-keys on disk, or an ephemeral Ed25519 key pair in that order.
 * - Set `PRAMANA_API_KEY` to enable authentication; omit it for dev mode.
 */
export function createServer(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.addHook("preHandler", authHook);

  registerRoutes(app, { signer, verifier, runtimeManifest });

  return app;
}
