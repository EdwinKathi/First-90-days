"use client";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "housing", icon: "🏠", label: "Housing & Utilities", color: "#E86C47" },
  { id: "health", icon: "🩺", label: "Healthcare", color: "#4A9B8E" },
  { id: "food", icon: "🛒", label: "Groceries & Food", color: "#D4A843" },
  { id: "transit", icon: "🚌", label: "Getting Around", color: "#5B7EC2" },
  { id: "finance", icon: "💳", label: "Banking & Taxes", color: "#8B6BAE" },
  { id: "social", icon: "👋", label: "Community & Social", color: "#C75B7A" },
  { id: "legal", icon: "📋", label: "Legal & Documents", color: "#6B8E5A" },
  { id: "work", icon: "💼", label: "Career & Work", color: "#C28B4A" },
];

type Task = { id: string; title: string; done: boolean; priority: string; tip: string; day: number };
type TaskMap = Record<string, Task[]>;
type Profile = { name: string; from: string; to: string; age: string; background: string; priorities: string[]; moveDate?: string };

const SAMPLE_TASKS: TaskMap = {
  housing: [
    { id: "h1", title: "Set up electricity (PSEG Long Island)", done: false, priority: "urgent", tip: "Call 1-800-490-0025 or visit psegliny.com. Have your lease ready.", day: 1 },
    { id: "h2", title: "Set up internet service", done: false, priority: "high", tip: "Optimum is the main provider on Long Island. Schedule install ASAP — wait times can be 1-2 weeks.", day: 2 },
    { id: "h3", title: "Get renter's insurance", done: false, priority: "high", tip: "Lemonade app takes 5 minutes. ~$10/month for basic coverage.", day: 7 },
    { id: "h4", title: "Forward mail (USPS)", done: false, priority: "medium", tip: "usps.com/move — $1.10 fee. Takes 7-10 business days to start.", day: 3 },
    { id: "h5", title: "Update address on driver's license", done: false, priority: "medium", tip: "NY DMV allows online address change at dmv.ny.gov", day: 14 },
  ],
  health: [
    { id: "he1", title: "Find a primary care doctor", done: false, priority: "high", tip: "Stony Brook Medicine and Northwell Health have large networks on Long Island.", day: 14 },
    { id: "he2", title: "Transfer prescriptions to local pharmacy", done: false, priority: "urgent", tip: "CVS and Walgreens can do pharmacy-to-pharmacy transfers same day.", day: 3 },
    { id: "he3", title: "Find nearest urgent care", done: false, priority: "medium", tip: "CityMD has locations across Long Island with walk-in availability.", day: 7 },
    { id: "he4", title: "Locate nearest hospital / ER", done: false, priority: "low", tip: "Stony Brook University Hospital is the Level 1 trauma center for Suffolk County.", day: 7 },
  ],
  food: [
    { id: "f1", title: "Find Indian grocery store", done: false, priority: "high", tip: "Patel Brothers in Hicksville (~30 min) is the go-to. India Bazaar in Islandia is closer.", day: 3 },
    { id: "f2", title: "Explore local supermarkets", done: false, priority: "medium", tip: "Stop & Shop and King Kullen are everywhere. Lidl for budget. Trader Joe's in Commack.", day: 5 },
    { id: "f3", title: "Find good takeout spots", done: false, priority: "low", tip: "Check Google Maps reviews. Long Island has surprisingly great pizza and diners.", day: 7 },
    { id: "f4", title: "Stock your kitchen essentials", done: false, priority: "high", tip: "Target or Walmart for basics. HomeGoods for cheap kitchen gear.", day: 2 },
  ],
  transit: [
    { id: "t1", title: "Get LIRR schedule & fare info", done: false, priority: "high", tip: "Ronkonkoma station → Penn Station is ~1hr 20min. Use TrainTime app. Peak fare ~$20.25 one way.", day: 1 },
    { id: "t2", title: "Get an OMNY card or set up tap-to-pay", done: false, priority: "medium", tip: "Apple Pay / Google Pay works on LIRR and MTA. OMNY card available at stations.", day: 5 },
    { id: "t3", title: "Understand parking rules", done: false, priority: "medium", tip: "Ronkonkoma LIRR station has free parking in outer lots. Closer lots need permits.", day: 7 },
    { id: "t4", title: "Find local gas stations", done: false, priority: "low", tip: "GasBuddy app shows cheapest gas. Costco gas in Holbrook if you have membership.", day: 5 },
  ],
  finance: [
    { id: "fi1", title: "Open local bank account or update address", done: false, priority: "high", tip: "Chase and TD Bank are everywhere on Long Island. Many offer $300 bonus for new checking.", day: 7 },
    { id: "fi2", title: "Understand NY state taxes", done: false, priority: "medium", tip: "NY has state + city tax (city only if you live/work in NYC). Suffolk County has no city income tax.", day: 30 },
    { id: "fi3", title: "Update address on all financial accounts", done: false, priority: "high", tip: "Credit cards, investment accounts, insurance — update all to avoid missed mail.", day: 14 },
    { id: "fi4", title: "Register car / update insurance", done: false, priority: "urgent", tip: "NY requires state-specific insurance. You have 30 days to register after establishing residency.", day: 14 },
  ],
  social: [
    { id: "s1", title: "Find South Asian community groups", done: false, priority: "medium", tip: "India Association of Long Island (IALI) hosts cultural events. Check Facebook for 'Desis of Long Island'.", day: 14 },
    { id: "s2", title: "Find local temple / place of worship", done: false, priority: "medium", tip: "Hindu Temple Society of North America in Flushing. BAPS in Melville.", day: 7 },
    { id: "s3", title: "Join local meetup groups", done: false, priority: "low", tip: "Meetup.com — search for tech meetups, hiking groups, or hobby groups on Long Island.", day: 30 },
    { id: "s4", title: "Explore the neighborhood", done: false, priority: "low", tip: "Walk around Lake Ronkonkoma. Check out MacArthur Airport area shops. Islip town events.", day: 7 },
  ],
  legal: [
    { id: "l1", title: "Update voter registration", done: false, priority: "low", tip: "NY voter registration at voterlookup.elections.ny.gov. Can register online with NY license.", day: 30 },
    { id: "l2", title: "Gather important documents in one place", done: false, priority: "high", tip: "Passport, visa docs, SSN card, lease, insurance cards — keep digital + physical copies.", day: 3 },
    { id: "l3", title: "Know your local emergency numbers", done: false, priority: "medium", tip: "911 for emergencies. Suffolk County Police non-emergency: 631-852-COPS.", day: 1 },
  ],
  work: [
    { id: "w1", title: "Update LinkedIn location", done: false, priority: "high", tip: "Signal to recruiters you're in the NYC/Long Island metro. Big talent market.", day: 1 },
    { id: "w2", title: "Research local co-working spaces", done: false, priority: "low", tip: "LaunchPad Long Island in various locations. Some libraries have free work spaces.", day: 14 },
    { id: "w3", title: "Set up home office", done: false, priority: "medium", tip: "Good chair + desk from Facebook Marketplace. Ensure reliable internet for video calls.", day: 7 },
  ],
};

