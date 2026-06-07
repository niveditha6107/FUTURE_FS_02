import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserPlus, MessageCircle, CheckCircle2, TrendingUp, CalendarClock, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/leadflow/AppShell";
import { Card } from "@/components/ui/card";
import { useLeads } from "@/lib/leads-context";
import { StatusBadge } from "@/components/leadflow/StatusBadge";
import { PROFILE } from "@/lib/leads-store";
import { useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — LeadMaster CRM" }] }),
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
    { label: "Total Leads", value: stats.total, icon: Users, tone: "from-primary to-accent-2" },
    { label: "New Leads", value: stats.fresh, icon: UserPlus, tone: "from-info to-primary" },
    { label: "Contacted", value: stats.contacted, icon: MessageCircle, tone: "from-warning to-accent-2" },
    { label: "Converted", value: stats.converted, icon: CheckCircle2, tone: "from-success to-info" },
  ];

  const firstName = PROFILE.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-accent-2 to-primary p-6 text-white shadow-lg shadow-primary/25">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3" /> LeadMaster CRM
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Welcome back, {firstName} 👋</h2>
            <p className="mt-1 text-sm text-white/85">Here's what's moving in your pipeline today.</p>
          </div>
          <Link to="/leads" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/90">
            Manage leads <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.tone}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{c.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.tone} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" />
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
              <p className="mt-2 bg-gradient-to-r from-primary to-accent-2 bg-clip-text text-4xl font-bold text-transparent">{stats.rate}%</p>
              <p className="mt-1 text-xs text-muted-foreground">{stats.converted} of {stats.total} leads converted</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-2 text-white">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-2 transition-all" style={{ width: `${stats.rate}%` }} />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Upcoming Follow-ups</h3>
            </div>
            <Link to="/followups" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No upcoming follow-ups scheduled.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{l.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{l.company || l.email} · {l.source}</p>
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
