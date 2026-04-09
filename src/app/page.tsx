"use client";
import { useState, useEffect, useRef } from "react";

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const CATEGORIES = [
  { id: "housing", icon: "🏠", label: "Housing & Utilities", color: "#E06B4B", bg: "#FEF2EE" },
  { id: "health", icon: "🩺", label: "Healthcare", color: "#2D9B8A", bg: "#EEF8F6" },
  { id: "food", icon: "🛒", label: "Groceries & Food", color: "#C49A2A", bg: "#FBF6EA" },
  { id: "transit", icon: "🚌", label: "Getting Around", color: "#4A72B8", bg: "#EEF2FA" },
  { id: "finance", icon: "💳", label: "Banking & Taxes", color: "#7C5EAA", bg: "#F4F0FA" },
  { id: "social", icon: "👋", label: "Community & Social", color: "#C4527A", bg: "#FAEEF3" },
  { id: "legal", icon: "📋", label: "Legal & Documents", color: "#5C8A4E", bg: "#EFF5ED" },
  { id: "work", icon: "💼", label: "Career & Work", color: "#B8863A", bg: "#FAF4EA" },
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

const PRIORITIES: Record<string, { label: string; color: string; bg: string; weight: number }> = {
  urgent: { label: "Urgent", color: "#D93025", bg: "#FDECEA", weight: 0 },
  high: { label: "High", color: "#E07830", bg: "#FEF3EA", weight: 1 },
  medium: { label: "Medium", color: "#B8942A", bg: "#FBF6EA", weight: 2 },
  low: { label: "Low", color: "#5A8A4E", bg: "#EFF5ED", weight: 3 },
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
      style={{ background: "linear-gradient(165deg, #0F0F0E 0%, #1A1916 35%, #151D1A 65%, #111110 100%)" }}>
      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 600px 400px at 30% 20%, rgba(212,162,57,0.07) 0%, transparent 70%), radial-gradient(ellipse 500px 350px at 75% 75%, rgba(45,155,138,0.05) 0%, transparent 70%)"
      }} />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 text-center max-w-[560px]" style={{ animation: "fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }}>
        {/* Logo mark */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{
          background: "linear-gradient(135deg, rgba(212,162,57,0.15), rgba(212,162,57,0.05))",
          border: "1px solid rgba(212,162,57,0.2)",
          animation: "float 4s ease-in-out infinite"
        }}>
          <span className="text-4xl font-bold" style={{ fontFamily: SERIF, color: "#D4A239", letterSpacing: "-0.02em" }}>90</span>
        </div>

        <h1 className="text-5xl mb-4 tracking-tight" style={{ fontFamily: SERIF, color: "#F5F3EE", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          First 90 Days
        </h1>
        <p className="text-lg mb-10 mx-auto max-w-[420px] leading-relaxed" style={{ color: "rgba(245,243,238,0.55)", fontFamily: SANS }}>
          Your personal playbook for settling into a new place — organized, actionable, and tailored to you.
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-10">
          {[
            { icon: "✓", text: "Personalized checklist" },
            { icon: "◎", text: "Local recommendations" },
            { icon: "♡", text: "Community tips" },
          ].map((f, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(245,243,238,0.7)",
                backdropFilter: "blur(8px)"
              }}>
              <span style={{ color: "#D4A239", fontSize: "11px" }}>{f.icon}</span>
              {f.text}
            </span>
          ))}
        </div>

        <button onClick={() => setScreen("onboarding")}
          className="px-10 py-4 rounded-2xl text-[15px] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #D4A239 0%, #C49428 100%)",
            color: "#111110",
            border: "none",
            boxShadow: "0 4px 16px rgba(212,162,57,0.25), 0 1px 3px rgba(212,162,57,0.3)",
            fontFamily: SANS,
            letterSpacing: "-0.01em"
          }}>
          Get Started
          <span className="ml-2 inline-block transition-transform" style={{ display: "inline-block" }}>→</span>
        </button>

        <p className="mt-6 text-[13px] tracking-wide" style={{ color: "rgba(245,243,238,0.25)", fontFamily: SANS }}>
          Free forever · No account needed · Data stays on your device
        </p>
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
        style={{ background: "linear-gradient(165deg, #0F0F0E 0%, #1A1916 50%, #111110 100%)" }}>

        {/* Step progress bar */}
        <div className="flex items-center gap-1.5 mb-10">
          {steps.map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-full transition-all duration-500"
              style={{
                width: i <= step ? 28 : 8,
                height: 8,
                background: i <= step ? "linear-gradient(90deg, #D4A239, #C49428)" : "rgba(255,255,255,0.1)",
              }} />
          ))}
        </div>

        <div className="rounded-3xl p-10 w-full max-w-[500px]"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            animation: "scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
          }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4"
            style={{ color: "#D4A239", fontFamily: SANS }}>Step {step + 1} of {steps.length}</p>
          <h2 className="text-[28px] mb-7 leading-tight" style={{ fontFamily: SERIF, color: "#F5F3EE", fontWeight: 500, letterSpacing: "-0.01em" }}>{cur.q}</h2>

          {cur.type === "text" && (
            <input className="w-full px-5 py-4 rounded-2xl text-[15px] transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F5F3EE",
                fontFamily: SANS
              }}
              placeholder={cur.placeholder} value={profile[cur.field as keyof Profile] as string || ""}
              onChange={e => setProfile({ ...profile, [cur.field]: e.target.value })}
              onKeyDown={e => e.key === "Enter" && canNext && goNext()} autoFocus />
          )}
          {cur.type === "date" && (
            <input type="date" className="w-full px-5 py-4 rounded-2xl text-[15px] transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F5F3EE",
                fontFamily: SANS,
                colorScheme: "dark"
              }}
              value={moveDate} onChange={e => setMoveDate(e.target.value)} autoFocus />
          )}
          {cur.type === "select" && (
            <div className="flex flex-wrap gap-2.5">
              {(cur.options as string[]).map(o => (
                <button key={o} className="px-5 py-3 rounded-2xl text-[14px] cursor-pointer transition-all duration-200"
                  style={{
                    background: profile.background === o ? "rgba(212,162,57,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${profile.background === o ? "rgba(212,162,57,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: profile.background === o ? "#D4A239" : "rgba(245,243,238,0.7)",
                    fontFamily: SANS, fontWeight: profile.background === o ? 600 : 400
                  }}
                  onClick={() => setProfile({ ...profile, background: o })}>{o}</button>
              ))}
            </div>
          )}
          {cur.type === "multi" && (
            <div className="flex flex-wrap gap-2.5">
              {(cur.options as { id: string; label: string }[]).map(o => {
                const sel = profile.priorities.includes(o.id);
                return <button key={o.id} className="px-5 py-3 rounded-2xl text-[14px] cursor-pointer transition-all duration-200"
                  style={{
                    background: sel ? "rgba(212,162,57,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${sel ? "rgba(212,162,57,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: sel ? "#D4A239" : "rgba(245,243,238,0.7)",
                    fontFamily: SANS, fontWeight: sel ? 600 : 400
                  }}
                  onClick={() => setProfile({ ...profile, priorities: sel ? profile.priorities.filter(p => p !== o.id) : [...profile.priorities, o.id] })}>{o.label}</button>;
              })}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && <button className="px-6 py-3.5 rounded-2xl text-[14px] font-medium cursor-pointer transition-all duration-200"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(245,243,238,0.7)",
                fontFamily: SANS
              }}
              onClick={() => setStep(step - 1)}>
              <span className="mr-1">←</span> Back
            </button>}
            <button className="flex-1 px-9 py-3.5 rounded-2xl text-[15px] font-semibold cursor-pointer transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #D4A239, #C49428)",
                color: "#111110",
                border: "none",
                opacity: canNext ? 1 : 0.3,
                pointerEvents: canNext ? "auto" : "none",
                fontFamily: SANS,
                boxShadow: canNext ? "0 4px 16px rgba(212,162,57,0.2)" : "none"
              }}
              onClick={goNext}>
              {step === steps.length - 1 ? "Build My Playbook" : "Continue →"}
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
    <div className="min-h-screen relative" style={{ background: "#FAFAF7", fontFamily: SANS }}>
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="absolute w-2.5 h-2.5 rounded-sm"
              style={{ left: `${8 + Math.random() * 84}%`, top: -10,
                background: ["#D4A239", "#E06B4B", "#2D9B8A", "#4A72B8", "#C4527A"][i % 5],
                animation: `confettiFall 1.8s ease forwards`, animationDelay: `${Math.random() * 0.5}s` }} />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{
        background: "linear-gradient(135deg, #111110 0%, #1A1916 100%)",
        color: "#F5F3EE",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ fontFamily: SERIF, color: "#D4A239", background: "rgba(212,162,57,0.1)", border: "1px solid rgba(212,162,57,0.15)" }}>90</div>
          <div>
            <h1 className="text-lg font-medium tracking-tight" style={{ fontFamily: SERIF, fontWeight: 500, letterSpacing: "-0.01em" }}>
              {profile.name ? `${profile.name}\u2019s Playbook` : "My Playbook"}
            </h1>
            <p className="text-[12px] mt-0.5 font-medium" style={{ color: "rgba(245,243,238,0.4)", fontFamily: SANS, letterSpacing: "0.02em" }}>
              {profile.to || "New City"} {daysLeft !== null ? ` \u00b7 Day ${daysSinceMove} of 90 \u00b7 ${daysLeft} days left` : ""}
            </p>
          </div>
        </div>
        <button onClick={resetApp} title="Start over"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base cursor-pointer transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(245,243,238,0.5)" }}>↻</button>
      </header>

      {/* Progress Section */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: SERIF, color: "#1C1B18", letterSpacing: "-0.02em" }}>{progress}%</span>
            <span className="text-[13px] font-medium" style={{ color: "#9B978E" }}>complete</span>
          </div>
          <span className="text-[13px] font-medium px-3 py-1 rounded-full" style={{ background: "#F0EDE6", color: "#6B6860" }}>
            {doneTasks}/{totalTasks} tasks
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#EDEAE3" }}>
          <div className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #D4A239 0%, #C49428 50%, #B8863A 100%)" }} />
        </div>
      </div>

      {/* Content */}
      {!activeCategory ? (
        <div className="grid gap-3.5 px-6 pt-4 pb-10" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
          {CATEGORIES.map((cat, idx) => {
            const ct = tasks[cat.id] || [];
            const done = ct.filter(t => t.done).length;
            const total = ct.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <button key={cat.id}
                className={`rounded-2xl p-5 text-left cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3 stagger-${idx + 1}`}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "var(--shadow-sm)",
                  animation: "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLElement).style.borderColor = cat.color + "40"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.06)"; }}
                onClick={() => { setActiveCategory(cat.id); setFilter("all"); setExpandedTask(null); }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: cat.bg, fontSize: "22px" }}>{cat.icon}</div>
                <div>
                  <div className="text-[14px] font-semibold tracking-tight" style={{ color: "#1C1B18", lineHeight: 1.3 }}>{cat.label}</div>
                  <div className="text-[12px] font-medium mt-0.5" style={{ color: "#9B978E" }}>{done} of {total} done</div>
                </div>
                <div className="flex items-center gap-2.5 w-full mt-auto">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F0EDE6" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: cat.color, opacity: 0.85 }} />
                  </div>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: cat.color }}>{pct}%</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-6 pt-4 pb-10" style={{ animation: "fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <button className="inline-flex items-center gap-1.5 text-[13px] font-medium cursor-pointer py-2 bg-transparent border-none transition-colors duration-200"
            style={{ color: "#9B978E" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1C1B18")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9B978E")}
            onClick={() => { setActiveCategory(null); setExpandedTask(null); setAddingTask(false); }}>
            <span>←</span> All Categories
          </button>

          <div className="flex items-center gap-3.5 mb-5 mt-1">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: activeCat?.bg }}>{activeCat?.icon}</div>
            <div>
              <h2 className="text-[26px] leading-tight" style={{ fontFamily: SERIF, color: "#1C1B18", fontWeight: 500, letterSpacing: "-0.01em" }}>{activeCat?.label}</h2>
              <p className="text-[13px] font-medium mt-0.5" style={{ color: "#9B978E" }}>
                {catTasks.filter(t => t.done).length} of {catTasks.length} completed
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: "#F0EDE6" }}>
            {(["all", "pending", "done"] as const).map(f => (
              <button key={f} className="flex-1 px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200"
                style={{
                  border: "none",
                  background: filter === f ? "#FFFFFF" : "transparent",
                  color: filter === f ? "#1C1B18" : "#9B978E",
                  boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none"
                }}
                onClick={() => setFilter(f)}>
                {f === "all" ? `All (${catTasks.length})` : f === "pending" ? `To Do (${catTasks.filter(t => !t.done).length})` : `Done (${catTasks.filter(t => t.done).length})`}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredTasks.map(t => (
              <div key={t.id} className="rounded-xl px-4 py-3.5 transition-all duration-200"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderLeft: `3px solid ${PRIORITIES[t.priority]?.color || "#999"}`,
                  boxShadow: "var(--shadow-sm)"
                }}>
                <div className="flex items-center gap-3.5">
                  <button className="w-[22px] h-[22px] rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200"
                    style={{
                      border: `2px solid ${t.done ? activeCat?.color : "#D0CBC2"}`,
                      background: t.done ? activeCat?.color : "transparent",
                      boxShadow: t.done ? `0 0 0 2px ${activeCat?.color}20` : "none"
                    }}
                    onClick={() => toggleTask(activeCategory, t.id)}>
                    {t.done && <span className="text-white text-[11px] font-bold leading-none">✓</span>}
                  </button>
                  <div className="flex-1 cursor-pointer min-w-0" onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)}>
                    <span className="text-[14px] font-medium transition-all leading-snug"
                      style={{ color: t.done ? "#9B978E" : "#1C1B18", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
                    {t.day > 0 && <span className="text-[11px] font-semibold ml-2 px-2 py-0.5 rounded-md inline-block"
                      style={{ background: "#F0EDE6", color: "#9B978E" }}>Day {t.day}</span>}
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-lg font-bold whitespace-nowrap uppercase tracking-wide"
                    style={{ background: PRIORITIES[t.priority]?.bg, color: PRIORITIES[t.priority]?.color, letterSpacing: "0.04em" }}>
                    {PRIORITIES[t.priority]?.label}
                  </span>
                  <button className="bg-transparent border-none text-lg cursor-pointer px-1 leading-none transition-colors duration-200"
                    style={{ color: "#D0CBC2" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#D93025")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#D0CBC2")}
                    onClick={() => deleteTask(activeCategory, t.id)}>×</button>
                </div>
                {expandedTask === t.id && t.tip && (
                  <div className="flex gap-2.5 mt-3 p-3.5 rounded-xl"
                    style={{ background: "#FAFAF7", border: "1px solid #F0EDE6", animation: "slideDown 0.25s ease" }}>
                    <span className="text-sm flex-shrink-0">💡</span>
                    <span className="text-[13px] leading-relaxed" style={{ color: "#6B6860" }}>{t.tip}</span>
                  </div>
                )}
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12" style={{ animation: "fadeIn 0.4s ease" }}>
                <div className="text-3xl mb-3">{filter === "done" ? "💪" : filter === "pending" ? "🎉" : "📋"}</div>
                <p className="text-[14px] font-medium" style={{ color: "#9B978E" }}>
                  {filter === "done" ? "Nothing completed yet — you got this!" : filter === "pending" ? "All done here!" : "No tasks in this category."}
                </p>
              </div>
            )}
          </div>

          {addingTask ? (
            <div className="flex gap-2 mt-4 items-center">
              <input className="flex-1 px-4 py-3 rounded-xl text-[14px] transition-all duration-200"
                style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FFFFFF", fontFamily: SANS, boxShadow: "var(--shadow-sm)" }}
                placeholder="What do you need to do?" value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTaskItem(activeCategory)}
                autoFocus />
              <button className="px-5 py-3 rounded-xl text-[13px] font-semibold text-white cursor-pointer border-none transition-all duration-200"
                style={{ background: activeCat?.color, boxShadow: `0 2px 8px ${activeCat?.color}30` }}
                onClick={() => addTaskItem(activeCategory)}>Add</button>
              <button className="px-4 py-3 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200"
                style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FFFFFF", color: "#6B6860" }}
                onClick={() => { setAddingTask(false); setNewTask(""); }}>Cancel</button>
            </div>
          ) : (
            <button className="w-full py-3.5 rounded-xl text-[13px] font-semibold cursor-pointer mt-4 bg-transparent transition-all duration-200"
              style={{ border: `2px dashed rgba(0,0,0,0.1)`, color: "#9B978E" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = activeCat?.color || "#999"; e.currentTarget.style.color = activeCat?.color || "#999"; e.currentTarget.style.background = activeCat?.bg || "#f5f5f5"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.color = "#9B978E"; e.currentTarget.style.background = "transparent"; }}
              onClick={() => setAddingTask(true)}>+ Add Task</button>
          )}
        </div>
      )}
    </div>
  );
}
