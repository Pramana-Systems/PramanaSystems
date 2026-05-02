import {
  describe,
  expect,
  test,
} from "vitest";

import {
  executeDecision,
  MemoryReplayStore,
} from "@pramanasystems/execution";

import {
  executionContext,
} from "../../../fixtures/execution-context-fixture";

describe(
  "Missing Attestation Negative Conformance",
  () => {
    test(
      "missing attestations fail closed",
      () => {
        const replayStore =
          new MemoryReplayStore();

        const context = {
          ...executionContext,

          runtime_requirements: {
            ...executionContext.runtime_requirements,

            required_capabilities: [
              "replay-protection",
            ],
          },

          runtime_manifest: {
            ...executionContext.runtime_manifest,

            capabilities:
              executionContext
                .runtime_manifest
                .capabilities
                .filter(
                  (
                    capability
                  ) =>
                    capability !==
                    "attestation-signing"
                ),
          },
        };

        expect(() =>
          executeDecision(
            context,
            replayStore
          )
        ).toThrow(
          "Missing execution requirement: attestation-signing"
        );
      }
    );
  }
);



