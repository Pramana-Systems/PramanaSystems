import crypto from "crypto";

import {
  describe,
  expect,
  test,
} from "vitest";

import {
  canonicalize,
} from "@pramanasystems/bundle";

import {
  getRuntimeManifest,
} from "@pramanasystems/execution";

describe(
  "runtime hash determinism",
  () => {
    test(
      "runtime hash is derived from declared runtime semantics",
      () => {
        const manifest =
          getRuntimeManifest();

        const {
          runtime_hash,
          ...runtimeDefinition
        } = manifest;

        const expectedHash =
          crypto
            .createHash(
              "sha256"
            )
            .update(
              canonicalize(
                runtimeDefinition
              )
            )
            .digest(
              "hex"
            );

        expect(
          runtime_hash
        ).toBe(
          expectedHash
        );
      }
    );
  }
);
