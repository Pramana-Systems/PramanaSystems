import { useState, useMemo, FormEvent } from "react";
import { PramanaClient, PramanaApiError } from "@pramanasystems/sdk-client";
import type { ExecutionAttestation } from "@pramanasystems/sdk-client";
import { useApp } from "../lib/ctx.ts";
import { JsonViewer } from "../components/JsonViewer.tsx";
import { Spinner } from "../components/Spinner.tsx";

interface FormState {
  policy_id: string;
  policy_version: string;
  decision_type: string;
  signals_hash: string;
}

const INITIAL: FormState = {
  policy_id: "",
  policy_version: "v1",
  decision_type: "approve",
  signals_hash: "",
};

function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 font-mono transition focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      />
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export function ExecutePage() {
  const { settings, setLastAttestation } = useApp();
  const client = useMemo(
    () => new PramanaClient({ baseUrl: settings.baseUrl, ...(settings.apiKey ? { apiKey: settings.apiKey } : {}) }),
    [settings.baseUrl, settings.apiKey]
  );

  const [form, setForm]           = useState<FormState>(INITIAL);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<ExecutionAttestation | null>(null);
  const [error, setError]         = useState<string | null>(null);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const attestation = await client.execute({
        policy_id:      form.policy_id.trim(),
        policy_version: form.policy_version.trim(),
        decision_type:  form.decision_type.trim(),
        signals_hash:   form.signals_hash.trim(),
      });
      setResult(attestation);
      setLastAttestation(JSON.stringify(attestation, null, 2));
    } catch (err) {
      const msg =
        err instanceof PramanaApiError
          ? `HTTP ${err.status}: ${err.message}`
          : err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    form.policy_id.trim() &&
    form.policy_version.trim() &&
    form.decision_type.trim() &&
    form.signals_hash.trim() &&
    !loading;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Form column */}
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Execute Decision</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            POST /execute — runs the deterministic governance runtime
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <Field
            label="Policy ID"
            placeholder="access-control"
            value={form.policy_id}
            onChange={set("policy_id")}
            hint="The governance policy identifier"
          />
          <Field
            label="Policy Version"
            placeholder="v1"
            value={form.policy_version}
            onChange={set("policy_version")}
            hint='Version directory name, e.g. "v1" or "v2"'
          />
          <Field
            label="Decision Type"
            placeholder="approve"
            value={form.decision_type}
            onChange={set("decision_type")}
            hint='The governance action to execute, e.g. "approve" or "deny"'
          />
          <Field
            label="Signals Hash"
            placeholder="SHA-256 hex of the input signals payload"
            value={form.signals_hash}
            onChange={set("signals_hash")}
            hint="SHA-256 hex digest of the canonicalized signals JSON"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner size="sm" />}
            {loading ? "Executing…" : "Execute Decision"}
          </button>
        </form>
      </div>

      {/* Response column */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Response</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            ExecutionAttestation — signed execution result
          </p>
        </div>

        {!result && !error && !loading && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-600">
            Response will appear here
          </div>
        )}

        {loading && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="md" />
              <p className="text-sm text-slate-500">Executing decision…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-red-500">Error</p>
            <p className="font-mono text-sm text-red-300 break-all">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            {/* Decision badge */}
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Decision</span>
              <span className={`rounded-full border px-3 py-0.5 text-sm font-semibold ${
                result.result.decision === "approve"
                  ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-300"
                  : result.result.decision === "deny"
                  ? "border-red-700/50 bg-red-900/30 text-red-300"
                  : "border-slate-700 bg-slate-800 text-slate-300"
              }`}>
                {result.result.decision}
              </span>
              <span className="ml-auto font-mono text-xs text-slate-500">
                {result.result.execution_id.slice(0, 8)}…
              </span>
            </div>

            <JsonViewer value={result} />

            <p className="text-right text-xs text-slate-600">
              Saved to clipboard — use the Verify page to validate this attestation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
