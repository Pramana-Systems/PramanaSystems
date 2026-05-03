import type {
  HealthResponse,
  ExecuteRequest,
  ExecutionAttestation,
  VerificationResult,
} from "./types.js";

/** Construction options for {@link PramanaClient}. */
export interface PramanaClientOptions {
  /** Base URL of the PramanaSystems server, e.g. `"http://localhost:3000"`. Trailing slashes are stripped. */
  baseUrl: string;
  /** Bearer token for API authentication — required when the server has `PRAMANA_API_KEY` set. */
  apiKey?: string;
}

/**
 * Thrown by {@link PramanaClient} whenever the server returns a non-2xx HTTP status.
 * The `status` property holds the HTTP status code; `message` contains the
 * server's `error` field (or `statusText` as a fallback).
 */
export class PramanaApiError extends Error {
  /** HTTP status code returned by the server. */
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "PramanaApiError";
    this.status = status;
  }
}

/**
 * Type-safe HTTP client for the PramanaSystems governance REST API.
 *
 * All request and response types are derived directly from the generated
 * `openapi.d.ts` spec, so they stay in sync with the server automatically.
 *
 * @example
 * ```ts
 * const client = new PramanaClient({ baseUrl: "http://localhost:3000", apiKey: "secret" });
 *
 * const attestation = await client.execute({
 *   policy_id: "access-control",
 *   policy_version: "v1",
 *   decision_type: "approve",
 *   signals_hash: "abc123...",
 * });
 *
 * const result = await client.verify(attestation);
 * console.log(result.valid); // true
 * ```
 */
export class PramanaClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  /** @param options - Client configuration including the server URL and optional API key. */
  constructor(options: PramanaClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(options.apiKey
        ? { Authorization: `Bearer ${options.apiKey}` }
        : {}),
    };
  }

  private async request<TRes>(
    path: string,
    init?: RequestInit
  ): Promise<TRes> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        ...this.defaultHeaders,
        ...(init?.headers ?? {}),
      },
    });

    const body: unknown = await res.json();

    if (!res.ok) {
      const message =
        body !== null &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as { error: unknown }).error === "string"
          ? (body as { error: string }).error
          : res.statusText;
      throw new PramanaApiError(res.status, message);
    }

    return body as TRes;
  }

  /** GET /health — returns runtime status and version. */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  /**
   * POST /execute — runs the deterministic governance runtime and returns
   * a signed ExecutionAttestation. The returned value can be passed
   * directly to verify().
   */
  async execute(request: ExecuteRequest): Promise<ExecutionAttestation> {
    return this.request<ExecutionAttestation>("/execute", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * POST /verify — independently verifies an ExecutionAttestation.
   * Pass the object returned by execute() straight into this method.
   */
  async verify(attestation: ExecutionAttestation): Promise<VerificationResult> {
    return this.request<VerificationResult>("/verify", {
      method: "POST",
      body: JSON.stringify(attestation),
    });
  }
}