const PRIORITIES: Record<string, { label: string; color: string; weight: number }> = {
  urgent: { label: "Urgent", color: "#DC3545", weight: 0 },
  high: { label: "High", color: "#E8883A", weight: 1 },
  medium: { label: "Medium", color: "#D4A843", weight: 2 },
  low: { label: "Low", color: "#7B9E6B", weight: 3 },
};

let _id = 100;
const uid = () => `t${++_id}`;

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<"landing" | "onboarding" | "dashboard">("landing");
  const [profile, setProfile] = useState<Profile>({ name: "", from: "", to: "", age: "", background: "", priorities: [] });
  const [tasks, setTasks] = useState<TaskMap>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [moveDate, setMoveDate] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [filter, setFilter] = useState("all");
  const [addingTask, setAddingTask] = useState(false);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const p = load<Profile | null>("f90-profile", null);
    if (p) {
      setProfile(p);
      setMoveDate(p.moveDate || "");
      setTasks(load<TaskMap>("f90-tasks", {}));
      setScreen("dashboard");
    }
    setReady(true);
  }, []);

  const initTasks = () => {
    const t: TaskMap = {};
    Object.entries(SAMPLE_TASKS).forEach(([cat, items]) => {
      t[cat] = items.map(i => ({ ...i, id: uid() }));
    });
    setTasks(t);
    save("f90-tasks", t);
  };

  const toggleTask = (catId: string, taskId: string) => {
    const next = { ...tasks };
    const arr = [...(next[catId] || [])];
    const idx = arr.findIndex(t => t.id === taskId);
    if (idx === -1) return;
    const wasDone = arr[idx].done;
    arr[idx] = { ...arr[idx], done: !wasDone };
    next[catId] = arr;
    setTasks(next);
    save("f90-tasks", next);
    if (!wasDone) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1500); }
  };

  const addTaskItem = (catId: string) => {
    if (!newTask.trim()) return;
    const next = { ...tasks };
    next[catId] = [...(next[catId] || []), { id: uid(), title: newTask.trim(), done: false, priority: "medium", tip: "", day: 0 }];
    setTasks(next);
    save("f90-tasks", next);
    setNewTask("");
    setAddingTask(false);
  };

  const deleteTask = (catId: string, taskId: string) => {
    const next = { ...tasks };
    next[catId] = (next[catId] || []).filter(t => t.id !== taskId);
    setTasks(next);
    save("f90-tasks", next);
  };

  const resetApp = () => {
    localStorage.removeItem("f90-profile");
    localStorage.removeItem("f90-tasks");
    setScreen("landing");
    setProfile({ name: "", from: "", to: "", age: "", background: "", priorities: [] });
    setTasks({});
    setStep(0);
    setActiveCategory(null);
  };

  const totalTasks = Object.values(tasks).flat().length;
  const doneTasks = Object.values(tasks).flat().filter(t => t.done).length;
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const daysSinceMove = moveDate ? Math.max(0, Math.floor((Date.now() - new Date(moveDate).getTime()) / 86400000)) : null;
  const daysLeft = daysSinceMove !== null ? Math.max(0, 90 - daysSinceMove) : null;

  if (!ready) return null;

  // ───── LANDING ─────
  if (screen === "landing") return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6"
      style={{ background: "linear-gradient(160deg, #1A1512 0%, #2A2118 40%, #1E2A25 100%)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(232,184,74,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(74,155,142,0.06) 0%, transparent 60%)" }} />
      <div className="relative z-10 text-center max-w-[520px]" style={{ animation: "fadeUp 0.8s ease" }}>
        <div className="text-7xl mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: "#E8B84A", textShadow: "0 0 40px rgba(232,184,74,0.3)" }}>90</div>
        <h1 className="text-4xl mb-3" style={{ fontFamily: "'DM Serif Display', serif", color: "#F5EDE0", fontWeight: 400, letterSpacing: -0.5 }}>First 90 Days</h1>
        <p className="text-base mb-8 mx-auto max-w-[400px]" style={{ color: "rgba(245,237,224,0.65)", lineHeight: 1.6 }}>
          Your personal playbook for starting over in a new place.
        </p>
        <div className="flex gap-2.5 justify-center flex-wrap mb-9">
          {["Personalized checklist", "Local recommendations", "Community tips"].map((f, i) => (
            <span key={i} className="px-4 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(232,184,74,0.1)", border: "1px solid rgba(232,184,74,0.2)", color: "#E8B84A" }}>{f}</span>
          ))}
        </div>
        <button onClick={() => setScreen("onboarding")}
          className="px-9 py-3.5 rounded-xl text-base font-bold cursor-pointer transition-transform hover:-translate-y-0.5"
          style={{ background: "#E8B84A", color: "#1A1512", border: "none" }}>
          Get Started →
        </button>
        <p className="mt-4 text-xs" style={{ color: "rgba(245,237,224,0.35)" }}>Free. No account needed. Your data stays on your device.</p>
      </div>
    </div>
  );

  // ───── ONBOARDING ─────
  if (screen === "onboarding") {
    const steps = [
      { q: "What's your name?", field: "name", placeholder: "e.g. Edwin", type: "text" },
      { q: "Where are you moving from?", field: "from", placeholder: "e.g. Frisco, TX", type: "text" },
      { q: "Where are you moving to?", field: "to", placeholder: "e.g. Ronkonkoma, NY", type: "text" },
      { q: "When did you move (or plan to)?", field: "moveDate", placeholder: "", type: "date" },
      { q: "What describes you best?", field: "background", type: "select", options: ["Immigrant / visa holder", "Job changer", "College grad", "Military family", "Starting fresh", "Other"] },
      { q: "What matters most right now?", field: "priorities", type: "multi", options: CATEGORIES.map(c => ({ id: c.id, label: c.icon + " " + c.label })) },
    ];
    const cur = steps[step];
    const canNext = step === 5 ? profile.priorities.length > 0 : step === 4 ? !!profile.background : step === 3 ? !!moveDate : !!profile[cur.field as keyof Profile];

    const goNext = () => {
      if (step < steps.length - 1) { setStep(step + 1); return; }
      const finalProfile = { ...profile, moveDate };
      setProfile(finalProfile);
      save("f90-profile", finalProfile);
      initTasks();
      setScreen("dashboard");
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: "linear-gradient(160deg, #1A1512, #2A2118)" }}>
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full transition-colors"
            style={{ background: i <= step ? "#E8B84A" : "rgba(255,255,255,0.2)" }} />)}
        </div>
        <div className="rounded-2xl p-10 w-full max-w-[480px]"
          style={{ background: "rgba(245,237,224,0.04)", border: "1px solid rgba(245,237,224,0.08)", animation: "fadeUp 0.5s ease" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#E8B84A" }}>Step {step + 1} of {steps.length}</p>
          <h2 className="text-2xl mb-6" style={{ fontFamily: "'DM Serif Display', serif", color: "#F5EDE0", fontWeight: 400 }}>{cur.q}</h2>

          {cur.type === "text" && (
            <input className="w-full px-4 py-3.5 rounded-xl text-base"
              style={{ background: "rgba(245,237,224,0.06)", border: "1px solid rgba(245,237,224,0.12)", color: "#F5EDE0" }}
              placeholder={cur.placeholder} value={profile[cur.field as keyof Profile] as string || ""}
              onChange={e => setProfile({ ...profile, [cur.field]: e.target.value })}
              onKeyDown={e => e.key === "Enter" && canNext && goNext()} autoFocus />
          )}
          {cur.type === "date" && (
            <input type="date" className="w-full px-4 py-3.5 rounded-xl text-base"
              style={{ background: "rgba(245,237,224,0.06)", border: "1px solid rgba(245,237,224,0.12)", color: "#F5EDE0" }}
              value={moveDate} onChange={e => setMoveDate(e.target.value)} autoFocus />
          )}
          {cur.type === "select" && (
            <div className="flex flex-wrap gap-2.5">
              {(cur.options as string[]).map(o => (
                <button key={o} className="px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-colors"
                  style={{ background: profile.background === o ? "rgba(232,184,74,0.2)" : "rgba(245,237,224,0.06)",
                    border: `1px solid ${profile.background === o ? "#E8B84A" : "rgba(245,237,224,0.12)"}`,
                    color: profile.background === o ? "#E8B84A" : "#F5EDE0" }}
                  onClick={() => setProfile({ ...profile, background: o })}>{o}</button>
              ))}
            </div>
          )}
          {cur.type === "multi" && (
            <div className="flex flex-wrap gap-2.5">
              {(cur.options as { id: string; label: string }[]).map(o => {
                const sel = profile.priorities.includes(o.id);
                return <button key={o.id} className="px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-colors"
                  style={{ background: sel ? "rgba(232,184,74,0.2)" : "rgba(245,237,224,0.06)",
                    border: `1px solid ${sel ? "#E8B84A" : "rgba(245,237,224,0.12)"}`,
                    color: sel ? "#E8B84A" : "#F5EDE0" }}
                  onClick={() => setProfile({ ...profile, priorities: sel ? profile.priorities.filter(p => p !== o.id) : [...profile.priorities, o.id] })}>{o.label}</button>;
              })}
            </div>
          )}

          <div className="flex gap-3 mt-7">
            {step > 0 && <button className="px-5 py-3.5 rounded-xl text-sm cursor-pointer"
              style={{ background: "transparent", border: "1px solid rgba(245,237,224,0.15)", color: "#F5EDE0" }}
              onClick={() => setStep(step - 1)}>← Back</button>}
            <button className="flex-1 px-9 py-3.5 rounded-xl text-base font-bold cursor-pointer transition-opacity"
              style={{ background: "#E8B84A", color: "#1A1512", border: "none", opacity: canNext ? 1 : 0.4, pointerEvents: canNext ? "auto" : "none" }}
              onClick={goNext}>
              {step === steps.length - 1 ? "Build My Playbook ✨" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───── DASHBOARD ─────
  const catTasks = activeCategory ? (tasks[activeCategory] || []) : [];
  const filteredTasks = catTasks
    .filter(t => filter === "all" ? true : filter === "done" ? t.done : !t.done)
    .sort((a, b) => (PRIORITIES[a.priority]?.weight || 2) - (PRIORITIES[b.priority]?.weight || 2));
  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen relative" style={{ background: "#F8F5F0" }}>
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="absolute w-2 h-2 rounded-sm"
              style={{ left: `${8 + Math.random() * 84}%`, top: -10,
                background: ["#E8B84A", "#E86C47", "#4A9B8E", "#5B7EC2", "#C75B7A"][i % 5],
                animation: `confettiFall 1.5s ease forwards`, animationDelay: `${Math.random() * 0.5}s` }} />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5" style={{ background: "#1E1A15", color: "#F5EDE0" }}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
            style={{ fontFamily: "'DM Serif Display', serif", color: "#E8B84A", background: "rgba(232,184,74,0.12)" }}>90</div>
          <div>
            <h1 className="text-xl" style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
              {profile.name ? `${profile.name}'s Playbook` : "My Playbook"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(245,237,224,0.5)" }}>
              {profile.to || "New City"} {daysLeft !== null ? `· Day ${daysSinceMove} of 90 · ${daysLeft} days left` : ""}
            </p>
          </div>
        </div>
        <button onClick={resetApp} title="Start over"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg cursor-pointer"
          style={{ background: "rgba(245,237,224,0.08)", border: "1px solid rgba(245,237,224,0.12)", color: "#F5EDE0" }}>↻</button>
      </header>

      {/* Progress */}
      <div className="px-6 py-5">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E8E2D8" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #E8B84A, #E8883A)" }} />
        </div>
        <div className="flex items-center gap-2.5 mt-2">
          <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: "#1E1A15" }}>{progress}%</span>
          <span className="text-sm" style={{ color: "#8B8478" }}>{doneTasks} of {totalTasks} tasks done</span>
        </div>
      </div>

      {/* Content */}
      {!activeCategory ? (
        <div className="grid gap-3 px-6 pb-10" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", animation: "fadeUp 0.5s ease" }}>
          {CATEGORIES.map(cat => {
            const ct = tasks[cat.id] || [];
            const done = ct.filter(t => t.done).length;
            const total = ct.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <button key={cat.id} className="bg-white rounded-2xl p-4 text-left cursor-pointer transition-all hover:shadow-md flex flex-col gap-2.5"
                style={{ border: "1px solid #E8E2D8" }}
                onClick={() => { setActiveCategory(cat.id); setFilter("all"); setExpandedTask(null); }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: cat.color + "22", color: cat.color }}>{cat.icon}</div>
                <div className="text-sm font-semibold" style={{ color: "#1E1A15" }}>{cat.label}</div>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#E8E2D8" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#8B8478" }}>{done}/{total}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-6 pb-10" style={{ animation: "fadeUp 0.4s ease" }}>
          <button className="text-sm font-medium cursor-pointer py-2 bg-transparent border-none"
            style={{ color: "#8B8478" }}
            onClick={() => { setActiveCategory(null); setExpandedTask(null); setAddingTask(false); }}>← All Categories</button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{activeCat?.icon}</span>
            <h2 className="text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color: "#1E1A15", fontWeight: 400 }}>{activeCat?.label}</h2>
          </div>

          <div className="flex gap-2 mb-4">
            {(["all", "pending", "done"] as const).map(f => (
              <button key={f} className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                style={{ border: "1px solid #E8E2D8",
                  background: filter === f ? (activeCat?.color || "#E8B84A") : "#fff",
                  color: filter === f ? "#fff" : "#1E1A15" }}
                onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "pending" ? "To Do" : "Done"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filteredTasks.map(t => (
              <div key={t.id} className="bg-white rounded-xl px-4 py-3.5 transition-all"
                style={{ border: "1px solid #E8E2D8", borderLeft: `3px solid ${PRIORITIES[t.priority]?.color || "#999"}` }}>
                <div className="flex items-center gap-3">
                  <button className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                    style={{ border: `2px solid ${t.done ? activeCat?.color : "#C8C2B8"}`, background: t.done ? activeCat?.color : "transparent" }}
                    onClick={() => toggleTask(activeCategory, t.id)}>
                    {t.done && <span className="text-white text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)}>
                    <span className="text-sm font-medium transition-all"
                      style={{ color: "#1E1A15", textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.5 : 1 }}>{t.title}</span>
                    {t.day > 0 && <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ background: "#F0EBE3", color: "#8B8478" }}>Day {t.day}</span>}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md font-semibold whitespace-nowrap"
                    style={{ background: PRIORITIES[t.priority]?.color + "22", color: PRIORITIES[t.priority]?.color }}>{PRIORITIES[t.priority]?.label}</span>
                  <button className="bg-transparent border-none text-lg cursor-pointer px-1 leading-none"
                    style={{ color: "#C8C2B8" }} onClick={() => deleteTask(activeCategory, t.id)}>×</button>
                </div>
                {expandedTask === t.id && t.tip && (
                  <div className="flex gap-2 mt-2.5 p-2.5 rounded-lg"
                    style={{ background: "#FEFBF3", border: "1px solid #F0E8D4", animation: "fadeUp 0.3s ease" }}>
                    <span className="text-sm flex-shrink-0 mt-0.5">💡</span>
                    <span className="text-sm leading-relaxed" style={{ color: "#6B6358" }}>{t.tip}</span>
                  </div>
                )}
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <p className="text-center text-sm py-8" style={{ color: "#8B8478" }}>
                {filter === "done" ? "Nothing completed yet — you got this!" : filter === "pending" ? "All done here! 🎉" : "No tasks in this category."}
              </p>
            )}
          </div>

          {addingTask ? (
            <div className="flex gap-2 mt-3 items-center">
              <input className="flex-1 px-3.5 py-2.5 rounded-lg text-sm"
                style={{ border: "1px solid #E8E2D8" }}
                placeholder="Add a task..." value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTaskItem(activeCategory)}
                autoFocus />
              <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer border-none"
                style={{ background: activeCat?.color }}
                onClick={() => addTaskItem(activeCategory)}>Add</button>
              <button className="px-3.5 py-2.5 rounded-lg text-sm cursor-pointer bg-white"
                style={{ border: "1px solid #E8E2D8" }}
                onClick={() => { setAddingTask(false); setNewTask(""); }}>Cancel</button>
            </div>
          ) : (
            <button className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer mt-3 bg-transparent transition-colors"
              style={{ border: `2px dashed ${activeCat?.color}`, color: activeCat?.color }}
              onClick={() => setAddingTask(true)}>+ Add Task</button>
          )}
        </div>
      )}
    </div>
  );
}
