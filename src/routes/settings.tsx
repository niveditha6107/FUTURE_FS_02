import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Moon, Sun, Briefcase, User, Building2 } from "lucide-react";
import { AppShell } from "@/components/leadflow/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROFILE, getTheme, setTheme } from "@/lib/leads-store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — LeadMaster CRM" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => setThemeState(getTheme()), []);

  const choose = (t: "light" | "dark") => {
    setTheme(t);
    setThemeState(t);
  };

  const initials = PROFILE.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your profile and workspace preferences.</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="relative h-28 bg-gradient-to-r from-primary via-accent-2 to-primary">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        </div>
        <div className="-mt-12 px-6 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-accent-2 text-2xl font-bold text-white shadow-lg">
                {initials}
              </div>
              <div className="pb-2">
                <h3 className="text-xl font-bold text-foreground">{PROFILE.name}</h3>
                <p className="text-sm text-muted-foreground">{PROFILE.role}</p>
              </div>
            </div>
            <span className="rounded-full bg-gradient-to-r from-primary to-accent-2 px-3 py-1 text-xs font-semibold text-white">
              Active
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field icon={User} label="Full Name" value={PROFILE.name} />
            <Field icon={Briefcase} label="Role" value={PROFILE.role} />
            <Field icon={Mail} label="Email" value={PROFILE.email} />
            <Field icon={Building2} label="Workspace" value={PROFILE.organization} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground">Appearance</h3>
        <p className="mt-1 text-sm text-muted-foreground">Choose how LeadMaster looks to you.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {([
            { id: "light", label: "Light", icon: Sun },
            { id: "dark", label: "Dark", icon: Moon },
          ] as const).map((o) => {
            const active = theme === o.id;
            const Icon = o.icon;
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-transparent bg-gradient-to-r from-primary/10 to-accent-2/10 ring-2 ring-primary"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? "bg-gradient-to-br from-primary to-accent-2 text-white" : "bg-muted text-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{o.label} mode</p>
                  <p className="text-xs text-muted-foreground">{o.id === "light" ? "Bright, clean canvas" : "Easy on the eyes"}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground">About LeadMaster CRM</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A mini CRM built for small businesses, freelancers, and agencies to capture, track, and convert client leads.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Developed by <span className="bg-gradient-to-r from-primary to-accent-2 bg-clip-text font-semibold text-transparent">Niveditha Arige</span> · Future Interns — Full Stack Web Development
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => window.location.assign("/")}>Back to Dashboard</Button>
        </div>
      </Card>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
