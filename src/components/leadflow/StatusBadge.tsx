import type { LeadStatus } from "@/lib/leads-store";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    New: "bg-info/15 text-info border-info/30",
    Contacted: "bg-warning/15 text-warning-foreground border-warning/40 dark:text-warning",
    Converted: "bg-success/15 text-success border-success/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
