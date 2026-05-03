interface CheckBadgeProps {
  label: string;
  passed: boolean;
}

export function CheckBadge({ label, passed }: CheckBadgeProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
        passed
          ? "border-emerald-700/50 bg-emerald-900/20"
          : "border-red-700/50 bg-red-900/20"
      }`}
    >
      {passed ? (
        <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="h-5 w-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={`text-sm font-medium ${passed ? "text-emerald-300" : "text-red-300"}`}>
        {label}
      </span>
    </div>
  );
}
