"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const ROTATING_PHRASES = [
  "Precision Growth.",
  "Maximum Muscle.",
  "Flawless Progression.",
  "Peak Performance.",
  "Scientific Gains.",
  "Zero Guesswork.",
];

function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Extend with clone of first item for seamless infinite loop
  const extendedPhrases = [...ROTATING_PHRASES, ROTATING_PHRASES[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= ROTATING_PHRASES.length) {
          return 1;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // When reaching the clone, seamlessly reset to index 0 with no animation
  useEffect(() => {
    if (index === ROTATING_PHRASES.length) {
      const timer = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
        setTimeout(() => setAnimate(true), 40);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden h-[1.15em] sm:h-[1.2em] align-top px-1">
      <span
        className={`flex flex-col ${
          animate
            ? "transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            : "transition-none"
        }`}
        style={{
          transform: `translateY(-${(index * 100) / extendedPhrases.length}%)`,
          height: `${extendedPhrases.length * 100}%`,
        }}
      >
        {extendedPhrases.map((phrase, i) => {
          const isActive =
            i === index || (index === ROTATING_PHRASES.length && i === 0);
          return (
            <span
              key={i}
              className={`h-[1.15em] sm:h-[1.2em] flex items-center justify-center bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.4)] transition-opacity duration-500 whitespace-nowrap px-1 ${
                isActive ? "opacity-100 scale-100" : "opacity-25 scale-95"
              }`}
            >
              {phrase}
            </span>
          );
        })}
      </span>
    </span>
  );
}

function InteractiveDeepDive() {
  const [activeTab, setActiveTab] = useState<"routine" | "coach" | "telemetry">("routine");
  const [selectedSplit, setSelectedSplit] = useState<"ppl" | "upper" | "full">("ppl");

  const splitData = {
    ppl: {
      title: "Push / Pull / Legs Hypertrophy Split",
      tag: "Optimal Frequency • 6-Day Microcycle",
      exercises: [
        { name: "Incline Barbell Bench Press", muscle: "Upper Chest", sets: "3 × 8–10", rpe: "8.5", load: "195 lbs" },
        { name: "Weighted Dips", muscle: "Lower Chest & Triceps", sets: "3 × 10–12", rpe: "8.0", load: "+45 lbs" },
        { name: "Seated Cable Flyes", muscle: "Sternal Pecs", sets: "3 × 12–15", rpe: "9.0", load: "35 lbs" },
        { name: "Overhead DB Triceps Ext", muscle: "Triceps Long Head", sets: "4 × 12", rpe: "8.5", load: "65 lbs" },
      ],
      aiScore: "99.4%",
      volumeTonnage: "14,280 lbs",
    },
    upper: {
      title: "Upper Body Strength & Density",
      tag: "High Intensity • 4-Day Microcycle",
      exercises: [
        { name: "Barbell Overhead Press", muscle: "Anterior Delts", sets: "4 × 6–8", rpe: "8.5", load: "135 lbs" },
        { name: "Weighted Pull-Ups", muscle: "Latissimus Dorsi", sets: "4 × 6–8", rpe: "9.0", load: "+30 lbs" },
        { name: "Barbell Bent-Over Row", muscle: "Mid-Back & Rhomboids", sets: "3 × 8", rpe: "8.0", load: "185 lbs" },
        { name: "Incline DB Curl", muscle: "Biceps Brachii", sets: "3 × 12", rpe: "8.5", load: "35 lbs" },
      ],
      aiScore: "98.8%",
      volumeTonnage: "16,100 lbs",
    },
    full: {
      title: "Full Body Functional Power",
      tag: "Max Efficiency • 3-Day Microcycle",
      exercises: [
        { name: "Barbell Back Squat", muscle: "Quadriceps & Glutes", sets: "4 × 6", rpe: "8.5", load: "275 lbs" },
        { name: "Romanian Deadlift", muscle: "Hamstrings & Lower Back", sets: "3 × 8", rpe: "8.0", load: "225 lbs" },
        { name: "Incline Dumbbell Press", muscle: "Upper Chest", sets: "3 × 10", rpe: "8.5", load: "80 lbs" },
        { name: "Hanging Leg Raise", muscle: "Core & Hip Flexors", sets: "3 × 15", rpe: "9.0", load: "BW" },
      ],
      aiScore: "99.1%",
      volumeTonnage: "19,850 lbs",
    },
  };

  const currentSplit = splitData[selectedSplit];

  return (
    <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-[#051126]/90 via-[#030a1a]/95 to-[#020613] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-8">
        {/* Top Header & Tab Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE AI INTERACTIVE EXPERIENCE</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Test-drive the Fostura Intelligence Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              Switch between interactive telemetry modes to see how Fostura transforms routine architecture and progression.
            </p>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 self-start md:self-auto overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("routine")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all button-press ${
                activeTab === "routine"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>⚡</span>
              <span>AI Architect</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("coach")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all button-press ${
                activeTab === "coach"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🤖</span>
              <span>Live Coach AI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("telemetry")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all button-press ${
                activeTab === "telemetry"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📈</span>
              <span>Telemetry Matrix</span>
            </button>
          </div>
        </div>

        {/* Tab 1: AI Architect */}
        {activeTab === "routine" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-lg font-black text-white">{currentSplit.title}</h4>
                  <p className="text-xs text-cyan-300 font-semibold">{currentSplit.tag}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSplit("ppl")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedSplit === "ppl"
                        ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    PPL Hypertrophy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSplit("upper")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedSplit === "upper"
                        ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    Upper / Lower
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSplit("full")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedSplit === "full"
                        ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    Full Body Power
                  </button>
                </div>
              </div>

              {/* Exercise Telemetry Grid */}
              <div className="space-y-2">
                {currentSplit.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-400/40 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-xs font-black text-cyan-300">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black text-white truncate">{ex.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{ex.muscle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-400/30 font-mono text-xs font-black text-sky-200">
                        {ex.sets}
                      </span>
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-slate-300">
                        {ex.load}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-teal-300 bg-teal-500/15 border border-teal-400/30">
                        RPE {ex.rpe}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Summary Card */}
            <div className="rounded-2xl bg-gradient-to-b from-sky-950/60 via-[#061838]/80 to-cyan-950/50 border border-cyan-400/40 p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block mb-1">
                  ARCHITECT TELEMETRY SPECS
                </span>
                <h5 className="text-lg font-black text-white">Split Optimization</h5>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>Biomechanical Fit</span>
                      <span className="text-cyan-300 font-mono">{currentSplit.aiScore}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full" style={{ width: currentSplit.aiScore }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#030914]/80 border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Microcycle Volume</span>
                    <span className="text-xl font-black text-white font-mono">{currentSplit.volumeTonnage}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs text-cyan-200 leading-relaxed">
                    ✨ <strong className="text-white">AI Note:</strong> Frequency calibrated for 48h myofibrillar protein synthesis reset between overlapping motor units.
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-xs font-black text-white shadow-lg shadow-cyan-500/25 button-press hover:opacity-95"
              >
                <span>Launch in Fostura Studio</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Live Coach AI */}
        {activeTab === "coach" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 rounded-2xl bg-[#030917]/90 border border-white/10 p-5 space-y-4 shadow-inner">
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                  ✨
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Coach Fostura Dialogue Simulation</span>
                    <span className="px-2 py-0.2 rounded text-[8px] font-bold text-cyan-300 bg-cyan-500/20">LIVE</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Contextual sports nutritionist & biomechanics expert</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed max-h-80 overflow-y-auto pr-1">
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] font-medium">
                    How should I progress my Incline Bench Press weight today?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="liquid-glass border border-cyan-400/30 text-slate-200 rounded-2xl rounded-tl-sm p-4 max-w-[88%] space-y-2 shadow-lg">
                    <p className="font-bold text-cyan-300 text-xs">Coach Fostura:</p>
                    <p>
                      Looking at your past logs, you crushed <strong>190 lbs × 8 reps</strong> at RPE 8.0 last week with pristine bar velocity.
                    </p>
                    <p>
                      Today, let&apos;s apply <strong className="text-white">double progressive overload</strong>:
                    </p>
                    <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/25 space-y-1 text-[11px]">
                      <p>• <strong>Set 1:</strong> 195 lbs × 8 reps (Target +5 lbs PR)</p>
                      <p>• <strong>Set 2:</strong> 195 lbs × 6–8 reps</p>
                      <p>• <strong>Set 3:</strong> 185 lbs × 8–10 reps (Back-off volume)</p>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Focus on a 2-second controlled negative and driving your heels into the floor. Ready to lock it in?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-sky-950/60 to-cyan-950/40 border border-cyan-400/30 p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block mb-1">
                  1-ON-1 AI TRAINER
                </span>
                <h5 className="text-lg font-black text-white">No Robotic Walls of Text</h5>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  Coach Fostura talks like an elite trainer texting you between sets. Instant answers on meal recipes, macro targets, and form cues.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] text-slate-300 flex items-center gap-2">
                    <span>🥗</span>
                    <span>Actionable high-protein meal recipes</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] text-slate-300 flex items-center gap-2">
                    <span>⏱️</span>
                    <span>Scientifically timed rest intervals</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] text-slate-300 flex items-center gap-2">
                    <span>⚡</span>
                    <span>Multi-turn contextual conversation memory</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-xs font-black text-white shadow-lg shadow-cyan-500/25 button-press hover:opacity-95"
              >
                <span>Chat with Coach Fostura</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Telemetry Matrix */}
        {activeTab === "telemetry" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="liquid-glass rounded-2xl p-3.5 border border-white/10">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Total Tonnage</span>
                  <p className="text-xl font-black text-white mt-1">18,450 lbs</p>
                  <p className="text-[10px] text-emerald-400 font-bold mt-0.5">↑ 12.4% vs last week</p>
                </div>
                <div className="liquid-glass rounded-2xl p-3.5 border border-white/10">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Sets Completed</span>
                  <p className="text-xl font-black text-cyan-300 mt-1">32 Sets</p>
                  <p className="text-[10px] text-sky-300 font-bold mt-0.5">100% Target Hit</p>
                </div>
                <div className="liquid-glass rounded-2xl p-3.5 border border-white/10">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Average RIR</span>
                  <p className="text-xl font-black text-teal-300 mt-1">1.8 RIR</p>
                  <p className="text-[10px] text-teal-400 font-bold mt-0.5">Optimal Fatigue</p>
                </div>
                <div className="liquid-glass rounded-2xl p-3.5 border border-white/10">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Active Streak</span>
                  <p className="text-xl font-black text-amber-300 mt-1">5 Days</p>
                  <p className="text-[10px] text-amber-400 font-bold mt-0.5">🔥 On Fire</p>
                </div>
              </div>

              {/* Volume Velocity Progression Visualizer */}
              <div className="rounded-2xl bg-[#030917]/90 border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                      Movement Volume Distribution
                    </span>
                    <h5 className="text-sm font-bold text-white">Compound Lift Progression Curve</h5>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    +14.2% Growth Velocity
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Chest & Anterior Delts (Incline Bench)</span>
                      <span className="font-mono text-cyan-300">6,840 lbs (37%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" style={{ width: "37%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Back & Upper Latissimus (Cable Rows)</span>
                      <span className="font-mono text-sky-300">5,920 lbs (32%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-teal-300 rounded-full" style={{ width: "32%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Triceps & Medial Delts (Accessories)</span>
                      <span className="font-mono text-teal-300">5,690 lbs (31%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" style={{ width: "31%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-sky-950/60 to-cyan-950/40 border border-cyan-400/30 p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 block mb-1">
                  REAL-TIME METRIC LOGGING
                </span>
                <h5 className="text-lg font-black text-white">Automated PR Alerts</h5>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  Never forget your numbers again. All set metrics, tonnage totals, and personal records automatically sync to your private cloud storage with Supabase.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-[#030914]/80 border border-white/10 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Recent Milestone</span>
                  <p className="font-black text-white flex items-center gap-1.5 text-xs">
                    <span>🏆</span>
                    <span>Incline Bench: 195 lbs × 8 (New PR!)</span>
                  </p>
                </div>
              </div>

              <Link
                href="/history"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-xs font-black text-white shadow-lg shadow-cyan-500/25 button-press hover:opacity-95"
              >
                <span>View Full History Portal</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // ── Auth Redirect: Automatically route logged-in users to /dashboard ──
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen bg-[#020713] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-white relative overflow-hidden font-sans">
      {/* ── Ambient Glowing Background Orbs ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[800px] rounded-full bg-gradient-to-b from-cyan-500/20 via-sky-600/10 to-transparent blur-[120px] opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[35%] -left-40 h-[450px] w-[500px] rounded-full bg-cyan-600/10 blur-[130px] opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[60%] -right-40 h-[500px] w-[550px] rounded-full bg-teal-500/10 blur-[140px] opacity-50"
      />

      {/* ── Grid Pattern Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030914]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group button-press">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-cyan-400/40 bg-sky-950/50 shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all group-hover:border-cyan-300 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.45)] p-1">
              <Image
                src="/forma-logo.png"
                alt="Fostura Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)] transition-transform group-hover:scale-105"
                priority
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-[#020713]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-200 transition-colors leading-tight">
                Fostura
              </span>
              <span className="text-[9px] uppercase font-extrabold tracking-widest bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                AI Fitness Studio
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-300 transition-colors">
              Features
            </a>
            <a href="#ai-studio" className="hover:text-cyan-300 transition-colors">
              AI Studio
            </a>
            <a href="#telemetry" className="hover:text-cyan-300 transition-colors">
              Telemetry
            </a>
            <Link href="/history" className="hover:text-cyan-300 transition-colors">
              Workout History
            </Link>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-3 min-h-[40px]">
            {isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-all button-press"
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="relative group overflow-hidden px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-xs font-black text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] transition-all button-press"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span>Get Started</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </SignUpButton>
              </>
            )}

            {isLoaded && isSignedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-95 transition-opacity button-press"
                >
                  Go to Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 ring-2 ring-cyan-400/40 rounded-xl",
                    },
                  }}
                />
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Landing Page Content ── */}
      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-8 max-w-5xl mx-auto text-center z-10">
          {/* Innovation Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-bold shadow-[0_0_25px_rgba(56,189,248,0.25)] backdrop-blur-xl mb-8 animate-fade-in-down">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>✨ Live Biomechanical AI Telemetry</span>
          </div>

          {/* Main Headline with Animated Rotating Phrases */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.12] max-w-4xl mx-auto">
            Intelligent Training.{" "}
            <span className="block mt-1 sm:mt-2">
              <RotatingHeadline />
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Your 24/7 AI-powered fitness coach. Stop guessing and start building with
            perfectly optimized routines and real-time telemetry.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <SignUpButton mode="modal">
              <button
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-sm font-black text-white shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_45px_rgba(56,189,248,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all button-press"
              >
                <span>Start Tracking Free</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </SignUpButton>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 hover:border-cyan-400/50 text-sm font-bold text-slate-200 hover:text-white transition-all button-press backdrop-blur-xl"
            >
              <span>Explore Live Studio</span>
              <span className="text-cyan-400">⚡</span>
            </Link>
          </div>

          {/* Micro-Features Strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              <span>77+ Biomechanical Movements</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Zero Spreadsheets Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Cloud History & Metrics Sync</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            INTERACTIVE HERO DEMO PREVIEW (Glassmorphic Mockup)
            ═══════════════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-8 max-w-5xl mx-auto pb-24 z-10 relative">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyan-400/30 via-white/10 to-transparent shadow-[0_0_50px_rgba(0,168,232,0.15)]">
            <div className="rounded-[22px] bg-[#040a17]/90 border border-white/10 p-4 sm:p-8 backdrop-blur-2xl overflow-hidden space-y-6">
              {/* Studio Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="flex h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="flex h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-mono font-bold text-slate-400 pl-2">fostura-telemetry-engine v2.4</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold">
                    LIVE HUD
                  </span>
                  <span className="text-xs font-mono text-slate-400">00:48:12</span>
                </div>
              </div>

              {/* Mockup Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Active Movement Card */}
                <div className="md:col-span-2 rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Active Movement 1 of 5</span>
                      <h4 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                        <span>Incline Barbell Bench Press</span>
                        <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-400/40">
                          ✨ +5 lbs AI Target
                        </span>
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                      3 / 4 sets done
                    </span>
                  </div>

                  {/* Sets Progress Table */}
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                      <span>Set</span>
                      <span>Weight</span>
                      <span>Target Reps</span>
                      <span className="text-right">Status</span>
                    </div>
                    <div className="grid grid-cols-4 items-center bg-cyan-500/10 border border-cyan-400/30 rounded-xl px-3 py-2 text-white font-semibold">
                      <span className="text-cyan-300 font-bold">1</span>
                      <span>185 lbs</span>
                      <span>10 reps</span>
                      <span className="text-right text-emerald-400 font-bold">✓ 10 Done</span>
                    </div>
                    <div className="grid grid-cols-4 items-center bg-cyan-500/10 border border-cyan-400/30 rounded-xl px-3 py-2 text-white font-semibold">
                      <span className="text-cyan-300 font-bold">2</span>
                      <span>195 lbs</span>
                      <span>8 reps</span>
                      <span className="text-right text-emerald-400 font-bold">✓ 8 Done</span>
                    </div>
                    <div className="grid grid-cols-4 items-center bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold">
                      <span className="text-slate-400 font-bold">3</span>
                      <span>205 lbs</span>
                      <span>6 reps</span>
                      <span className="text-right text-sky-300 animate-pulse font-bold">In Progress</span>
                    </div>
                  </div>
                </div>

                {/* AI Coach Live Insight Snippet */}
                <div className="rounded-2xl bg-gradient-to-b from-sky-950/60 to-cyan-950/40 border border-cyan-400/30 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">🤖</span>
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-300">Coach Fostura Live AI</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed mt-3">
                      &quot;Great tempo on Set 2! Rest 90 seconds, then focus on tucking elbows at 45° on Set 3 to maximize upper pec recruitment.&quot;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#030914]/80 border border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="font-bold text-cyan-400">⏱️ Active Rest Timer</span>
                    <span className="font-mono font-bold text-white text-sm">01:14</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURES GRID (3-Column Glassmorphic Cards)
            ═══════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              ENGINEERED FOR PROGRESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
              Everything you need to surpass your limits.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-4">
              Designed with precision mechanics, sports science data, and high-performance glassmorphism.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* ── CARD 1: AI STUDIO ── */}
            <div
              id="ai-studio"
              className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent hover:from-white/[0.08] border border-white/10 hover:border-cyan-400/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              <div aria-hidden className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl group-hover:bg-cyan-500/30 transition-all" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-xl text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:scale-110 transition-transform">
                    ✨
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[9px] font-extrabold uppercase tracking-widest text-cyan-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Llama 3.3 Engine</span>
                  </span>
                </div>

                <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400">
                  SMART WORKOUT ARCHITECT
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 mb-2">
                  AI Studio
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Algorithmic routine generation that tailors volume, sets, and rep schemes to your exact equipment and target recovery windows.
                </p>

                {/* ── GRAPHIC: Live AI Split Flow Visualizer ── */}
                <div className="rounded-2xl bg-[#030917]/90 border border-white/10 p-3.5 space-y-2.5 shadow-inner">
                  {/* Split Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/25 border border-cyan-400/50 text-[9px] font-bold text-cyan-200 shadow-sm shadow-cyan-500/20">
                      ⚡ Hypertrophy PPL
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400">
                      Upper / Lower
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400">
                      Strength 5×5
                    </span>
                  </div>

                  {/* Flow Nodes */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-cyan-500/20 text-[8px] font-bold text-cyan-300">1</span>
                        <span className="font-bold text-white truncate">Incline Barbell Press</span>
                      </div>
                      <span className="font-mono text-[10px] font-extrabold text-cyan-300 shrink-0">3 × 8–10</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-sky-500/20 text-[8px] font-bold text-sky-300">2</span>
                        <span className="font-bold text-white truncate">Seated Cable Row</span>
                      </div>
                      <span className="font-mono text-[10px] font-extrabold text-sky-300 shrink-0">3 × 10–12</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-teal-500/20 text-[8px] font-bold text-teal-300">3</span>
                        <span className="font-bold text-white truncate">Dumbbell Lateral Raise</span>
                      </div>
                      <span className="font-mono text-[10px] font-extrabold text-teal-300 shrink-0">4 × 12–15</span>
                    </div>
                  </div>

                  {/* Calibration Progress Bar */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-1">
                      <span className="text-cyan-400">Biomechanics Optimization</span>
                      <span className="font-mono text-cyan-300">100%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 animate-pulse rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-cyan-300">
                <span>Personalized Routines</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* ── CARD 2: LIVE FORM & PROGRESSION ── */}
            <div className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent hover:from-white/[0.08] border border-white/10 hover:border-sky-400/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div aria-hidden className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-sky-500/15 blur-3xl group-hover:bg-sky-500/30 transition-all" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 border border-sky-400/40 text-xl text-sky-300 shadow-[0_0_20px_rgba(14,165,233,0.25)] group-hover:scale-110 transition-transform">
                    🎯
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-[9px] font-extrabold uppercase tracking-widest text-sky-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                    <span>Real-Time Telemetry</span>
                  </span>
                </div>

                <span className="text-[10px] uppercase font-black tracking-widest text-sky-400">
                  ADAPTIVE OVERLOAD ENGINE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 mb-2">
                  Live Form & Progression
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Intelligent progressive overload triggers automatically calculate weight increments and optimal set rest periods as you lift.
                </p>

                {/* ── GRAPHIC: Live Progression Comparative Bars & Form Telemetry ── */}
                <div className="rounded-2xl bg-[#030917]/90 border border-white/10 p-3.5 space-y-3 shadow-inner">
                  {/* Visual Bar Comparison Chart */}
                  <div className="grid grid-cols-3 gap-2 items-end h-24 pt-2 border-b border-white/[0.06] pb-2">
                    {/* W1 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono text-slate-400 font-bold">185</span>
                      <div className="w-full bg-slate-700/50 rounded-t-lg h-10 transition-all group-hover:bg-slate-600/60" />
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Wk 1</span>
                    </div>
                    {/* W2 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono text-slate-300 font-bold">190</span>
                      <div className="w-full bg-sky-600/60 rounded-t-lg h-14 transition-all group-hover:bg-sky-500/70" />
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Wk 2</span>
                    </div>
                    {/* Today (AI Target) */}
                    <div className="flex flex-col items-center gap-1 relative">
                      <span className="absolute -top-4 text-[8px] font-black text-cyan-300 uppercase px-1 py-0.2 rounded bg-cyan-500/30 border border-cyan-400/40 whitespace-nowrap animate-bounce">
                        +5 lbs ✨
                      </span>
                      <span className="text-[10px] font-mono text-cyan-200 font-black">195</span>
                      <div className="w-full bg-gradient-to-t from-sky-500 to-cyan-400 rounded-t-lg h-20 shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                      <span className="text-[8px] font-extrabold text-cyan-300 uppercase">Today</span>
                    </div>
                  </div>

                  {/* Form Cue Pill */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[10px]">
                    <span className="text-xs">✨</span>
                    <span className="font-semibold text-slate-200 truncate">
                      Cue: <span className="text-cyan-300 font-bold">Tuck elbows at 45°</span> for peak chest recruitment.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-sky-300">
                <span>Automated Overload</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* ── CARD 3: ADVANCED TELEMETRY ── */}
            <div
              id="telemetry"
              className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent hover:from-white/[0.08] border border-white/10 hover:border-teal-400/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              <div aria-hidden className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-teal-500/15 blur-3xl group-hover:bg-teal-500/30 transition-all" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 border border-teal-400/40 text-xl text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.25)] group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-[9px] font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span>Cloud Sync</span>
                  </span>
                </div>

                <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">
                  DEEP VOLUME & VELOCITY ANALYTICS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 mb-2">
                  Advanced Telemetry
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Visual volume tonnage, microcycle completion charts, calorie burn estimates, and personal record tracking keep you accountable every session.
                </p>

                {/* ── GRAPHIC: SVG Animated Volume Curve & Metrics Strip ── */}
                <div className="rounded-2xl bg-[#030917]/90 border border-white/10 p-3.5 space-y-3 shadow-inner">
                  {/* Volume Metric & Spike Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Weekly Volume</span>
                      <span className="font-mono text-base font-black text-white">18,450 lbs</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-black">
                      +14.2% Spike
                    </span>
                  </div>

                  {/* SVG Wave / Line Chart */}
                  <div className="relative h-16 w-full overflow-hidden">
                    <svg className="h-full w-full overflow-visible" viewBox="0 0 200 60" fill="none">
                      <defs>
                        <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 50 Q 30 45, 60 35 T 120 25 T 160 15 T 200 8 L 200 60 L 0 60 Z"
                        fill="url(#telemetryGrad)"
                      />
                      <path
                        d="M 0 50 Q 30 45, 60 35 T 120 25 T 160 15 T 200 8"
                        stroke="#2dd4bf"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="200" cy="8" r="4" fill="#2dd4bf" className="animate-ping" />
                      <circle cx="200" cy="8" r="3" fill="#ffffff" />
                    </svg>
                  </div>

                  {/* 7-Day Consistency Microcycle Streak */}
                  <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase text-slate-400">Microcycle Streak</span>
                    <div className="flex gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, di) => {
                        const isDone = di < 5;
                        return (
                          <span
                            key={di}
                            className={`flex h-4 w-4 items-center justify-center rounded text-[8px] font-extrabold ${
                              isDone
                                ? "bg-teal-500/25 border border-teal-400/50 text-teal-200"
                                : "bg-white/5 text-slate-600"
                            }`}
                          >
                            {d}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-teal-300">
                <span>Volume & PR Analytics</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Interactive Live Deep Dive Showcase ── */}
        <InteractiveDeepDive />

        {/* ═══════════════════════════════════════════════════════════════
            CALL TO ACTION BANNER (Bottom)
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 relative">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-sky-950/70 via-[#061838]/90 to-cyan-950/70 border border-cyan-400/40 shadow-[0_0_60px_rgba(56,189,248,0.25)] backdrop-blur-2xl text-center overflow-hidden">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/15 via-transparent to-transparent" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-300">
                JOIN THE FUTURE OF STRENGTH TRAINING
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to transform your physique with AI precision?
              </h2>
              <p className="text-xs sm:text-base text-slate-300 max-w-lg mx-auto">
                No credit card required. Start building custom routines, tracking sets, and smashing personal records today.
              </p>

              <div className="pt-2">
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-sm font-black text-white shadow-xl hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:scale-105 transition-all button-press"
                  >
                    Start Training for Free →
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.08] bg-[#020611] py-12 px-4 sm:px-8 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-cyan-400/40 bg-sky-950/50 p-1 shadow-md shadow-cyan-500/20">
              <Image
                src="/forma-logo.png"
                alt="Fostura Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-white">Fostura</span>
              <span className="text-[9px] uppercase font-bold text-sky-400 -mt-0.5">
                AI Fitness Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/history" className="hover:text-white transition-colors">
              History
            </Link>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Fostura. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
