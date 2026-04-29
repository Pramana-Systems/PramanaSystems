import {
  z,
} from "zod";

export const EvaluateRequestSchema =
  z.object({
    policy_id:
      z.string(),

    policy_version:
      z.string(),

    signals:
      z.record(
        z.string(),
        z.unknown()
      ),
  });

export const ExecuteRequestSchema =
  z.object({
    token:
      z.object({
        execution_id:
          z.string(),

        policy_id:
          z.string(),

        policy_version:
          z.string(),

        decision_type:
          z.string(),

        bundle_hash:
          z.string(),

        signals_hash:
          z.string(),

        issued_at:
          z.string(),

        expires_at:
          z.string(),
      }),

    signature:
      z.string(),
  });

export const VerifyRequestSchema =
  z.object({
    result:
      z.object({
        execution_id:
          z.string(),

        policy_id:
          z.string(),

        policy_version:
          z.string(),

        schema_version:
          z.string(),

        runtime_version:
          z.string(),

        runtime_hash:
          z.string(),

        decision:
          z.string(),

        signals_hash:
          z.string(),

        executed_at:
          z.string(),
      }),

    signature:
      z.string(),
  });