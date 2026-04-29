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

  verifyExecutionResult,

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
  "execution attestation verification",
  () => {
    test(
      "signed execution attestation verifies",
      () => {

        const token =
          issueExecutionToken(
            "claims-approval",
            "v1",
            "approve-claim",
            "signals-hash-example"
          );

        const tokenSignature =
          signExecutionToken(
            token,
            signer
          );

        const attestation =
          executeDecision(
            token,
            tokenSignature,
            signer
          );

        const valid =
          verifyExecutionResult(
            attestation.result,
            attestation.signature
          );

        expect(valid)
          .toBe(true);
      }
    );
  }
);