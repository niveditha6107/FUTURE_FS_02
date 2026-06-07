import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Crown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DEMO_EMAIL, DEMO_PASSWORD, isAuthed, login } from "@/lib/leads-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — LeadMaster CRM" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isAuthed()) navigate({ to: "/" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome back, Niveditha");
      navigate({ to: "/" });
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,oklch(0.6_0.22_270/0.25),transparent_55%),radial-gradient(circle_at_85%_85%,oklch(0.6_0.24_300/0.22),transparent_55%)]" />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="hidden flex-col justify-between rounded-2xl bg-gradient-to-br from-primary via-accent-2 to-primary p-10 text-white shadow-2xl lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">LeadMaster</p>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">CRM Suite</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Master every lead. Close more deals.</h2>
            <p className="mt-4 text-sm opacity-90">
              The mini CRM built for agencies, freelancers, and startups — track leads, follow-ups, and conversions in one place.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Unified lead pipeline", "Smart follow-up reminders", "Source & conversion analytics", "Company-level insights"].map((f) => (
                <li key={f} className="flex items-center gap-2 opacity-90">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/85" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs opacity-70">Developed by Niveditha Arige · Future Interns — Full Stack Web Development</p>
        </div>

        <Card className="p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-2 text-white">
              <Crown className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold">LeadMaster CRM</p>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sign in to your workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">Use the demo credentials below to explore the CRM.</p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent-2 text-primary-foreground shadow-md hover:opacity-90">
              Sign in
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs">
            <p className="font-semibold text-foreground">Demo credentials</p>
            <p className="mt-1 text-muted-foreground">Email: <span className="font-mono">{DEMO_EMAIL}</span></p>
            <p className="text-muted-foreground">Password: <span className="font-mono">{DEMO_PASSWORD}</span></p>
          </div>
        </Card>
      </div>
    </div>
  );
}
