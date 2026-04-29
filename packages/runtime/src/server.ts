import swagger from "@fastify/swagger";

import swaggerUi from "@fastify/swagger-ui";

import Fastify from "fastify";

import {
  resolveTraceId,
} from "./trace";

import {
  logRuntimeEvent,
} from "./runtime-logger";

import {
  verifyApiKey,
} from "./auth-middleware";

import {
  evaluatePolicy,
} from "./evaluator";

import {
  executeDecision,
} from "./execute";

import {
  hashRuntime,
} from "./hash-runtime";

import {
  verifyExecutionResult,
} from "./verify-execution-result";

declare module "fastify" {
  interface FastifyRequest {
    startTime?: number;
  }
}

const server =
  Fastify();

server.addHook(
  "onRequest",
  async (
    request
  ) => {
    request.startTime =
      Date.now();
  }
);

server.addHook(
  "onResponse",
  async (
    request,
    reply
  ) => {
    const traceId =
      resolveTraceId(
        request.headers[
          "x-trace-id"
        ] as string
      );

    const startTime =
      request.startTime ?? 0;

    const duration =
      Date.now() -
      startTime;

    logRuntimeEvent({
      trace_id:
        traceId,

      endpoint:
        request.url,

      method:
        request.method,

      status:
        reply.statusCode,

      duration_ms:
        duration,

      timestamp:
        new Date()
          .toISOString(),
    });
  }
);

server.setErrorHandler(
  (
    error,
    _request,
    reply
  ) => {
    return reply
      .status(400)
      .send({
        success: false,

        error: {
          code:
            "RUNTIME_ERROR",

          message:
            (error as Error)
              .message,
        },
      });
  }
);

server.get(
  "/health",

  {
    schema: {
      tags: [
        "system",
      ],

      summary:
        "Runtime health check",

      response: {
        200: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
            },

            status: {
              type: "string",
            },
          },
        },
      },
    },
  },

  async () => {
    return {
      success: true,

      status: "ok",
    };
  }
);

server.get(
  "/runtime/manifest",

  {
    schema: {
      tags: [
        "runtime",
      ],

      summary:
        "Runtime provenance manifest",
    },
  },

  async () => {
    return {
      success: true,

      runtime_version:
        "1.0.0",

      schema_version:
        "1.0.0",

      runtime_hash:
        hashRuntime(),
    };
  }
);

server.get(
  "/runtime/capabilities",

  {
    schema: {
      tags: [
        "runtime",
      ],

      summary:
        "Runtime capabilities",
    },
  },

  async () => {
    return {
      success: true,

      runtime_version:
        "1.0.0",

      schema_versions: [
        "1.0.0",
      ],

      endpoints: [
        "/health",
        "/runtime/manifest",
        "/runtime/capabilities",
        "/evaluate",
        "/simulate",
        "/execute",
        "/verify",
        "/docs",
      ],

      features: {
        deterministic_evaluation:
          true,

        replay_protection:
          true,

        attestation_signing:
          true,

        runtime_provenance:
          true,

        distributed_replay:
          true,

        async_signers:
          true,

        authenticated_runtime:
          true,

        request_tracing:
          true,

        runtime_observability:
          true,

        graceful_shutdown:
          true,

        openapi_support:
          true,
      },

      supported_signers: [
        "local",
        "aws-kms",
      ],

      supported_replay_stores:
        [
          "memory",
          "redis",
        ],
    };
  }
);

server.post(
  "/evaluate",

  {
    preHandler:
      verifyApiKey,

    schema: {
      tags: [
        "governance",
      ],

      summary:
        "Evaluate deterministic policy",

      body: {
        type: "object",

        required: [
          "policy_id",
          "policy_version",
          "signals",
        ],

        properties: {
          policy_id: {
            type: "string",
          },

          policy_version: {
            type: "string",
          },

          signals: {
            type: "object",
          },
        },
      },
    },
  },

  async (
    request
  ) => {
    const traceId =
      resolveTraceId(
        request.headers[
          "x-trace-id"
        ] as string
      );

    const body =
      request.body as {
        policy_id: string;

        policy_version: string;

        signals: Record<
          string,
          unknown
        >;
      };

    const decision =
      evaluatePolicy(
        body.policy_id,
        body.policy_version,
        body.signals
      );

    return {
      success: true,

      trace_id:
        traceId,

      decision,
    };
  }
);

