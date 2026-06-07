import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, LeadSource, LeadStatus } from "@/lib/leads-store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Lead | null;
  onSubmit: (data: Omit<Lead, "id" | "createdAt">) => void;
}

const SOURCES: LeadSource[] = ["Website", "LinkedIn", "Instagram", "Referral", "Other"];
const STATUSES: LeadStatus[] = ["New", "Contacted", "Converted"];

const empty = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website" as LeadSource,
  status: "New" as LeadStatus,
  followUpDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

export function LeadFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (open) {
      if (initial) {
        const { id: _id, createdAt: _c, ...rest } = initial;
        setForm({ ...empty, ...rest });
      } else {
        setForm(empty);
      }
    }
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    onSubmit(form);
    onOpenChange(false);
    toast.success(initial ? "Lead updated" : "Lead added");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Lead" : "Add New Lead"}</DialogTitle>
          <DialogDescription>
            {initial ? "Update lead details and follow-up info." : "Capture a new client lead from any source."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Cooper" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 90000 00000" />
          </div>
          <div className="space-y-1.5">
            <Label>Lead Source</Label>
            <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v as LeadSource })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="followup">Follow-up Date</Label>
            <Input id="followup" type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add context, requirements, or next steps..." />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent-2 text-primary-foreground hover:opacity-90">
              {initial ? "Save changes" : "Add Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
