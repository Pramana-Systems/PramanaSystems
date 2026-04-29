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

  LocalVerifier,
} from "@manthan/runtime";

const signer =
  new LocalSigner(
    fs.readFileSync(
      "./test-keys/manthan_test_key",
      "utf8"
    )
  );

const verifier =
  new LocalVerifier(
    fs.readFileSync(
      "./test-keys/manthan_test_key.pub",
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
          signer,
          verifier
        );

        expect(() =>
          executeDecision(
            token,
            signature,
            signer,
            verifier
          )
        ).toThrow(
          "Replay attack detected"
        );
      }
    );
  }
);