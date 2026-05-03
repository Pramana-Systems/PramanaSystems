import { useState, useEffect } from "react";
import { useApp } from "../lib/ctx.ts";
import { setBaseUrl, setApiKey } from "../lib/storage.ts";

export function SettingsPanel() {
  const { settings, setSettings, settingsOpen, setSettingsOpen } = useApp();
  const [url, setUrl]       = useState(settings.baseUrl);
  const [key, setKey]       = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => { setUrl(settings.baseUrl); }, [settings.baseUrl]);
  useEffect(() => { setKey(settings.apiKey);  }, [settings.apiKey]);

  function save() {
    const trimmedUrl = url.trim().replace(/\/$/, "") || "http://localhost:3000";
    const trimmedKey = key.trim();
    setBaseUrl(trimmedUrl);
    setApiKey(trimmedKey);
    setSettings({ baseUrl: trimmedUrl, apiKey: trimmedKey });
    setSettingsOpen(false);
  }

  if (!settingsOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={() => setSettingsOpen(false)}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Connection Settings
          </h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
              Base URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="http://localhost:3000"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 transition focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <p className="mt-1.5 text-xs text-slate-600">
              The PramanaSystems server URL. No trailing slash.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Leave empty for dev mode"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-100 placeholder-slate-600 transition focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showKey ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-600">
              Matches <code className="text-slate-400">PRAMANA_API_KEY</code> on the server.
              Clear to operate in unauthenticated dev mode.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 px-6 py-4">
          <button
            onClick={save}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:bg-blue-700"
          >
            Save &amp; Connect
          </button>
        </div>
      </div>
    </>
  );
}
