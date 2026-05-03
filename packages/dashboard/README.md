# @pramanasystems/dashboard

A React + Vite single-page application for interacting with the PramanaSystems governance runtime over HTTP. Provides a dark-themed governance dashboard for executing decisions, verifying attestations, and monitoring server health.

---

## What it does

The dashboard connects to a running `@pramanasystems/server` instance and provides four views:

- **Health** — Live server status with 10-second auto-polling
- **Execute** — Submit governance decisions and inspect the full signed `ExecutionAttestation`
- **Verify** — Paste or pipe an attestation JSON and see per-check verification results
- **Runtime** — Runtime manifest and capabilities endpoints (coming soon — 501 stubs)

All API calls go through `@pramanasystems/sdk-client`. The base URL and optional API key are stored in `localStorage` and configurable at runtime via the settings panel.

---

## Running in development

Start the PramanaSystems server first:

```bash
npx @pramanasystems/server
# or with auth:
PRAMANA_API_KEY=your-key npx @pramanasystems/server
```

Then start the dashboard from the workspace root:

```bash
npm run dashboard
```

This runs `vite` in the `packages/dashboard` workspace and serves the app at `http://localhost:5173`.

To run the dev server directly from the package directory:

```bash
npm run dev --workspace=packages/dashboard
```

---

## Building for production

```bash
npm run build --workspace=packages/dashboard
```

Output is written to `packages/dashboard/dist/`. Serve with any static file host:

```bash
npm run preview --workspace=packages/dashboard
# or:
npx serve packages/dashboard/dist
```

The built app is a fully static bundle — no server-side rendering. Deploy it anywhere that can serve static files; it connects to the API server at the configured base URL.

---

## Configuration

All configuration is persisted in `localStorage` under the keys `pramana:baseUrl` and `pramana:apiKey`. No page reload is required after changing settings.

### Base URL

Default: `http://localhost:3000`

Set via the **Settings panel** (gear icon, top right). Change this to point at any running `@pramanasystems/server` instance — local, staging, or production.

### API Key

If `PRAMANA_API_KEY` is set on the server, every request must include it as a Bearer token. Enter the key in the Settings panel. If no key is configured, the dashboard runs in **Dev Mode** (shown in the auth badge in the top-right of the nav bar).

When a key is present the badge shows **Authenticated**. When absent it shows **Dev Mode**.

---

## Views

### Health

- Calls `GET /health` every 10 seconds automatically.
- Shows server status, version string, and last-checked timestamp.
- A pulsing green dot indicates the server is reachable; a red error card shows the failure message when the server is unreachable.
- Manual **Refresh** button for on-demand checks.

### Execute

Submits `POST /execute` with the following fields:

| Field | Description |
|---|---|
| `policy_id` | ID of the governance policy to evaluate |
| `policy_version` | Version string (e.g. `v1`) |
| `decision_type` | Expected decision outcome (e.g. `approve`, `deny`) |
| `signals_hash` | SHA-256 hex hash of the canonical signals payload |

The full `ExecutionAttestation` response is shown in a syntax-highlighted JSON viewer. The `decision` field is highlighted with a colour-coded badge (emerald for approve, red for deny, slate for other). The raw attestation is automatically saved to the session — the Verify page can load it with the **Use last execution** button.

### Verify

- Accepts an `ExecutionAttestation` JSON in the textarea.
- Invalid JSON shows a red border as you type.
- The **Use last execution** button loads the attestation from the last Execute call.
- Calls `POST /verify` and shows three individual check results:

| Check | Meaning |
|---|---|
| `signature_verified` | Ed25519 signature over the canonical `ExecutionResult` is valid |
| `runtime_verified` | `runtime_hash` and `runtime_version` match the trusted manifest |
| `schema_compatible` | `schema_version` is in the runtime's supported list |

Each check shows a green checkmark or red X with a labelled badge. The overall result is shown as a large **VALID** or **INVALID** banner.

### Runtime

Placeholder view for the `GET /runtime/manifest` and `GET /runtime/capabilities` endpoints (currently 501 on the server). Shows amber "Coming soon" badges and the expected endpoint paths. The static capability list (`replay-protection`, `attestation-signing`, `bundle-verification`, `schema-validation`) is displayed for reference.

---

## Screenshots

> Screenshots are in `docs/images/`. This section will be populated once the server is running and screenshots are captured.

| View | File |
|---|---|
| Health | `docs/images/dashboard-health.png` |
| Execute | `docs/images/dashboard-execute.png` |
| Verify — valid | `docs/images/dashboard-verify-valid.png` |
| Verify — invalid | `docs/images/dashboard-verify-invalid.png` |
| Runtime | `docs/images/dashboard-runtime.png` |

---

## Package notes

- `private: true` — not published to npm.
- Depends on `@pramanasystems/sdk-client` via npm workspace link.
- Tailwind CSS v3 with PostCSS — no UI component library.
- TypeScript strict mode, `moduleResolution: Bundler`, `noEmit: true` (Vite handles emit).
