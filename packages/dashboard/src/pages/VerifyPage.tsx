import { useState, useMemo, FormEvent } from "react";
import { PramanaClient, PramanaApiError } from "@pramanasystems/sdk-client";
import type { VerificationResult } from "@pramanasystems/sdk-client";
import { useApp } from "../lib/ctx.ts";
import { CheckBadge } from "../components/CheckBadge.tsx";
import { JsonViewer } from "../components/JsonViewer.tsx";
import { Spinner } from "../components/Spinner.tsx";

const CHECK_LABELS: Record<string, string> = {
  signature_verified: "Cryptographic signature verified",
  runtime_verified:   "Runtime hash and version match",
  schema_compatible:  "Schema version compatible",
};

export function VerifyPage() {
  const { settings, lastAttestation } = useApp();
  const client = useMemo(
    () => new PramanaClient({ baseUrl: settings.baseUrl, ...(settings.apiKey ? { apiKey: settings.apiKey } : {}) }),
    [settings.baseUrl, settings.apiKey]
  );

  const [raw, setRaw]           = useState("");
  const [parseErr, setParseErr] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<VerificationResult | null>(null);
  const [error, setError]       = useState<string | null>(null);

  function loadLast() {
    setRaw(lastAttestation);
    setParseErr(null);
  }

  function validate(text: string) {
    setRaw(text);
    setParseErr(null);
    if (!text.trim()) return;
    try { JSON.parse(text); }
    catch { setParseErr("Invalid JSON — check the pasted content"); }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (loading || parseErr) return;
    let body: unknown;
    try { body = JSON.parse(raw); }
    catch { setParseErr("Invalid JSON"); return; }

    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await client.verify(body as any);
      setResult(res);
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

  const canSubmit = raw.trim() && !parseErr && !loading;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Input column */}
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Verify Attestation</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            POST /verify — independent cryptographic verification
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              ExecutionAttestation JSON
            </label>
            {lastAttestation && (
              <button
                type="button"
                onClick={loadLast}
                className="text-xs text-blue-400 transition hover:text-blue-300"
              >
                ← Use last execution
              </button>
            )}
          </div>

          <textarea
            rows={14}
            value={raw}
            onChange={e => validate(e.target.value)}
            placeholder={'{\n  "result": { ... },\n  "signature": "base64=="\n}'}
            spellCheck={false}
            className={`w-full resize-none rounded-lg border bg-slate-950 px-3 py-2.5 font-mono text-sm text-slate-200 placeholder-slate-700 transition focus:outline-none focus:ring-1 ${
              parseErr
                ? "border-red-700 focus:border-red-600 focus:ring-red-600"
                : "border-slate-700 focus:border-blue-600 focus:ring-blue-600"
            }`}
          />

          {parseErr && (
            <p className="flex items-center gap-1.5 text-xs text-red-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {parseErr}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner size="sm" />}
            {loading ? "Verifying…" : "Verify Attestation"}
          </button>
        </form>
      </div>

      {/* Result column */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Verification Result</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Per-check breakdown of the cryptographic verification
          </p>
        </div>

        {!result && !error && !loading && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-600">
            Result will appear here
          </div>
        )}

        {loading && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="md" />
              <p className="text-sm text-slate-500">Verifying attestation…</p>
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
          <div className="space-y-4">
            {/* Overall verdict */}
            <div className={`flex items-center gap-4 rounded-xl border p-5 ${
              result.valid
                ? "border-emerald-700/50 bg-emerald-900/20"
                : "border-red-700/50 bg-red-900/20"
            }`}>
              {result.valid ? (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-emerald-700/50 bg-emerald-900/40">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-red-700/50 bg-red-900/40">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <div>
                <p className={`text-xl font-bold ${result.valid ? "text-emerald-400" : "text-red-400"}`}>
                  {result.valid ? "VALID" : "INVALID"}
                </p>
                <p className="text-sm text-slate-500">
                  {result.valid
                    ? "All verification checks passed"
                    : "One or more verification checks failed"}
                </p>
              </div>
            </div>

            {/* Per-check rows */}
            <div className="space-y-2">
              {(Object.entries(result.checks) as [string, boolean][]).map(([k, v]) => (
                <CheckBadge key={k} label={CHECK_LABELS[k] ?? k.replace(/_/g, " ")} passed={v} />
              ))}
            </div>

            {/* Raw response */}
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-400">
                  <svg className="h-3.5 w-3.5 transition group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Raw response
                </div>
              </summary>
              <div className="mt-2">
                <JsonViewer value={result} maxHeight="16rem" />
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
