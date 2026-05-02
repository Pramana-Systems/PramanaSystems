import type {
  HealthResponse,
  ExecuteRequest,
  ExecutionAttestation,
  VerificationResult,
} from "./types.js";

export interface PramanaClientOptions {
  /** Base URL of the PramanaSystems server, e.g. "http://localhost:3000" */
  baseUrl: string;
  /** Bearer token — required when the server has PRAMANA_API_KEY set */
  apiKey?: string;
}

/** Thrown whenever the server returns a non-2xx status. */
export class PramanaApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "PramanaApiError";
    this.status = status;
  }
}

export class PramanaClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

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
