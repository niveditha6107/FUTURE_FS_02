import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createLead, loadLeads, saveLeads, type Lead } from "./leads-store";

interface Ctx {
  leads: Lead[];
  addLead: (l: Omit<Lead, "id" | "createdAt">) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
}

const LeadsCtx = createContext<Ctx | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      leads,
      addLead: (l) => {
        const next = [createLead(l), ...leads];
        setLeads(next);
        saveLeads(next);
      },
      updateLead: (id, patch) => {
        const next = leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
        setLeads(next);
        saveLeads(next);
      },
      deleteLead: (id) => {
        const next = leads.filter((l) => l.id !== id);
        setLeads(next);
        saveLeads(next);
      },
    }),
    [leads],
  );

  return <LeadsCtx.Provider value={value}>{children}</LeadsCtx.Provider>;
}

export function useLeads() {
  const c = useContext(LeadsCtx);
  if (!c) throw new Error("useLeads must be used inside LeadsProvider");
  return c;
}
