import fs from "fs";

import Fastify from "fastify";

import swagger from "@fastify/swagger";

import {
  registerRoutes,
} from "../packages/server/src/routes.js";

import {
  signer,
  verifier,
  runtimeManifest,
} from "../packages/server/src/runtime.js";

async function generateSpec(): Promise<void> {
  const app = Fastify();

  await app.register(
    swagger,
    {
      openapi: {
        openapi: "3.0.3",

        info: {
          title:
            "PramanaSystems Runtime API",

          description:
            "Deterministic governance runtime — execute and independently verify " +
            "signed policy decisions with full auditability.",

          version:
            "1.0.0",

          license: {
            name: "Apache-2.0",
            url:  "https://www.apache.org/licenses/LICENSE-2.0",
          },

          contact: {
            url: "https://github.com/Pramana-Systems/PramanaSystems",
          },
        },

        servers: [
          {
            url:         "http://localhost:3000",
            description: "Local development",
          },
        ],

        tags: [
          {
            name:        "Runtime",
            description: "Runtime metadata and health",
          },
          {
            name:        "Execution",
            description: "Governance decision execution",
          },
          {
            name:        "Verification",
            description: "Independent attestation verification",
          },
        ],

        components: {
          securitySchemes: {
            bearerAuth: {
              type:        "http",
              scheme:      "bearer",
              description:
                "API key passed as a Bearer token. Only enforced when the " +
                "PRAMANA_API_KEY environment variable is set; omit in dev mode.",
            },
          },
        },
      },
    }
  );

  registerRoutes(
    app,
    {
      signer,
      verifier,
      runtimeManifest,
    }
  );

  await app.ready();

  const spec =
    app.swagger();

  fs.writeFileSync(
    "./openapi.json",
    JSON.stringify(
      spec,
      null,
      2
    )
  );

  console.log(
    "OpenAPI spec exported to openapi.json"
  );

  process.exit(0);
}

generateSpec();
