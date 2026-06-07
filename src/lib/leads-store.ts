export type LeadStatus = "New" | "Contacted" | "Converted";
export type LeadSource = "Website" | "LinkedIn" | "Instagram" | "Referral" | "Other";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  followUpDate: string; // ISO date (YYYY-MM-DD)
  notes: string;
  createdAt: string; // ISO datetime
}

const KEY = "leadmaster.leads.v2";
const AUTH_KEY = "leadmaster.auth.v1";
const THEME_KEY = "leadmaster.theme.v1";

export const DEMO_EMAIL = "admin@leadmaster.com";
export const DEMO_PASSWORD = "admin123";

export const PROFILE = {
  name: "Niveditha Arige",
  role: "Full Stack Web Development Intern",
  email: DEMO_EMAIL,
  organization: "LeadMaster CRM",
};

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

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

const SAMPLE: Omit<Lead, "id">[] = [
  { name: "Ananya Reddy", email: "ananya.reddy@brightlabs.io", phone: "+91 90123 45678", company: "BrightLabs Analytics", source: "Website", status: "New", followUpDate: addDays(2), notes: "Filled the demo form — wants pricing for a 20-person data team.", createdAt: daysAgo(1) },
  { name: "Rohan Kapadia", email: "rohan@finquill.co", phone: "+91 98456 11098", company: "FinQuill", source: "LinkedIn", status: "Contacted", followUpDate: addDays(3), notes: "Replied to outbound message; books discovery for Thursday 4 PM.", createdAt: daysAgo(4) },
  { name: "Sara Thomas", email: "sara.t@craftmade.studio", phone: "+91 99987 22341", company: "Craftmade Studio", source: "Instagram", status: "New", followUpDate: addDays(1), notes: "DM enquiry about social-media + landing-page bundle.", createdAt: daysAgo(0) },
  { name: "Manav Bhatia", email: "manav@northpeakventures.com", phone: "+91 91100 55421", company: "Northpeak Ventures", source: "Referral", status: "Converted", followUpDate: addDays(21), notes: "Closed annual retainer ₹4.8L. Onboarding in progress.", createdAt: daysAgo(11) },
  { name: "Tara Banerjee", email: "tara@lumendesign.in", phone: "+91 88321 44009", company: "Lumen Design Co.", source: "Website", status: "Contacted", followUpDate: addDays(5), notes: "Proposal v2 sent; awaiting sign-off from founder.", createdAt: daysAgo(6) },
  { name: "Yuvraj Malhotra", email: "yuvraj@quantumforge.dev", phone: "+91 90876 33210", company: "QuantumForge", source: "LinkedIn", status: "New", followUpDate: addDays(4), notes: "CTO downloaded whitepaper; interested in API integration.", createdAt: daysAgo(2) },
  { name: "Isha Pillai", email: "isha.pillai@verdantfoods.com", phone: "+91 93456 78812", company: "Verdant Foods", source: "Referral", status: "Converted", followUpDate: addDays(30), notes: "Signed up via partner referral. Quarterly renewal locked.", createdAt: daysAgo(15) },
  { name: "Aditya Saxena", email: "aditya@pixeltrail.agency", phone: "+91 97000 12233", company: "PixelTrail Agency", source: "Website", status: "Contacted", followUpDate: addDays(7), notes: "Wants white-label option for client projects.", createdAt: daysAgo(5) },
  { name: "Neha Choudhary", email: "neha@cobalt-hr.com", phone: "+91 99220 87651", company: "Cobalt HR", source: "Instagram", status: "New", followUpDate: addDays(6), notes: "Reels lead — asked for case studies in HR-tech vertical.", createdAt: daysAgo(1) },
  { name: "Kabir Anand", email: "kabir@orbitlogistics.io", phone: "+91 96543 22019", company: "Orbit Logistics", source: "Other", status: "Converted", followUpDate: addDays(45), notes: "Closed via Twitter conversation. Loves the analytics module.", createdAt: daysAgo(20) },
  { name: "Pooja Deshmukh", email: "pooja@sunmarktextiles.com", phone: "+91 90011 22334", company: "Sunmark Textiles", source: "Website", status: "New", followUpDate: addDays(8), notes: "Family-run business exploring digital transformation.", createdAt: daysAgo(0) },
  { name: "Rehan Qureshi", email: "rehan@nimbusedu.org", phone: "+91 95678 11223", company: "Nimbus EdTech", source: "LinkedIn", status: "Contacted", followUpDate: addDays(2), notes: "Needs SSO and multi-tenant support before purchase.", createdAt: daysAgo(8) },
];

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
