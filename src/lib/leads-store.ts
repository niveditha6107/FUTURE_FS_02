export type LeadStatus = "New" | "Contacted" | "Converted";
export type LeadSource = "Website" | "LinkedIn" | "Instagram" | "Referral" | "Other";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  followUpDate: string; // ISO date (YYYY-MM-DD)
  notes: string;
  createdAt: string; // ISO datetime
}

const KEY = "leadflow.leads.v1";
const AUTH_KEY = "leadflow.auth.v1";
const THEME_KEY = "leadflow.theme.v1";

export const DEMO_EMAIL = "admin@leadflow.com";
export const DEMO_PASSWORD = "admin123";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const SAMPLE: Omit<Lead, "id">[] = [
  { name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "+91 98201 11221", source: "Website", status: "New", followUpDate: addDays(2), notes: "Asked about pricing for the starter plan.", createdAt: daysAgo(1) },
  { name: "Priya Verma", email: "priya.verma@outlook.com", phone: "+91 99887 32145", source: "LinkedIn", status: "Contacted", followUpDate: addDays(4), notes: "Scheduled a discovery call next Tuesday.", createdAt: daysAgo(3) },
  { name: "Rahul Mehta", email: "rahul.mehta@zoho.com", phone: "+91 90876 55421", source: "Referral", status: "Converted", followUpDate: addDays(14), notes: "Signed up for the Pro plan. Onboarding complete.", createdAt: daysAgo(8) },
  { name: "Sneha Iyer", email: "sneha.iyer@yahoo.com", phone: "+91 88990 12345", source: "Instagram", status: "New", followUpDate: addDays(1), notes: "Interested in social-media management add-on.", createdAt: daysAgo(0) },
  { name: "Karan Patel", email: "karan.patel@gmail.com", phone: "+91 91234 56789", source: "Website", status: "Contacted", followUpDate: addDays(5), notes: "Sent proposal; awaiting feedback from CTO.", createdAt: daysAgo(5) },
  { name: "Meera Joshi", email: "meera.joshi@hotmail.com", phone: "+91 93456 22110", source: "LinkedIn", status: "Converted", followUpDate: addDays(30), notes: "Annual contract closed. Renewal Q3.", createdAt: daysAgo(12) },
  { name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 99001 22334", source: "Referral", status: "New", followUpDate: addDays(3), notes: "Referred by Rahul Mehta.", createdAt: daysAgo(2) },
  { name: "Anjali Rao", email: "anjali.rao@protonmail.com", phone: "+91 98345 67890", source: "Website", status: "Contacted", followUpDate: addDays(6), notes: "Requested a custom demo for her team of 12.", createdAt: daysAgo(4) },
  { name: "Devansh Kapoor", email: "devansh.k@gmail.com", phone: "+91 97654 32109", source: "Instagram", status: "New", followUpDate: addDays(7), notes: "DM enquiry about freelancer plan.", createdAt: daysAgo(1) },
  { name: "Riya Nair", email: "riya.nair@outlook.com", phone: "+91 96123 45678", source: "Other", status: "Converted", followUpDate: addDays(20), notes: "Came through a Twitter thread. Closed quickly.", createdAt: daysAgo(10) },
];

function addDays(d: number) {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
}
function daysAgo(d: number) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

export function loadLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded: Lead[] = SAMPLE.map((s) => ({ ...s, id: uid() }));
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

export function saveLeads(leads: Lead[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(leads));
}

export function createLead(input: Omit<Lead, "id" | "createdAt">): Lead {
  return { ...input, id: uid(), createdAt: new Date().toISOString() };
}

// Auth
export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}
export function login(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// Theme
export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
}
export function setTheme(t: "light" | "dark") {
  localStorage.setItem(THEME_KEY, t);
  document.documentElement.classList.toggle("dark", t === "dark");
}
