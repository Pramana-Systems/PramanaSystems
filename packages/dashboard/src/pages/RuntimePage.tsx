export function RuntimePage() {
  const cards = [
    {
      method: "GET",
      route: "/runtime/manifest",
      title: "Runtime Bundle Manifest",
      description:
        "Returns the signed bundle manifest for the active governance runtime. " +
        "Includes all artifact hashes, runtime requirements, and the deterministic bundle hash " +
        "that binds every execution result to a specific runtime build.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      method: "GET",
      route: "/runtime/capabilities",
      title: "Runtime Capabilities",
      description:
        "Lists the capability strings advertised by this runtime instance " +
        "(e.g. replay-protection, attestation-signing, bundle-verification, deterministic-evaluation). " +
        "Used by verification tooling to confirm the runtime satisfies policy requirements.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Runtime Introspection</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Governance runtime manifest and capability inspection
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map(card => (
          <div
            key={card.route}
            className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            {/* Coming soon ribbon */}
            <div className="absolute right-4 top-4">
              <span className="rounded-full border border-amber-700/50 bg-amber-900/30 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                Coming soon
              </span>
            </div>

            {/* Icon */}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400">
              {card.icon}
            </div>

            {/* Route label */}
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs font-semibold text-blue-400">
                {card.method}
              </span>
              <span className="font-mono text-sm text-slate-300">{card.route}</span>
            </div>

            <h3 className="mb-2 text-base font-semibold text-slate-100">{card.title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{card.description}</p>

            {/* 501 placeholder */}
            <div className="mt-5 rounded-lg border border-slate-700/50 bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">501</span>
                <span className="text-xs text-slate-600">Not Implemented</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-300">Current Runtime Capabilities</h3>
        <p className="mb-4 text-sm text-slate-500">
          The governance runtime currently exposes the following capabilities (from the static
          manifest definition in <code className="text-slate-400">@pramanasystems/execution</code>):
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "deterministic-evaluation",
            "attestation-signing",
            "replay-protection",
            "bundle-verification",
          ].map(cap => (
            <span
              key={cap}
              className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
