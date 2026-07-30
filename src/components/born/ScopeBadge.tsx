import type { DataConfidence, DataScope } from "@/lib/born/types";

const SCOPE_LABEL: Record<DataScope, string> = {
  local: "Your city",
  regional: "Your region",
  national: "Your country",
  global: "The world",
};

export function ScopeBadge({
  scope,
  confidence,
}: {
  scope: DataScope;
  confidence?: DataConfidence;
}) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
      <span className="rounded-sm border border-border/70 px-2 py-0.5 text-brass">
        {SCOPE_LABEL[scope]}
      </span>
      {confidence && confidence !== "exact" && (
        <span className="opacity-70">{confidence}</span>
      )}
    </span>
  );
}
