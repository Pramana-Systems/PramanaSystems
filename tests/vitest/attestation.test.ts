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
            signer,
            verifier
          );

        const valid =
          verifyExecutionResult(
            attestation.result,
            attestation.signature,
            verifier
          );

        expect(valid)
          .toBe(true);
      }
    );
  }
);