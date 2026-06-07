import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { AppShell } from "@/components/leadflow/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/leadflow/StatusBadge";
import { LeadFormDialog } from "@/components/leadflow/LeadFormDialog";
import { useLeads } from "@/lib/leads-context";
import type { Lead, LeadSource, LeadStatus } from "@/lib/leads-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads — LeadMaster CRM" }] }),
  component: LeadsPage,
});

const STATUSES: ("All" | LeadStatus)[] = ["All", "New", "Contacted", "Converted"];
const SOURCES: ("All" | LeadSource)[] = ["All", "Website", "LinkedIn", "Instagram", "Referral", "Other"];

function LeadsPage() {
  return (
    <AppShell>
      <LeadsInner />
    </AppShell>
  );
}

function LeadsInner() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | LeadStatus>("All");
  const [source, setSource] = useState<"All" | LeadSource>("All");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (status !== "All" && l.status !== status) return false;
      if (source !== "All" && l.source !== source) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        if (
          !l.name.toLowerCase().includes(s) &&
          !l.email.toLowerCase().includes(s) &&
          !(l.company || "").toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [leads, q, status, source]);

  const openAdd = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (l: Lead) => { setEditing(l); setDialogOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">All Leads</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} of {leads.length} leads shown</p>
        </div>
        <Button onClick={openAdd} className="bg-gradient-to-r from-primary to-accent-2 text-primary-foreground shadow-sm hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" /> Add Lead
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, email or company..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All Statuses" : s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={source} onValueChange={(v) => setSource(v as typeof source)}>
            <SelectTrigger className="md:w-40"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>{SOURCES.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All Sources" : s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Lead</th>
                <th className="px-4 py-3 text-left font-medium">Company</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Source</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Follow-up</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No leads match your filters.</td></tr>
              )}
              {filtered.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-2 text-xs font-semibold text-white">
                        {l.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{l.name}</p>
                        {l.notes && <p className="line-clamp-1 max-w-xs text-xs text-muted-foreground">{l.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{l.company || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                        <Mail className="h-3 w-3" />{l.email}
                      </a>
                      {l.phone && (
                        <a href={`tel:${l.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                          <Phone className="h-3 w-3" />{l.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{l.source}</span></td>
                  <td className="px-4 py-3">
                    <Select value={l.status} onValueChange={(v) => { updateLead(l.id, { status: v as LeadStatus }); toast.success(`Status: ${v}`); }}>
                      <SelectTrigger className="h-8 w-32 border-0 bg-transparent p-0 shadow-none hover:bg-muted/50 focus:ring-0">
                        <StatusBadge status={l.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(l.followUpDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(l)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDel(l)} aria-label="Delete" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <LeadFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={(data) => {
          if (editing) updateLead(editing.id, data);
          else addLead(data);
        }}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold">{confirmDel?.name}</span> from your CRM. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmDel) {
                  deleteLead(confirmDel.id);
                  toast.success("Lead deleted");
                }
                setConfirmDel(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
