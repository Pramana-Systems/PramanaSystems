import {
  defineConfig,
} from "vitest/config";

import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@manthan/bundle":
        path.resolve(
          __dirname,
          "packages/bundle/src"
        ),

      "@manthan/crypto":
        path.resolve(
          __dirname,
          "packages/crypto/src"
        ),

      "@manthan/governance":
        path.resolve(
          __dirname,
          "packages/governance/src"
        ),

      "@manthan/execution":
        path.resolve(
          __dirname,
          "packages/execution/src"
        ),

      "@manthan/verifier":
        path.resolve(
          __dirname,
          "packages/verifier/src"
        ),

      "@manthan/core":
        path.resolve(
          __dirname,
          "packages/core/src"
        ),
    },
  },

  test: {
    environment: "node",

    pool: "forks",

    fileParallelism: false,
  },
});