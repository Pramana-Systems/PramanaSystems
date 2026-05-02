import type { FastifyRequest, FastifyReply } from "fastify";

export async function authHook(
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const apiKey = process.env.PRAMANA_API_KEY;
  if (!apiKey) return; // dev mode — skip auth

  const auth = req.headers.authorization;
  if (auth !== `Bearer ${apiKey}`) {
    reply.code(401).send({ error: "Unauthorized" });
  }
}
