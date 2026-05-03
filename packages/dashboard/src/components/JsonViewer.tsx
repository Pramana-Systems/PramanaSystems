import { useMemo } from "react";

function highlight(json: string): string {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-amber-300";               // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match)
          ? "text-sky-300"    // key
          : "text-emerald-300"; // string value
      } else if (/true|false/.test(match)) {
        cls = "text-violet-300"; // boolean
      } else if (match === "null") {
        cls = "text-slate-400";  // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

interface JsonViewerProps {
  value: unknown;
  maxHeight?: string;
}

export function JsonViewer({ value, maxHeight = "32rem" }: JsonViewerProps) {
  const html = useMemo(() => {
    try {
      return highlight(JSON.stringify(value, null, 2));
    } catch {
      return `<span class="text-red-400">Invalid JSON</span>`;
    }
  }, [value]);

  return (
    <div
      className="relative rounded-lg border border-slate-700 bg-slate-950 overflow-auto"
      style={{ maxHeight }}
    >
      <pre
        className="p-4 text-sm font-mono text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
