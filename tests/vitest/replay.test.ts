import fs from "fs";

import {
  describe,
  expect,
  test,
} from "vitest";

import {
  issueExecutionToken,

  signExecutionToken,

  executeDecision,

  LocalSigner,
} from "@manthan/runtime";

const signer =
  new LocalSigner(
    fs.readFileSync(
      "./manthan_bundle_key",
      "utf8"
    )
  );

describe(
  "replay protection",
  () => {
    test(
      "same token cannot execute twice",
      () => {

        const token =
          issueExecutionToken(
            "claims-approval",
            "v1",
            "approve-claim",
            "signals-hash-example"
          );

        const signature =
          signExecutionToken(
            token,
            signer
          );

        executeDecision(
          token,
          signature,
          signer
        );

        expect(() =>
          executeDecision(
            token,
            signature,
            signer
          )
        ).toThrow(
          "Replay attack detected"
        );
      }
    );
  }
);