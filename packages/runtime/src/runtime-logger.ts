export interface RuntimeLogEvent {
  trace_id: string;

  endpoint: string;

  method: string;

  status: number;

  duration_ms: number;

  timestamp: string;
}

export function
logRuntimeEvent(
  event: RuntimeLogEvent
): void {
  console.log(
    JSON.stringify(
      event,
      null,
      2
    )
  );
}