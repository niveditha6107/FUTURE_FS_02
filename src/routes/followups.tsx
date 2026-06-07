import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CalendarClock, AlertTriangle, CalendarCheck, CalendarDays, Building2, Mail, Phone } from "lucide-react";
import { AppShell } from "@/components/leadflow/AppShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/leadflow/StatusBadge";
import { useLeads } from "@/lib/leads-context";
import type { Lead } from "@/lib/leads-store";

export const Route = createFileRoute("/followups")({
  head: () => ({ meta: [{ title: "Follow-ups — LeadMaster CRM" }] }),
  component: FollowUpsPage,
});

function FollowUpsPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { leads } = useLeads();

  const today = new Date().toISOString().slice(0, 10);
  const in7 = new Date(); in7.setDate(in7.getDate() + 7);
  const weekEnd = in7.toISOString().slice(0, 10);

  const buckets = useMemo(() => {
    const pending = leads.filter((l) => l.status !== "Converted");
    const overdue = pending.filter((l) => l.followUpDate < today).sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
    const todayList = pending.filter((l) => l.followUpDate === today);
    const week = pending.filter((l) => l.followUpDate > today && l.followUpDate <= weekEnd).sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
    const later = pending.filter((l) => l.followUpDate > weekEnd).sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
    return { overdue, todayList, week, later };
  }, [leads, today, weekEnd]);

  const sections: { title: string; data: Lead[]; icon: typeof CalendarClock; accent: string }[] = [
    { title: "Overdue", data: buckets.overdue, icon: AlertTriangle, accent: "from-destructive to-warning" },
    { title: "Due Today", data: buckets.todayList, icon: CalendarCheck, accent: "from-primary to-accent-2" },
    { title: "This Week", data: buckets.week, icon: CalendarClock, accent: "from-info to-primary" },
    { title: "Later", data: buckets.later, icon: CalendarDays, accent: "from-success to-info" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Follow-ups</h2>
        <p className="text-sm text-muted-foreground">Stay on top of every commitment — grouped by urgency.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="relative overflow-hidden p-5">
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.accent}`} />
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.title}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{s.data.length}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.title} className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${s.accent} text-white`}>
                <s.icon className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <span className="ml-auto text-xs text-muted-foreground">{s.data.length} leads</span>
            </div>
            {s.data.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Nothing here. You're all caught up.</p>
            ) : (
              <ul className="divide-y divide-border">
                {s.data.map((l) => (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{l.name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {l.company && <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{l.company}</span>}
                        <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" />{l.email}</a>
                        {l.phone && <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" />{l.phone}</a>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={l.status} />
                      <span className="text-xs font-medium text-foreground">
                        {new Date(l.followUpDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
