import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

const API_KEY =
  process.env
    .MANTHAN_API_KEY;

export async function
verifyApiKey(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const provided =
    request.headers[
      "x-api-key"
    ];

  if (!API_KEY) {
    throw new Error(
      "Runtime API key not configured"
    );
  }

  if (
    provided !==
    API_KEY
  ) {
    return reply
      .status(401)
      .send({
        success: false,

        error: {
          code:
            "UNAUTHORIZED",

          message:
            "Invalid API key",
        },
      });
  }
}