server.post(
  "/simulate",

  {
    preHandler:
      verifyApiKey,

    schema: {
      tags: [
        "governance",
      ],

      summary:
        "Simulate deterministic evaluation",

      body: {
        type: "object",

        required: [
          "policy_id",
          "policy_version",
          "signals",
        ],

        properties: {
          policy_id: {
            type: "string",
          },

          policy_version: {
            type: "string",
          },

          signals: {
            type: "object",
          },
        },
      },
    },
  },

  async (
    request
  ) => {
    const traceId =
      resolveTraceId(
        request.headers[
          "x-trace-id"
        ] as string
      );

    const body =
      request.body as {
        policy_id: string;

        policy_version: string;

        signals: Record<
          string,
          unknown
        >;
      };

    const decision =
      evaluatePolicy(
        body.policy_id,
        body.policy_version,
        body.signals
      );

    return {
      success: true,

      trace_id:
        traceId,

      simulated: true,

      policy_id:
        body.policy_id,

      policy_version:
        body.policy_version,

      runtime_hash:
        hashRuntime(),

      decision,
    };
  }
);

server.post(
  "/execute",

  {
    preHandler:
      verifyApiKey,

    schema: {
      tags: [
        "execution",
      ],

      summary:
        "Execute governed decision",

      body: {
        type: "object",

        required: [
          "token",
          "signature",
        ],

        properties: {
          token: {
            type: "object",
          },

          signature: {
            type: "string",
          },
        },
      },
    },
  },

  async (
    request
  ) => {
    const traceId =
      resolveTraceId(
        request.headers[
          "x-trace-id"
        ] as string
      );

    const body =
      request.body as {
        token: never;

        signature: string;
      };

    return {
      success: true,

      trace_id:
        traceId,

      attestation:
        executeDecision(
          body.token,
          body.signature
        ),
    };
  }
);

server.post(
  "/verify",

  {
    preHandler:
      verifyApiKey,

    schema: {
      tags: [
        "verification",
      ],

      summary:
        "Verify execution attestation",

      body: {
        type: "object",

        required: [
          "result",
          "signature",
        ],

        properties: {
          result: {
            type: "object",
          },

          signature: {
            type: "string",
          },
        },
      },
    },
  },

  async (
    request
  ) => {
    const traceId =
      resolveTraceId(
        request.headers[
          "x-trace-id"
        ] as string
      );

    const body =
      request.body as {
        result: never;

        signature: string;
      };

    const valid =
      verifyExecutionResult(
        body.result,
        body.signature
      );

    return {
      success: true,

      trace_id:
        traceId,

      valid,
    };
  }
);

async function
shutdown(): Promise<void> {

  console.log(
    "Shutting down Manthan runtime..."
  );

  try {
    await server.close();

    console.log(
      "Runtime shutdown complete"
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "Runtime shutdown failed",
      error
    );

    process.exit(1);
  }
}

process.on(
  "SIGINT",
  shutdown
);

process.on(
  "SIGTERM",
  shutdown
);

async function
bootstrap(): Promise<void> {

  await server.register(
    swagger,
    {
      openapi: {
        info: {
          title:
            "Manthan Runtime API",

          version:
            "1.0.0",
        },
      },
    }
  );

  await server.register(
    swaggerUi,
    {
      routePrefix:
        "/docs",
    }
  );

  try {

    const address =
      await server.listen({
        port: 3000,

        host:
          "0.0.0.0",
      });

    console.log(
      `Manthan runtime listening at ${address}`
    );

  } catch (error) {

    console.error(
      error
    );

    process.exit(1);
  }
}

bootstrap();