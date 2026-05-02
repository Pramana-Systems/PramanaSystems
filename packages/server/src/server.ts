import Fastify, { type FastifyInstance } from "fastify";

import { signer, verifier, runtimeManifest } from "./runtime.js";
import { authHook } from "./auth.js";
import { registerRoutes } from "./routes.js";

export function createServer(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.addHook("preHandler", authHook);

  registerRoutes(app, { signer, verifier, runtimeManifest });

  return app;
}
