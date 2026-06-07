import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/leadflow/AppShell";
import { Card } from "@/components/ui/card";
import { useLeads } from "@/lib/leads-context";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LeadSource, LeadStatus } from "@/lib/leads-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — LeadMaster CRM" }] }),
  component: AnalyticsPage,
});

const SOURCES: LeadSource[] = ["Website", "LinkedIn", "Instagram", "Referral", "Other"];
const STATUSES: LeadStatus[] = ["New", "Contacted", "Converted"];
// Blue → purple gradient palette
const COLORS = [
  "oklch(0.62 0.18 255)", // blue
  "oklch(0.58 0.22 280)", // indigo
  "oklch(0.55 0.24 300)", // violet
  "oklch(0.6 0.22 325)",  // pink-purple
  "oklch(0.7 0.14 220)",  // sky
];

function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsInner />
    </AppShell>
  );
}

function AnalyticsInner() {
  const { leads } = useLeads();

  const sourceData = useMemo(
    () => SOURCES.map((s) => ({ name: s, value: leads.filter((l) => l.source === s).length })),
    [leads],
  );
  const statusData = useMemo(
    () => STATUSES.map((s) => ({ name: s, value: leads.filter((l) => l.status === s).length })),
    [leads],
  );

  // Leads created by day (last 14 days)
  const trend = useMemo(() => {
    const days: { day: string; count: number; key: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count: 0,
      });
    }
    leads.forEach((l) => {
      const k = (l.createdAt || "").slice(0, 10);
      const slot = days.find((d) => d.key === k);
      if (slot) slot.count += 1;
    });
    return days;
  }, [leads]);

  const converted = leads.filter((l) => l.status === "Converted").length;
  const rate = leads.length ? Math.round((converted / leads.length) * 100) : 0;
  const topCompanies = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => {
      const c = (l.company || "Unknown").trim() || "Unknown";
      map.set(c, (map.get(c) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [leads]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground">Pipeline insights powered by your live lead data.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent-2" />
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Leads</p>
          <p className="mt-2 text-3xl font-bold">{leads.length}</p>
        </Card>
        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success to-info" />
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Converted</p>
          <p className="mt-2 text-3xl font-bold text-success">{converted}</p>
        </Card>
        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-info to-accent-2" />
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Conversion Rate</p>
          <p className="mt-2 bg-gradient-to-r from-primary to-accent-2 bg-clip-text text-3xl font-bold text-transparent">{rate}%</p>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">New Leads — Last 14 Days</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.6 0.22 285)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.6 0.22 285)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="count" stroke="oklch(0.55 0.24 290)" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Leads by Source</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            {sourceData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Leads by Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.18 255)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.24 295)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#barGrad)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Top Companies</h3>
        {topCompanies.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No company data yet.</p>
        ) : (
          <ul className="space-y-3">
            {topCompanies.map(([name, count], i) => {
              const max = topCompanies[0][1];
              const pct = Math.round((count / max) * 100);
              return (
                <li key={name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{i + 1}. {name}</span>
                    <span className="text-xs text-muted-foreground">{count} lead{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-2" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
