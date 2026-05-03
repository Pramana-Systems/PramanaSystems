import { useApp } from "../lib/ctx.ts";
import { useHealth } from "../hooks/useHealth.ts";
import { PramanaClient } from "@pramanasystems/sdk-client";
import { useMemo } from "react";
import { Spinner } from "../components/Spinner.tsx";

export function HealthPage() {
  const { settings } = useApp();
  const client = useMemo(
    () => new PramanaClient({ baseUrl: settings.baseUrl, ...(settings.apiKey ? { apiKey: settings.apiKey } : {}) }),
    [settings.baseUrl, settings.apiKey]
  );
  const { status, refresh } = useHealth(client, 10_000);

  const isLoading = status.phase === "idle" || status.phase === "loading";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Server Health</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Live status — auto-refreshes every 10 seconds
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-100 disabled:opacity-50"
        >
          <svg className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 py-16">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-slate-500">Connecting to {settings.baseUrl}…</p>
          </div>
        </div>
      )}

      {status.phase === "ok" && (
        <div className="space-y-4">
          {/* Status card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-700/50 bg-emerald-900/30">
                <span className="absolute h-3 w-3 rounded-full bg-emerald-400">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                </span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Status</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {status.data.status.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Version</p>
              <p className="mt-1 font-mono text-lg font-semibold text-slate-100">{status.data.version}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Server Time</p>
              <p className="mt-1 font-mono text-sm text-slate-100 break-all">{status.data.timestamp}</p>
            </div>
          </div>

          <p className="text-right text-xs text-slate-600">
            Last checked: {status.lastChecked.toLocaleTimeString()}
          </p>
        </div>
      )}

      {status.phase === "error" && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-red-700/50 bg-red-900/40">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-red-300">Server Unreachable</p>
              <p className="mt-1 break-all font-mono text-sm text-red-400/80">{status.message}</p>
              <p className="mt-2 text-xs text-slate-500">
                Last attempted: {status.lastChecked.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
