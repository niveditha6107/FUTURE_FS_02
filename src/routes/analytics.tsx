import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/leadflow/AppShell";
import { Card } from "@/components/ui/card";
import { useLeads } from "@/lib/leads-context";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LeadSource, LeadStatus } from "@/lib/leads-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — LeadFlow CRM" }] }),
  component: AnalyticsPage,
});

const SOURCES: LeadSource[] = ["Website", "LinkedIn", "Instagram", "Referral", "Other"];
const STATUSES: LeadStatus[] = ["New", "Contacted", "Converted"];
const COLORS = ["oklch(0.55 0.2 265)", "oklch(0.65 0.17 155)", "oklch(0.7 0.17 50)", "oklch(0.6 0.2 320)", "oklch(0.65 0.15 200)"];

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

  const converted = leads.filter((l) => l.status === "Converted").length;
  const rate = leads.length ? Math.round((converted / leads.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground">Lead-source breakdown and conversion overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Leads</p>
          <p className="mt-2 text-3xl font-bold">{leads.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Converted</p>
          <p className="mt-2 text-3xl font-bold text-success">{converted}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Conversion Rate</p>
          <p className="mt-2 text-3xl font-bold text-primary">{rate}%</p>
        </Card>
      </div>

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
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
