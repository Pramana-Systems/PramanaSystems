import { useState, useEffect, useCallback, useRef } from "react";
import { PramanaClient, PramanaApiError } from "@pramanasystems/sdk-client";
import type { HealthResponse } from "@pramanasystems/sdk-client";

export type HealthState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ok";    data: HealthResponse; lastChecked: Date }
  | { phase: "error"; message: string;      lastChecked: Date };

export function useHealth(client: PramanaClient, pollMs = 10_000): {
  status: HealthState;
  refresh: () => void;
} {
  const [status, setStatus] = useState<HealthState>({ phase: "idle" });
  const mountedRef = useRef(true);

  const check = useCallback(async () => {
    setStatus(prev =>
      prev.phase === "idle" || prev.phase === "loading"
        ? { phase: "loading" }
        : prev             // keep existing data visible during re-poll
    );
    try {
      const data = await client.health();
      if (mountedRef.current)
        setStatus({ phase: "ok", data, lastChecked: new Date() });
    } catch (err) {
      if (!mountedRef.current) return;
      const message =
        err instanceof PramanaApiError
          ? `${err.status}: ${err.message}`
          : err instanceof Error ? err.message : String(err);
      setStatus({ phase: "error", message, lastChecked: new Date() });
    }
  }, [client]);

  useEffect(() => {
    mountedRef.current = true;
    check();
    const timer = setInterval(check, pollMs);
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [check, pollMs]);

  return { status, refresh: check };
}
