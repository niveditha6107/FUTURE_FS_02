import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserPlus, MessageCircle, CheckCircle2, TrendingUp, CalendarClock, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/leadflow/AppShell";
import { Card } from "@/components/ui/card";
import { useLeads } from "@/lib/leads-context";
import { StatusBadge } from "@/components/leadflow/StatusBadge";
import { useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — LeadFlow CRM" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <DashboardInner />
    </AppShell>
  );
}

function DashboardInner() {
  const { leads } = useLeads();

  const stats = useMemo(() => {
    const total = leads.length;
    const fresh = leads.filter((l) => l.status === "New").length;
    const contacted = leads.filter((l) => l.status === "Contacted").length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    const rate = total ? Math.round((converted / total) * 100) : 0;
    return { total, fresh, contacted, converted, rate };
  }, [leads]);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...leads]
      .filter((l) => l.status !== "Converted" && l.followUpDate >= today)
      .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
      .slice(0, 5);
  }, [leads]);

  const cards = [
    { label: "Total Leads", value: stats.total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "New Leads", value: stats.fresh, icon: UserPlus, color: "text-info", bg: "bg-info/10" },
    { label: "Contacted", value: stats.contacted, icon: MessageCircle, color: "text-warning", bg: "bg-warning/15" },
    { label: "Converted", value: stats.converted, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Admin 👋</h2>
          <p className="text-sm text-muted-foreground">Here's what's happening with your leads today.</p>
        </div>
        <Link to="/leads" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Manage leads <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{c.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg}`}>
                  <Icon className={`h-5 w-5 ${c.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Conversion Rate</p>
              <p className="mt-2 text-4xl font-bold text-foreground">{stats.rate}%</p>
              <p className="mt-1 text-xs text-muted-foreground">{stats.converted} of {stats.total} leads converted</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all" style={{ width: `${stats.rate}%` }} />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Upcoming Follow-ups</h3>
            </div>
            <Link to="/leads" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No upcoming follow-ups scheduled.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{l.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{l.email} · {l.source}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={l.status} />
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {new Date(l.followUpDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
