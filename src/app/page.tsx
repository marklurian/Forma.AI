"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  EXERCISE_LIBRARY,
  BodyPart,
  EquipmentCategory,
  ExerciseLibraryItem,
} from "./data/exercises";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
interface Exercise {
  name: string;
  sets: number;
  reps: string;
}

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

interface TrackedSet {
  targetReps: string;
  weight: string;
  actualReps: string;
  completed: boolean;
}

interface TrackedExercise {
  name: string;
  trackedSets: TrackedSet[];
}

interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  exercises: Exercise[];
  isExample?: boolean;
}

interface MetricEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // lbs
  bodyFat: number; // %
  calories: number; // kcal
}

interface ExerciseHistoryItem {
  id: string;
  date: string; // YYYY-MM-DD
  sets: { setNum: number; weight: number; reps: number }[];
  unit: "lbs" | "kg";
}

/* ═══════════════════════════════════════════════════════════════
   Constants & Datasets
   ═══════════════════════════════════════════════════════════════ */
const FITNESS_GOALS = ["Lose Weight", "Build Muscle", "Get Lean", "Strength"] as const;
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const EQUIPMENT_OPTIONS = ["Full Gym", "Dumbbells Only", "Bodyweight"] as const;

const EXAMPLE_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "ex-push",
    name: "Push Hypertrophy",
    category: "Chest & Shoulders",
    isExample: true,
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10" },
      { name: "Seated Shoulder Press", sets: 3, reps: "8-10" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      { name: "Lateral Raise", sets: 3, reps: "12-15" },
      { name: "Tricep Pushdown", sets: 3, reps: "12-15" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ex-pull",
    name: "Pull Strength",
    category: "Back & Biceps",
    isExample: true,
    exercises: [
      { name: "Deadlift", sets: 4, reps: "5-6" },
      { name: "Bent-Over Row", sets: 4, reps: "8-10" },
      { name: "Lat Pulldown", sets: 3, reps: "8-10" },
      { name: "Face Pull", sets: 3, reps: "15-20" },
      { name: "Incline Curl", sets: 3, reps: "10-12" },
      { name: "Hammer Curl", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ex-legs",
    name: "Leg Power & Quads",
    category: "Lower Body",
    isExample: true,
    exercises: [
      { name: "Back Squat", sets: 4, reps: "6-8" },
      { name: "Romanian Deadlift (RDL)", sets: 4, reps: "8-10" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "10 each" },
      { name: "Leg Extension", sets: 3, reps: "12-15" },
      { name: "Seated Leg Curl", sets: 3, reps: "12-15" },
      { name: "Standing Calf Raise", sets: 4, reps: "15-20" },
    ],
  },
  {
    id: "ex-upper",
    name: "Upper Body Power",
    category: "Complete Upper",
    isExample: true,
    exercises: [
      { name: "Incline Bench Press", sets: 4, reps: "6-8" },
      { name: "Pull-Ups", sets: 4, reps: "6-8" },
      { name: "Overhead Press", sets: 3, reps: "8-10" },
      { name: "Seated Cable Row", sets: 3, reps: "10-12" },
      { name: "Lateral Raise", sets: 3, reps: "12-15" },
      { name: "Tricep Pushdown", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ex-full",
    name: "Full Body Foundation",
    category: "Total Body",
    isExample: true,
    exercises: [
      { name: "Back Squat", sets: 3, reps: "8-10" },
      { name: "Bench Press", sets: 3, reps: "8-10" },
      { name: "Bent-Over Row", sets: 3, reps: "8-10" },
      { name: "Romanian Deadlift (RDL)", sets: 3, reps: "10-12" },
      { name: "Lateral Raise", sets: 3, reps: "12-15" },
      { name: "Hanging Leg Raise", sets: 3, reps: "12-15" },
    ],
  },
  {
    id: "ex-hiit",
    name: "HIIT Conditioning",
    category: "Cardio & Stamina",
    isExample: true,
    exercises: [
      { name: "Thrusters", sets: 4, reps: "12" },
      { name: "Push-Ups", sets: 4, reps: "15" },
      { name: "Mountain Climbers", sets: 4, reps: "40s" },
      { name: "Hanging Leg Raise", sets: 4, reps: "12" },
    ],
  },
];

const SEEDED_METRICS: MetricEntry[] = [
  { id: "m-1", date: "2026-03-01", weight: 184.2, bodyFat: 19.4, calories: 2650 },
  { id: "m-2", date: "2026-04-01", weight: 181.8, bodyFat: 18.6, calories: 2500 },
  { id: "m-3", date: "2026-05-01", weight: 179.5, bodyFat: 17.8, calories: 2420 },
  { id: "m-4", date: "2026-06-01", weight: 177.0, bodyFat: 16.9, calories: 2380 },
  { id: "m-5", date: "2026-07-01", weight: 175.4, bodyFat: 16.1, calories: 2350 },
  { id: "m-6", date: "2026-08-01", weight: 173.8, bodyFat: 15.5, calories: 2300 },
  { id: "m-7", date: "2026-08-15", weight: 172.9, bodyFat: 15.1, calories: 2280 },
  { id: "m-8", date: "2026-08-22", weight: 172.1, bodyFat: 14.8, calories: 2260 },
  { id: "m-9", date: "2026-08-25", weight: 171.6, bodyFat: 14.7, calories: 2250 },
  { id: "m-10", date: "2026-08-28", weight: 171.0, bodyFat: 14.5, calories: 2200 },
  { id: "m-11", date: "2026-08-30", weight: 170.4, bodyFat: 14.2, calories: 2180 },
];

const SEEDED_EXERCISE_HISTORY: Record<string, ExerciseHistoryItem[]> = {
  "lib-bench-press": [
    {
      id: "h-b1",
      date: "2026-08-28",
      unit: "lbs",
      sets: [
        { setNum: 1, weight: 185, reps: 10 },
        { setNum: 2, weight: 205, reps: 8 },
        { setNum: 3, weight: 225, reps: 6 },
        { setNum: 4, weight: 225, reps: 5 }
      ]
    },
    {
      id: "h-b2",
      date: "2026-08-21",
      unit: "lbs",
      sets: [
        { setNum: 1, weight: 185, reps: 8 },
        { setNum: 2, weight: 205, reps: 8 },
        { setNum: 3, weight: 215, reps: 6 }
      ]
    }
  ],
  "lib-back-squat": [
    {
      id: "h-s1",
      date: "2026-08-26",
      unit: "lbs",
      sets: [
        { setNum: 1, weight: 225, reps: 8 },
        { setNum: 2, weight: 275, reps: 6 },
        { setNum: 3, weight: 295, reps: 5 },
        { setNum: 4, weight: 315, reps: 3 }
      ]
    }
  ],
  "lib-deadlift": [
    {
      id: "h-d1",
      date: "2026-08-24",
      unit: "lbs",
      sets: [
        { setNum: 1, weight: 275, reps: 5 },
        { setNum: 2, weight: 315, reps: 5 },
        { setNum: 3, weight: 365, reps: 4 }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════════════════════
   Helpers & Persistence
   ═══════════════════════════════════════════════════════════════ */
function formatTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

function formatTimeLong(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}s`;
  return `${m}m ${sec}s`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function exercisesToTracked(exercises: Exercise[]): TrackedExercise[] {
  return exercises.map((ex) => ({
    name: ex.name,
    trackedSets: Array.from({ length: ex.sets }, () => ({
      targetReps: ex.reps,
      weight: "",
      actualReps: "",
      completed: false,
    })),
  }));
}

function loadUserTemplates(): WorkoutTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("forma-templates") || "[]");
  } catch {
    return [];
  }
}

function saveUserTemplates(t: WorkoutTemplate[]) {
  localStorage.setItem("forma-templates", JSON.stringify(t));
}

function loadUserMetrics(): MetricEntry[] {
  if (typeof window === "undefined") return SEEDED_METRICS;
  try {
    const raw = localStorage.getItem("forma-metrics");
    if (!raw) return SEEDED_METRICS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEEDED_METRICS;
  } catch {
    return SEEDED_METRICS;
  }
}

function saveUserMetrics(m: MetricEntry[]) {
  localStorage.setItem("forma-metrics", JSON.stringify(m));
}

function loadExerciseHistory(): Record<string, ExerciseHistoryItem[]> {
  if (typeof window === "undefined") return SEEDED_EXERCISE_HISTORY;
  try {
    const raw = localStorage.getItem("forma-exercise-history");
    if (!raw) return SEEDED_EXERCISE_HISTORY;
    return JSON.parse(raw);
  } catch {
    return SEEDED_EXERCISE_HISTORY;
  }
}

function saveExerciseHistory(h: Record<string, ExerciseHistoryItem[]>) {
  localStorage.setItem("forma-exercise-history", JSON.stringify(h));
}

/* ═══════════════════════════════════════════════════════════════
   Segmented Unit Selector Component [ LBS | KG ]
   ═══════════════════════════════════════════════════════════════ */
function UnitTogglePill({
  unit,
  onChange,
  size = "md",
}: {
  unit: "lbs" | "kg";
  onChange: (u: "lbs" | "kg") => void;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3.5 py-1 text-xs";
  return (
    <div className="liquid-pill flex items-center rounded-xl p-0.5 border-sky-400/20 shrink-0 select-none">
      <button
        type="button"
        onClick={() => onChange("lbs")}
        className={`${pad} font-extrabold rounded-lg transition-all ${
          unit === "lbs"
            ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/25"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`}
      >
        LBS
      </button>
      <button
        type="button"
        onClick={() => onChange("kg")}
        className={`${pad} font-extrabold rounded-lg transition-all ${
          unit === "kg"
            ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/25"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`}
      >
        KG
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Liquid Background with Ambient Fluid Orbs (Ocean Blue Serenity)
   ═══════════════════════════════════════════════════════════════ */
function LiquidBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-blob-1 absolute -left-[10%] top-[8%] h-[580px] w-[580px] rounded-full bg-[#003b73]/25 blur-[130px]" />
      <div className="animate-blob-2 absolute -right-[10%] top-[20%] h-[620px] w-[620px] rounded-full bg-[#0074b7]/20 blur-[140px]" />
      <div className="animate-blob-1 absolute left-[28%] top-[60%] h-[520px] w-[520px] rounded-full bg-[#00a8e8]/15 blur-[135px]" />

      <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="liquid-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="#7dd3fc" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#liquid-grid)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Live Date & Time Widget (Sidebar & Mobile)
   ═══════════════════════════════════════════════════════════════ */
function LiveDateTime({ compact = false }: { compact?: boolean }) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeStr) return null;

  if (compact) {
    return (
      <div
        className="liquid-pill flex flex-col items-center justify-center rounded-xl p-1.5 text-center select-none"
        title={`${dateStr} • ${timeStr}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8] mb-1" />
        <span className="font-mono text-[9px] font-bold text-sky-200 leading-none tabular-nums">
          {timeStr.split(" ")[0]}
        </span>
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
          {timeStr.split(" ")[1]}
        </span>
      </div>
    );
  }

  return (
    <div className="liquid-glass flex items-center justify-between rounded-xl px-3 py-2 border-white/10 text-xs shadow-inner">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] shrink-0" />
        <span className="font-semibold text-slate-300 truncate text-[11px]">{dateStr}</span>
      </div>
      <span className="font-mono font-bold text-sky-200 text-xs shrink-0 tabular-nums">{timeStr}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Fitness Goal Interactive Selector Card
   ═══════════════════════════════════════════════════════════════ */
const GOAL_OPTIONS = [
  { id: "Build Muscle", title: "Build Muscle", sub: "Hypertrophy & Mass" },
  { id: "Strength", title: "Strength & Power", sub: "Heavy Compounds" },
  { id: "Get Lean", title: "Get Lean & Cut", sub: "Fat Loss & Definition" },
  { id: "Lose Weight", title: "Lose Weight", sub: "High Calorie Burn" },
];

function FitnessGoalSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 block">
        1. Target Goal
      </label>
      <div className="grid grid-cols-2 gap-2">
        {GOAL_OPTIONS.map((g) => {
          const selected = value === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange(g.id)}
              className={`text-left p-3 rounded-2xl border card-hover-lift button-press transition-all ${
                selected
                  ? "border-sky-400/60 bg-gradient-to-r from-sky-600/30 to-cyan-600/30 shadow-md shadow-sky-500/20 ring-1 ring-sky-400/50"
                  : "liquid-glass border-white/10 hover:border-sky-400/30 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold ${selected ? "text-white" : "text-slate-200"}`}>
                  {g.title}
                </span>
                {selected && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black animate-check-pop">
                    ✓
                  </span>
                )}
              </div>
              <p className={`text-[10px] mt-0.5 ${selected ? "text-sky-200 font-medium" : "text-slate-400"}`}>
                {g.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Experience Level Interactive Selector
   ═══════════════════════════════════════════════════════════════ */
const EXPERIENCE_OPTIONS = [
  { id: "Beginner", title: "Beginner", sub: "0–1 yrs • Form Base" },
  { id: "Intermediate", title: "Intermediate", sub: "1–3 yrs • Overload" },
  { id: "Advanced", title: "Advanced", sub: "3+ yrs • High Volume" },
];

function ExperienceLevelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 block">
        2. Experience Level
      </label>
      <div className="grid grid-cols-3 gap-2">
        {EXPERIENCE_OPTIONS.map((exp) => {
          const selected = value === exp.id;
          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => onChange(exp.id)}
              className={`text-left p-2.5 rounded-2xl border card-hover-lift button-press transition-all ${
                selected
                  ? "border-cyan-400/60 bg-gradient-to-r from-sky-600/30 to-cyan-600/30 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50"
                  : "liquid-glass border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${selected ? "text-white" : "text-slate-200"}`}>
                  {exp.title}
                </span>
                {selected && (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black animate-check-pop">
                    ✓
                  </span>
                )}
              </div>
              <p className={`text-[9px] mt-0.5 line-clamp-2 ${selected ? "text-cyan-200 font-medium" : "text-slate-400"}`}>
                {exp.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Equipment Mix & Multi-Select Custom Builder
   ═══════════════════════════════════════════════════════════════ */
const EQUIPMENT_ITEMS = [
  { id: "Barbell", label: "Barbell & Plates" },
  { id: "Bodyweight", label: "Bodyweight / Calisthenics" },
  { id: "Dumbbells", label: "Dumbbells" },
  { id: "Pull-up Bar", label: "Pull-up Bar / Dips" },
  { id: "Cable Machine", label: "Cables & Pulleys" },
  { id: "Gym Machines", label: "Gym Machines" },
  { id: "Kettlebell", label: "Kettlebells" },
  { id: "Bench", label: "Adjustable Bench" },
  { id: "Squat Rack", label: "Squat / Power Rack" },
  { id: "Resistance Bands", label: "Resistance Bands" },
];

const EQUIPMENT_PRESETS = [
  { label: "Barbell + Bodyweight", items: ["Barbell", "Bodyweight", "Pull-up Bar"] },
  { label: "Dumbbells + Bodyweight", items: ["Dumbbells", "Bodyweight", "Pull-up Bar"] },
  { label: "Barbell + Dumbbells + Bodyweight", items: ["Barbell", "Dumbbells", "Bodyweight", "Pull-up Bar", "Bench"] },
  { label: "Full Commercial Gym", items: ["Barbell", "Dumbbells", "Bodyweight", "Cable Machine", "Gym Machines", "Pull-up Bar", "Bench", "Squat Rack"] },
  { label: "Bodyweight Only", items: ["Bodyweight", "Pull-up Bar"] },
];

function EquipmentMixSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Parse comma-separated value into array
  const selectedItems = useMemo(() => {
    if (!value) return [];
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }, [value]);

  function toggleItem(id: string) {
    let updated: string[];
    if (selectedItems.includes(id)) {
      updated = selectedItems.filter((item) => item !== id);
    } else {
      updated = [...selectedItems, id];
    }
    onChange(updated.join(", "));
  }

  function applyPreset(items: string[]) {
    onChange(items.join(", "));
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          3. Available Equipment (Mix & Multi-Select)
        </label>
        <span className="text-[10px] font-semibold text-cyan-300">
          {selectedItems.length > 0 ? `${selectedItems.length} selected` : "Select options"}
        </span>
      </div>

      {/* Quick Mix Presets */}
      <div>
        <p className="text-[9px] uppercase font-bold text-slate-400 mb-1.5">Quick Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {EQUIPMENT_PRESETS.map((preset) => {
            const isMatch =
              preset.items.length === selectedItems.length &&
              preset.items.every((it) => selectedItems.includes(it));
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.items)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-xl card-hover-lift button-press transition-all ${
                  isMatch
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-md shadow-cyan-500/20"
                    : "liquid-pill text-slate-300 hover:text-white hover:border-sky-400/40"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Equipment Multi-Select Chips */}
      <div>
        <p className="text-[9px] uppercase font-bold text-slate-400 mb-1.5">Customize Your Equipment Mix</p>
        <div className="grid grid-cols-2 gap-1.5">
          {EQUIPMENT_ITEMS.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold border card-hover-lift button-press transition-all ${
                  isSelected
                    ? "border-sky-400/60 bg-sky-950/40 text-white shadow-sm shadow-sky-500/20 ring-1 ring-sky-400/40"
                    : "liquid-glass border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                }`}
              >
                <span className="truncate">{item.label}</span>
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[9px] font-black transition-all ${
                    isSelected ? "bg-cyan-400 text-slate-950 animate-check-pop" : "border border-white/20 text-transparent"
                  }`}
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selection Summary */}
      {selectedItems.length > 0 && (
        <div className="liquid-glass rounded-xl px-3 py-2 border-cyan-500/20 bg-cyan-950/15 flex items-center justify-between text-xs">
          <div className="min-w-0 pr-2">
            <span className="text-[9px] uppercase font-bold text-cyan-300 block">Active Mix</span>
            <p className="font-semibold text-white truncate text-[11px]">{selectedItems.join(", ")}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-slate-400 hover:text-red-400 transition-colors shrink-0 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function SetCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`group flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border button-press transition-all duration-200 ${
        checked
          ? "border-cyan-400/90 bg-cyan-500/25 shadow-[0_0_14px_rgba(56,189,248,0.4)]"
          : "border-white/15 bg-white/[0.03] hover:border-white/30"
      }`}
    >
      {checked && (
        <svg className="h-4 w-4 text-cyan-300 animate-check-pop" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Add Exercise Component
   ═══════════════════════════════════════════════════════════════ */
function AddExerciseInline({ onAdd }: { onAdd: (ex: Exercise) => void }) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [open, setOpen] = useState(false);

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), sets: parseInt(sets) || 3, reps: reps || "10" });
    setName("");
    setSets("3");
    setReps("10");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="liquid-glass liquid-glass-interactive flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-semibold text-slate-300 transition-all hover:text-white"
      >
        <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Exercise
      </button>
    );
  }

  return (
    <div className="liquid-glass rounded-2xl p-4 animate-[fadeInUp_0.2s_ease-out_both]">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Exercise name (e.g. Incline Bench Press)…"
        className="liquid-input w-full rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex-1">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Sets</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="liquid-input mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Target Reps</label>
          <input
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="liquid-input mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!name.trim()}
          className="mt-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:from-sky-400 hover:to-cyan-400 disabled:opacity-40"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-4 rounded-xl px-3 py-2 text-xs text-slate-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Rest Timer Audio Chime (Web Audio API Synthesizer)
   ═══════════════════════════════════════════════════════════════ */
function playTimerChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Ignore audio errors if blocked
  }
}

interface ActiveRestTimerState {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  type: "set" | "exercise";
  targetExIdx?: number;
  targetSetIdx?: number;
}

/* ═══════════════════════════════════════════════════════════════
   Active Workout Tracker (with Automatic Rest Timers & Sticky HUD)
   ═══════════════════════════════════════════════════════════════ */
function ActiveWorkout({
  dayTitle,
  tracked,
  setTracked,
  onFinish,
  onBack,
  elapsedSeconds,
  unit,
  onSetUnit,
}: {
  dayTitle: string;
  tracked: TrackedExercise[];
  setTracked: React.Dispatch<React.SetStateAction<TrackedExercise[]>>;
  onFinish: () => void;
  onBack: () => void;
  elapsedSeconds: number;
  unit: "lbs" | "kg";
  onSetUnit: (u: "lbs" | "kg") => void;
}) {
  const [restTimer, setRestTimer] = useState<ActiveRestTimerState | null>(null);

  // Countdown timer interval effect
  useEffect(() => {
    if (!restTimer || !restTimer.isRunning) return;

    if (restTimer.remainingSeconds <= 0) {
      playTimerChime();
      return;
    }

    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (!prev || !prev.isRunning) return prev;
        if (prev.remainingSeconds <= 1) {
          playTimerChime();
          return { ...prev, remainingSeconds: 0, isRunning: false };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer?.isRunning, restTimer?.remainingSeconds]);

  const startRestTimer = useCallback(
    (id: string, label: string, seconds: number, type: "set" | "exercise", targetExIdx?: number, targetSetIdx?: number) => {
      setRestTimer({
        id,
        label,
        totalSeconds: seconds,
        remainingSeconds: seconds,
        isRunning: true,
        type,
        targetExIdx,
        targetSetIdx,
      });
    },
    []
  );

  const adjustRestTimer = useCallback((deltaSeconds: number) => {
    setRestTimer((prev) => {
      if (!prev) return null;
      const nextRemaining = Math.max(0, prev.remainingSeconds + deltaSeconds);
      const nextTotal = Math.max(nextRemaining, prev.totalSeconds + (deltaSeconds > 0 ? deltaSeconds : 0));
      return {
        ...prev,
        remainingSeconds: nextRemaining,
        totalSeconds: nextTotal,
        isRunning: nextRemaining > 0 ? true : false,
      };
    });
  }, []);

  const toggleRestTimerPause = useCallback(() => {
    setRestTimer((prev) => (prev ? { ...prev, isRunning: !prev.isRunning } : null));
  }, []);

  const stopRestTimer = useCallback(() => {
    setRestTimer(null);
  }, []);

  const totalSets = tracked.reduce((sum, ex) => sum + ex.trackedSets.length, 0);
  const completedSets = tracked.reduce((sum, ex) => sum + ex.trackedSets.filter((s) => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const updateSet = useCallback(
    (exIdx: number, setIdx: number, field: keyof TrackedSet, value: string | boolean) => {
      setTracked((prev) =>
        prev.map((ex, ei) =>
          ei !== exIdx
            ? ex
            : {
                ...ex,
                trackedSets: ex.trackedSets.map((s, si) =>
                  si !== setIdx ? s : { ...s, [field]: value }
                ),
              }
        )
      );
    },
    [setTracked]
  );

  const addSetToExercise = useCallback((exIdx: number) => {
    setTracked((prev) =>
      prev.map((ex, ei) => {
        if (ei !== exIdx) return ex;
        const lastSet = ex.trackedSets[ex.trackedSets.length - 1];
        const newSet: TrackedSet = {
          targetReps: lastSet?.targetReps || "10",
          weight: lastSet?.weight || "",
          actualReps: "",
          completed: false,
        };
        return {
          ...ex,
          trackedSets: [...ex.trackedSets, newSet],
        };
      })
    );
  }, [setTracked]);

  const removeSetFromExercise = useCallback((exIdx: number, setIdx: number) => {
    setTracked((prev) =>
      prev.map((ex, ei) => {
        if (ei !== exIdx) return ex;
        if (ex.trackedSets.length <= 1) return ex; // Keep at least 1 set
        return {
          ...ex,
          trackedSets: ex.trackedSets.filter((_, si) => si !== setIdx),
        };
      })
    );
  }, [setTracked]);

  const removeExercise = useCallback((exIdx: number) => {
    setTracked((prev) => prev.filter((_, i) => i !== exIdx));
  }, [setTracked]);

  const addExercise = useCallback((ex: Exercise) => {
    const newTracked: TrackedExercise = {
      name: ex.name,
      trackedSets: Array.from({ length: ex.sets }, () => ({
        targetReps: ex.reps,
        weight: "",
        actualReps: "",
        completed: false,
      })),
    };
    setTracked((prev) => [...prev, newTracked]);
  }, [setTracked]);

  function handleToggleSetDone(exIdx: number, si: number) {
    const currentCompleted = tracked[exIdx].trackedSets[si].completed;
    const isNowDone = !currentCompleted;
    updateSet(exIdx, si, "completed", isNowDone);

    if (isNowDone) {
      // Check if this completes all sets of the exercise
      const allOtherSetsDone = tracked[exIdx].trackedSets.every((s, idx) =>
        idx === si ? true : s.completed
      );
      const hasNextExercise = exIdx < tracked.length - 1;

      if (allOtherSetsDone && hasNextExercise) {
        const nextExName = tracked[exIdx + 1].name;
        startRestTimer(
          `inter-ex-${exIdx}`,
          `Rest before ${nextExName}`,
          120, // 2 minutes between exercises
          "exercise",
          exIdx + 1
        );
      } else {
        startRestTimer(
          `set-rest-${exIdx}-${si}`,
          `${tracked[exIdx].name} • Set ${si + 1} Rest`,
          60, // 60s default rest
          "set",
          exIdx,
          si
        );
      }
    } else {
      // If unchecking, stop active timer if related
      if (restTimer?.id === `set-rest-${exIdx}-${si}`) {
        stopRestTimer();
      }
    }
  }

  const restPercent = restTimer && restTimer.totalSeconds > 0
    ? Math.min(100, Math.max(0, ((restTimer.totalSeconds - restTimer.remainingSeconds) / restTimer.totalSeconds) * 100))
    : 0;

  return (
    <div className="animate-[fadeInUp_0.3s_ease-out_both] space-y-4">
      {/* ── Sticky Top Metrics & Workout Status Bar ── */}
      <div className="liquid-glass sticky top-16 z-40 rounded-2xl p-4 border-white/10 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:border-sky-400/40 transition-all button-press shrink-0"
              title="Return to Dashboard"
            >
              <svg className="h-4 w-4 text-sky-400 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              <span>Back</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">Active Session</p>
              </div>
              <h2 className="truncate text-base font-extrabold tracking-tight text-white mt-0.5">{dayTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <UnitTogglePill unit={unit} onChange={onSetUnit} size="sm" />
            <div className="text-right">
              <p className="font-mono text-base font-bold tabular-nums text-slate-100">{formatTime(elapsedSeconds)}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Duration</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-slate-100">
                {completedSets}
                <span className="text-xs font-normal text-slate-500">/{totalSets}</span>
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Sets</p>
            </div>
          </div>
        </div>

        {/* Workout Progress Bar */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-teal-300 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Active Rest Timer Floating Banner (When running) ── */}
        {restTimer && (
          <div className="mt-3 pt-3 border-t border-white/[0.08] animate-fade-in">
            <div className={`liquid-glass rounded-xl p-3 border transition-all ${
              restTimer.remainingSeconds === 0
                ? "border-emerald-400/80 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-subtle-pulse"
                : "border-cyan-400/50 bg-cyan-950/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    restTimer.remainingSeconds === 0
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-cyan-500/20 text-cyan-300 animate-pulse"
                  }`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {restTimer.type === "exercise" ? "Inter-Exercise Recovery" : "Set Rest Timer"}
                    </p>
                    <p className="text-xs font-extrabold text-white truncate">{restTimer.label}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  {/* Digital Clock Display */}
                  <span className={`font-mono text-lg sm:text-xl font-black tabular-nums ${
                    restTimer.remainingSeconds === 0 ? "text-emerald-300" : "text-cyan-300"
                  }`}>
                    {formatTime(restTimer.remainingSeconds)}
                  </span>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => adjustRestTimer(15)}
                      className="liquid-pill px-2 py-1 text-[10px] font-bold text-sky-300 hover:text-white rounded-lg button-press"
                      title="Add 15 seconds"
                    >
                      +15s
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustRestTimer(30)}
                      className="liquid-pill px-2 py-1 text-[10px] font-bold text-sky-300 hover:text-white rounded-lg button-press"
                      title="Add 30 seconds"
                    >
                      +30s
                    </button>
                    <button
                      type="button"
                      onClick={toggleRestTimerPause}
                      className="liquid-pill px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg button-press"
                    >
                      {restTimer.isRunning ? "Pause" : "Resume"}
                    </button>
                    <button
                      type="button"
                      onClick={stopRestTimer}
                      className="liquid-pill px-2.5 py-1 text-[10px] font-bold text-red-300 hover:text-red-100 rounded-lg button-press"
                    >
                      {restTimer.remainingSeconds === 0 ? "Dismiss" : "Skip"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mini Rest Progress Bar */}
              <div className="mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    restTimer.remainingSeconds === 0
                      ? "bg-emerald-400"
                      : "bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300"
                  }`}
                  style={{ width: `${restPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Exercises List with Centered Per-Set Rest & Inter-Exercise Rest ── */}
      <div className="space-y-5">
        {tracked.map((ex, exIdx) => {
          const exDone = ex.trackedSets.length > 0 && ex.trackedSets.every((s) => s.completed);
          const isNextExerciseAvailable = exIdx < tracked.length - 1;

          return (
            <div key={exIdx} className="space-y-3.5">
              {/* Exercise Card */}
              <div
                className={`liquid-glass overflow-hidden rounded-3xl border transition-all duration-300 ${
                  exDone
                    ? "border-cyan-500/50 bg-cyan-950/15 shadow-lg shadow-cyan-500/5"
                    : "border-white/10"
                }`}
              >
                {/* Exercise Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 sm:px-5 py-3.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        exDone
                          ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.3)] animate-check-pop"
                          : "bg-sky-500/15 text-sky-300"
                      }`}
                    >
                      {exDone ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      ) : (
                        exIdx + 1
                      )}
                    </span>
                    <h3 className={`truncate text-sm font-extrabold ${exDone ? "text-cyan-200" : "text-white"}`}>
                      {ex.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="liquid-pill rounded-lg px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                      {ex.trackedSets.filter((s) => s.completed).length}/{ex.trackedSets.length} sets
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExercise(exIdx)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Remove Exercise"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="divide-y divide-white/[0.04]">
                  <div className="grid grid-cols-[38px_1fr_1fr_36px] items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <span>Set</span>
                    <span>Weight ({unit})</span>
                    <span>Reps</span>
                    <span className="text-center">Done</span>
                  </div>

                  {ex.trackedSets.map((set, si) => (
                    <div key={si} className="transition-colors">
                      <div
                        className={`grid grid-cols-[38px_1fr_1fr_36px] items-center gap-2 px-4 py-2.5 transition-colors ${
                          set.completed ? "bg-cyan-500/[0.06]" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-bold tabular-nums ${set.completed ? "text-cyan-300" : "text-slate-400"}`}>
                            {si + 1}
                          </span>
                          {ex.trackedSets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSetFromExercise(exIdx, si)}
                              className="text-slate-600 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity text-[9px] p-0.5"
                              title="Delete this set"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="—"
                          value={set.weight}
                          onChange={(e) => updateSet(exIdx, si, "weight", e.target.value)}
                          className={`liquid-input w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-all focus:outline-none ${
                            set.completed ? "text-cyan-200 border-cyan-500/40" : "text-white"
                          }`}
                        />

                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder={set.targetReps}
                          value={set.actualReps}
                          onChange={(e) => updateSet(exIdx, si, "actualReps", e.target.value)}
                          className={`liquid-input w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-all focus:outline-none ${
                            set.completed ? "text-cyan-200 border-cyan-500/40" : "text-white"
                          }`}
                        />

                        <div className="flex justify-center">
                          <SetCheckbox
                            checked={set.completed}
                            onChange={() => handleToggleSetDone(exIdx, si)}
                          />
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── Bottom of Exercise Card: + Add Another Set Button ── */}
                  <div className="p-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => addSetToExercise(exIdx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sky-300 hover:text-white text-xs font-bold transition-all button-press active:scale-95"
                    >
                      <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span>+ Add Another Set</span>
                    </button>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {ex.trackedSets.length} sets planned
                    </span>
                  </div>
                </div>

                {/* ── Minimal Inter-Exercise Divider ── */}
                {isNextExerciseAvailable && (
                  <div className="flex items-center justify-center gap-3 py-1 text-slate-500">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Next Movement: <span className="text-sky-300">{tracked[exIdx + 1].name}</span>
                    </span>
                    <span className="h-px flex-1 bg-white/[0.06]" />
                  </div>
                )}
              </div>
            );
          })}

        <AddExerciseInline onAdd={addExercise} />
      </div>

      {/* ── Complete Workout Button ── */}
      <div className="sticky bottom-0 z-40 pt-2 pb-4">
        <div className="liquid-glass rounded-2xl p-2.5 shadow-2xl">
          <button
            type="button"
            onClick={onFinish}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 px-5 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:from-cyan-400 hover:to-teal-300 active:scale-[0.98] button-press"
            style={{ animation: "success-glow 3s ease-in-out infinite" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>Complete Workout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Workout Summary Modal (Ocean Theme)
   ═══════════════════════════════════════════════════════════════ */
function WorkoutSummary({
  dayTitle,
  trackedExercises,
  elapsedSeconds,
  onClose,
}: {
  dayTitle: string;
  trackedExercises: TrackedExercise[];
  elapsedSeconds: number;
  onClose: () => void;
}) {
  const completedSets = trackedExercises.flatMap((ex) => ex.trackedSets).filter((s) => s.completed);
  const totalVolume = completedSets.reduce((sum, s) => {
    const w = parseFloat(s.weight) || 0;
    const r = parseInt(s.actualReps) || parseInt(s.targetReps) || 0;
    return sum + w * r;
  }, 0);
  const estimatedCalories = Math.round(totalVolume * 0.05 + elapsedSeconds * 0.12);

  const stats = [
    {
      label: "Duration",
      value: formatTimeLong(elapsedSeconds),
      icon: (
        <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: "Sets Finished",
      value: `${completedSets.length}`,
      icon: (
        <svg className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: "Total Volume",
      value: `${totalVolume.toLocaleString()} lbs`,
      icon: (
        <svg className="h-5 w-5 text-teal-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-.75m0-10.5v10.5m0-10.5H4.5a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h2.25m10.5-10.5h-.75a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h.75m0-10.5v10.5m0-10.5h2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-2.25M12 6v12" />
        </svg>
      ),
    },
    {
      label: "Est. Energy",
      value: `${estimatedCalories} kcal`,
      icon: (
        <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.25s ease-out" }}>
      <div className="absolute inset-0 bg-[#020713]/85 backdrop-blur-md" onClick={onClose} />
      <div
        className="liquid-glass relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8"
        style={{ animation: "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="text-center pt-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 shadow-[0_0_25px_rgba(56,189,248,0.25)] border border-cyan-500/30">
            <svg className="h-7 w-7 text-cyan-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Workout Complete</h2>
          <p className="mt-1 text-xs text-slate-400">{dayTitle}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          {stats.map((s, i) => (
            <div key={i} className="liquid-glass card-hover-lift shimmer-hover rounded-2xl p-3.5 text-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] mb-1.5">
                {s.icon}
              </div>
              <p className="text-lg font-bold tracking-tight text-white">{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Exercise Summary</h3>
          <div className="space-y-1.5">
            {trackedExercises.map((ex, i) => {
              const done = ex.trackedSets.filter((s) => s.completed).length;
              return (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <span className={done > 0 ? "text-slate-200 font-medium" : "text-slate-500 line-through"}>
                    {ex.name}
                  </span>
                  <span className={`font-mono font-bold ${done === ex.trackedSets.length ? "text-cyan-300" : "text-slate-400"}`}>
                    {done}/{ex.trackedSets.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-500/20 bg-sky-950/20 p-5 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <h3 className="text-sm font-bold tracking-tight text-white">Support Development</h3>
          </div>
          <div className="mx-auto mt-3.5 w-44 overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <Image src="/qr-code.jpg" alt="QR code for donations" width={176} height={176} className="h-auto w-full" />
          </div>
          <p className="mt-2.5 text-[11px] text-slate-400">Scan with GCash, Maya, or any bank app to support!</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 py-3 text-xs font-bold text-white shadow-xl transition-all hover:from-sky-400 hover:to-teal-300 active:scale-[0.98] button-press shimmer-hover animate-gradient-flow"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Donation / Tip Jar Modal
   ═══════════════════════════════════════════════════════════════ */
function TipJarModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.25s ease-out" }}>
      <div className="absolute inset-0 bg-[#020713]/85 backdrop-blur-md" onClick={onClose} />
      <div
        className="liquid-glass relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl p-6 shadow-2xl text-center"
        style={{ animation: "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>

        <h3 className="text-base font-extrabold text-white">Support Forma.AI</h3>
        <p className="text-xs text-slate-400 mt-1">If this workout studio helps your fitness journey, consider supporting the developers!</p>

        <div className="mx-auto mt-4 w-44 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <Image src="/qr-code.jpg" alt="QR code for donations" width={176} height={176} className="h-auto w-full" />
        </div>
        <p className="mt-2.5 text-[11px] text-slate-400">Scan with GCash, Maya, or banking app</p>

        <button
          type="button"
          onClick={onClose}
          className="liquid-glass liquid-glass-interactive mt-5 w-full rounded-xl py-2.5 text-xs font-bold text-white hover:border-sky-400/40"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Create Template Modal
   ═══════════════════════════════════════════════════════════════ */
function CreateTemplateModal({
  onSave,
  onClose,
}: {
  onSave: (t: WorkoutTemplate) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Custom");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  function addEx(ex: Exercise) {
    setExercises((prev) => [...prev, ex]);
  }
  function removeEx(idx: number) {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (!name.trim() || exercises.length === 0) return;
    onSave({
      id: uid(),
      name: name.trim(),
      category: category.trim() || "Custom",
      exercises,
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
      <div className="absolute inset-0 bg-[#020713]/80 backdrop-blur-md" onClick={onClose} />
      <div
        className="liquid-glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-2xl"
        style={{ animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
        
        <h2 className="text-lg font-bold tracking-tight text-white">Create Routine Template</h2>
        <p className="mt-0.5 text-xs text-slate-400">Save custom workouts for quick one-tap start</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Routine Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Upper Body Focus"
              className="liquid-input mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Category Tag</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Hypertrophy / Strength"
              className="liquid-input mt-1 w-full rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Exercises ({exercises.length})</label>
          {exercises.map((ex, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs">
              <span className="font-semibold text-white">{ex.name}</span>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="font-mono font-semibold">{ex.sets} × {ex.reps}</span>
                <button type="button" onClick={() => removeEx(i)} className="text-red-400/60 hover:text-red-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <AddExerciseInline onAdd={addEx} />
        </div>

        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="liquid-glass flex-1 rounded-xl py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || exercises.length === 0}
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:from-sky-400 hover:to-cyan-400 disabled:opacity-40"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Log Metric Entry Modal
   ═══════════════════════════════════════════════════════════════ */
function LogMetricModal({
  onSave,
  onClose,
}: {
  onSave: (entry: MetricEntry) => void;
  onClose: () => void;
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [calories, setCalories] = useState("");

  function handleSave() {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    const bf = parseFloat(bodyFat) || 0;
    const cal = parseInt(calories) || 0;
    const weightInLbs = unit === "kg" ? Math.round(w * 2.20462 * 10) / 10 : w;

    onSave({
      id: uid(),
      date,
      weight: weightInLbs,
      bodyFat: bf,
      calories: cal,
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
      <div className="absolute inset-0 bg-[#020713]/80 backdrop-blur-md" onClick={onClose} />
      <div
        className="liquid-glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-2xl"
        style={{ animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <h2 className="text-lg font-bold tracking-tight text-white">Log Body & Diet Metrics</h2>
        <p className="mt-0.5 text-xs text-slate-400">Record your current progress metrics</p>

        <div className="mt-4 space-y-3.5">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="liquid-input mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Body Weight ({unit}) *
              </label>
              <div className="liquid-pill flex rounded-lg p-0.5 border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    if (unit === "kg" && weight) {
                      const num = parseFloat(weight);
                      if (!isNaN(num)) setWeight((num * 2.20462).toFixed(1));
                    }
                    setUnit("lbs");
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                    unit === "lbs" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  lbs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (unit === "lbs" && weight) {
                      const num = parseFloat(weight);
                      if (!isNaN(num)) setWeight((num / 2.20462).toFixed(1));
                    }
                    setUnit("kg");
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                    unit === "kg" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
            <input
              type="number"
              step="0.1"
              placeholder={unit === "lbs" ? "e.g. 172.5" : "e.g. 78.2"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="liquid-input mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 15.2"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="liquid-input mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Calories (kcal)</label>
              <input
                type="number"
                placeholder="e.g. 2350"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="liquid-input mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="liquid-glass flex-1 rounded-xl py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!weight}
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:from-sky-400 hover:to-cyan-400 disabled:opacity-40"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Interactive SVG Chart Component (Ocean Colors)
   ═══════════════════════════════════════════════════════════════ */
type TimelineFilter = "days" | "months";
type ActiveMetricType = "weight" | "bodyFat" | "calories";

function MetricsChart({
  metrics,
  activeMetric,
  timelineFilter,
}: {
  metrics: MetricEntry[];
  activeMetric: ActiveMetricType;
  timelineFilter: TimelineFilter;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (metrics.length === 0) return [];
    const sorted = [...metrics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (timelineFilter === "days") {
      const slice = sorted.slice(-14);
      return slice.map((m) => ({
        label: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: m.date,
        val: activeMetric === "weight" ? m.weight : activeMetric === "bodyFat" ? m.bodyFat : m.calories,
      }));
    } else {
      const monthlyMap = new Map<string, { total: number; count: number; dateStr: string }>();
      sorted.forEach((m) => {
        const d = new Date(m.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const val = activeMetric === "weight" ? m.weight : activeMetric === "bodyFat" ? m.bodyFat : m.calories;
        const current = monthlyMap.get(key) || { total: 0, count: 0, dateStr: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }) };
        monthlyMap.set(key, { total: current.total + val, count: current.count + 1, dateStr: current.dateStr });
      });

      return Array.from(monthlyMap.entries()).map(([, data]) => ({
        label: data.dateStr,
        fullDate: data.dateStr,
        val: Math.round((data.total / data.count) * 10) / 10,
      }));
    }
  }, [metrics, activeMetric, timelineFilter]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-slate-500">
        No metric data available to display.
      </div>
    );
  }

  const values = chartData.map((d) => d.val);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;
  const padding = range * 0.15;
  const chartMin = Math.max(0, Math.floor(minVal - padding));
  const chartMax = Math.ceil(maxVal + padding);

  const width = 640;
  const height = 220;
  const topPad = 25;
  const bottomPad = 35;
  const leftPad = 45;
  const rightPad = 25;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;

  const points = chartData.map((d, i) => {
    const x = leftPad + (plotWidth / (chartData.length - 1 || 1)) * i;
    const normalizedY = (d.val - chartMin) / ((chartMax - chartMin) || 1);
    const y = topPad + plotHeight - normalizedY * plotHeight;
    return { x, y, data: d };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${topPad + plotHeight} L ${points[0].x} ${topPad + plotHeight} Z`;

  const metricConfig = {
    weight: { unit: "lbs", color: "#00a8e8", gradId: "weightGrad", stroke: "url(#oceanLineGrad)" },
    bodyFat: { unit: "%", color: "#2dd4bf", gradId: "bfGrad", stroke: "url(#seafoamLineGrad)" },
    calories: { unit: "kcal", color: "#38bdf8", gradId: "calGrad", stroke: "url(#skyLineGrad)" },
  }[activeMetric];

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a8e8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00a8e8" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="oceanLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0074b7" />
            <stop offset="100%" stopColor="#48cae4" />
          </linearGradient>
          <linearGradient id="seafoamLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
          <linearGradient id="skyLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#90e0ef" />
          </linearGradient>
        </defs>

        {[0, 0.33, 0.66, 1].map((ratio, idx) => {
          const y = topPad + plotHeight * (1 - ratio);
          const valLabel = Math.round(chartMin + (chartMax - chartMin) * ratio);
          return (
            <g key={idx}>
              <line
                x1={leftPad}
                y1={y}
                x2={width - rightPad}
                y2={y}
                stroke="rgba(144, 224, 239, 0.1)"
                strokeDasharray="3 3"
              />
              <text
                x={leftPad - 8}
                y={y + 3}
                fill="rgba(144, 224, 239, 0.6)"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
              >
                {valLabel}
              </text>
            </g>
          );
        })}

        <path d={areaD} fill={`url(#${metricConfig.gradId})`} />

        <path
          d={pathD}
          fill="none"
          stroke={metricConfig.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 10px ${metricConfig.color})` }}
        />

        {points.map((pt, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

              {isHovered && (
                <line
                  x1={pt.x}
                  y1={topPad}
                  x2={pt.x}
                  y2={topPad + plotHeight}
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeDasharray="2 2"
                />
              )}

              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "6" : "3.5"}
                fill="#040e20"
                stroke={metricConfig.color}
                strokeWidth={isHovered ? "3" : "2"}
                className="transition-all duration-150"
              />

              <text
                x={pt.x}
                y={height - 10}
                fill={isHovered ? "#ffffff" : "rgba(148, 163, 184, 0.75)"}
                fontSize={isHovered ? "10" : "8.5"}
                fontWeight={isHovered ? "bold" : "normal"}
                textAnchor="middle"
                className="transition-all"
              >
                {pt.data.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          className="liquid-pill absolute pointer-events-none rounded-xl px-3 py-1.5 shadow-2xl z-20 transition-transform duration-75 text-center"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 35}%`,
            transform: "translate(-50%, -100%)",
            border: `1px solid ${metricConfig.color}50`,
          }}
        >
          <p className="text-[10px] font-bold text-slate-400">{points[hoveredIdx].data.fullDate}</p>
          <p className="text-xs font-black text-white">
            {points[hoveredIdx].data.val} <span className="text-[10px] font-normal text-sky-200">{metricConfig.unit}</span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BMI Calculator Component (Independent Height & Weight Unit Selection)
   ═══════════════════════════════════════════════════════════════ */
function BmiCalculator() {
  const [heightUnit, setHeightUnit] = useState<"ft_in" | "cm">("ft_in");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");

  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(10);
  const [heightCm, setHeightCm] = useState(178);

  const [weightLbs, setWeightLbs] = useState(170);
  const [weightKg, setWeightKg] = useState(77);

  // Bidirectional Height Unit Switch Handler
  function handleHeightUnitChange(nextUnit: "ft_in" | "cm") {
    if (nextUnit === heightUnit) return;
    if (nextUnit === "cm") {
      const totalIn = feet * 12 + inches;
      const convertedCm = Math.round(totalIn * 2.54);
      setHeightCm(Math.max(100, Math.min(240, convertedCm)));
    } else {
      const totalIn = Math.round(heightCm / 2.54);
      const f = Math.floor(totalIn / 12);
      const i = totalIn % 12;
      setFeet(Math.max(3, Math.min(7, f)));
      setInches(Math.max(0, Math.min(11, i)));
    }
    setHeightUnit(nextUnit);
  }

  // Bidirectional Weight Unit Switch Handler
  function handleWeightUnitChange(nextUnit: "lbs" | "kg") {
    if (nextUnit === weightUnit) return;
    if (nextUnit === "kg") {
      const convertedKg = Math.round((weightLbs / 2.20462) * 10) / 10;
      setWeightKg(Math.max(30, Math.min(200, convertedKg)));
    } else {
      const convertedLbs = Math.round(weightKg * 2.20462);
      setWeightLbs(Math.max(60, Math.min(450, convertedLbs)));
    }
    setWeightUnit(nextUnit);
  }

  function applyPreset(hUnit: "ft_in" | "cm", wUnit: "lbs" | "kg") {
    handleHeightUnitChange(hUnit);
    handleWeightUnitChange(wUnit);
  }

  const { bmi, category, color, idealRange, progressRatio } = useMemo(() => {
    // Height in meters
    let heightM = 0;
    if (heightUnit === "ft_in") {
      const totalInches = feet * 12 + inches;
      heightM = (totalInches * 2.54) / 100;
    } else {
      heightM = heightCm / 100;
    }

    // Weight in kg
    let weightInKg = 0;
    if (weightUnit === "lbs") {
      weightInKg = weightLbs * 0.45359237;
    } else {
      weightInKg = weightKg;
    }

    let bmiVal = 0;
    let idealMin = 0;
    let idealMax = 0;
    const unitLabel = weightUnit;

    if (heightM > 0) {
      bmiVal = weightInKg / (heightM * heightM);
      const idealMinKg = 18.5 * (heightM * heightM);
      const idealMaxKg = 24.9 * (heightM * heightM);

      if (weightUnit === "lbs") {
        idealMin = Math.round(idealMinKg * 2.20462);
        idealMax = Math.round(idealMaxKg * 2.20462);
      } else {
        idealMin = Math.round(idealMinKg * 10) / 10;
        idealMax = Math.round(idealMaxKg * 10) / 10;
      }
    }

    const roundedBmi = Math.round(bmiVal * 10) / 10;

    let cat = "Normal weight";
    let col = "text-teal-300 border-teal-500/30 bg-teal-500/10";
    let ratio = 0.4;

    if (roundedBmi < 18.5) {
      cat = "Underweight";
      col = "text-sky-300 border-sky-500/30 bg-sky-500/10";
      ratio = Math.max(0.05, ((roundedBmi - 12) / (18.5 - 12)) * 0.25);
    } else if (roundedBmi < 25) {
      cat = "Healthy / Normal";
      col = "text-cyan-300 border-cyan-500/30 bg-cyan-500/10";
      ratio = 0.25 + ((roundedBmi - 18.5) / (25 - 18.5)) * 0.35;
    } else if (roundedBmi < 30) {
      cat = "Overweight";
      col = "text-amber-300 border-amber-500/30 bg-amber-500/10";
      ratio = 0.6 + ((roundedBmi - 25) / (30 - 25)) * 0.25;
    } else {
      cat = "Obese";
      col = "text-rose-300 border-rose-500/30 bg-rose-500/10";
      ratio = Math.min(0.98, 0.85 + ((roundedBmi - 30) / (40 - 30)) * 0.15);
    }

    return {
      bmi: roundedBmi,
      category: cat,
      color: col,
      idealRange: `${idealMin} – ${idealMax} ${unitLabel}`,
      progressRatio: Math.min(Math.max(ratio, 0.03), 0.97),
    };
  }, [heightUnit, weightUnit, feet, inches, heightCm, weightLbs, weightKg]);

  return (
    <div className="liquid-glass rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Card Header & Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="liquid-pill flex h-7 w-7 items-center justify-center rounded-xl text-sky-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-white">Body Mass Index (BMI)</h3>
            <p className="text-[10px] text-slate-400">Mix & match height & weight units freely</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="liquid-pill flex items-center rounded-xl p-0.5 border-white/10 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => applyPreset("ft_in", "lbs")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all button-press ${
              heightUnit === "ft_in" && weightUnit === "lbs"
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Imperial (ft + lbs)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("ft_in", "kg")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all button-press ${
              heightUnit === "ft_in" && weightUnit === "kg"
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mixed (ft + kg)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("cm", "kg")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all button-press ${
              heightUnit === "cm" && weightUnit === "kg"
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Metric (cm + kg)
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* ── 1. Height Controls ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Height</span>
              <span className="font-mono text-xs font-black text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                {heightUnit === "ft_in" ? `${feet} ft ${inches} in` : `${heightCm} cm`}
              </span>
            </div>

            {/* Height Unit Segmented Toggle */}
            <div className="liquid-pill flex rounded-lg p-0.5 border-white/10">
              <button
                type="button"
                onClick={() => handleHeightUnitChange("ft_in")}
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md transition-all button-press ${
                  heightUnit === "ft_in" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                ft / in
              </button>
              <button
                type="button"
                onClick={() => handleHeightUnitChange("cm")}
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md transition-all button-press ${
                  heightUnit === "cm" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                cm
              </button>
            </div>
          </div>

          {heightUnit === "ft_in" ? (
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Feet</span>
                  <span className="text-white font-mono">{feet} ft</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={7}
                  value={feet}
                  onChange={(e) => setFeet(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Inches</span>
                  <span className="text-white font-mono">{inches} in</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={11}
                  value={inches}
                  onChange={(e) => setInches(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Centimeters</span>
                <span className="text-white font-mono">{heightCm} cm</span>
              </div>
              <input
                type="range"
                min={100}
                max={240}
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* ── 2. Weight Controls ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Weight</span>
              <span className="font-mono text-xs font-black text-sky-300 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20">
                {weightUnit === "lbs" ? `${weightLbs} lbs` : `${weightKg} kg`}
              </span>
            </div>

            {/* Weight Unit Segmented Toggle */}
            <div className="liquid-pill flex rounded-lg p-0.5 border-white/10">
              <button
                type="button"
                onClick={() => handleWeightUnitChange("lbs")}
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md transition-all button-press ${
                  weightUnit === "lbs" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => handleWeightUnitChange("kg")}
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md transition-all button-press ${
                  weightUnit === "kg" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                kg
              </button>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{weightUnit === "lbs" ? "Pounds (lbs)" : "Kilograms (kg)"}</span>
              <span className="text-white font-mono">{weightUnit === "lbs" ? `${weightLbs} lbs` : `${weightKg} kg`}</span>
            </div>
            {weightUnit === "lbs" ? (
              <input
                type="range"
                min={60}
                max={450}
                value={weightLbs}
                onChange={(e) => setWeightLbs(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            ) : (
              <input
                type="range"
                min={30}
                max={200}
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Calculated BMI Score Card ── */}
      <div className="liquid-glass rounded-2xl p-4.5 border-white/10 space-y-3.5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calculated Score</p>
            <p className="text-3xl font-black tracking-tight text-white mt-0.5">{bmi}</p>
          </div>
          <div className="text-right">
            <span className={`liquid-pill inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${color}`}>
              {category}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Ideal: {idealRange}</p>
          </div>
        </div>

        <div className="relative pt-2">
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-sky-400 via-teal-300 via-amber-300 to-rose-400" />
          <div
            className="absolute top-0 h-4 w-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] transition-all duration-300 -translate-x-1/2"
            style={{ left: `${progressRatio * 100}%` }}
          />
          <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-slate-500 mt-1.5">
            <span>Under (&lt;18.5)</span>
            <span>Healthy (18.5-24.9)</span>
            <span>Over (25-29.9)</span>
            <span>Obese (30+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Barbell / Dumbbell Plate Calculator & Input Module
   ═══════════════════════════════════════════════════════════════ */
function WeightAndPlateCalculator({
  category,
  defaultBarWeightLbs,
  unit,
  onSetUnit,
  onLogSet,
}: {
  category: EquipmentCategory;
  defaultBarWeightLbs: number;
  unit: "lbs" | "kg";
  onSetUnit: (u: "lbs" | "kg") => void;
  onLogSet: (weight: number, reps: number) => void;
}) {
  const [barWeight, setBarWeight] = useState(defaultBarWeightLbs || (unit === "kg" ? 20 : 45));
  const [targetWeight, setTargetWeight] = useState(unit === "kg" ? 60 : 135);
  const [repsInput, setRepsInput] = useState(10);

  useEffect(() => {
    if (unit === "kg") {
      setBarWeight((bw) => (bw === 45 ? 20 : bw === 35 ? 15 : bw === 25 ? 10 : 20));
      setTargetWeight((tw) => (tw > 100 ? Math.round(tw * 0.453592 * 2) / 2 : tw));
    } else {
      setBarWeight((bw) => (bw === 20 ? 45 : bw === 15 ? 35 : bw === 10 ? 25 : 45));
      setTargetWeight((tw) => (tw < 100 ? Math.round(tw * 2.20462 * 2) / 2 : tw));
    }
  }, [unit]);

  const isBarbell = category === "Barbell";
  const isDumbbell = category === "Dumbbell";

  const plateBreakdown = useMemo(() => {
    if (!isBarbell) return [];
    const availablePlates = unit === "lbs" ? [45, 35, 25, 10, 5, 2.5] : [25, 20, 15, 10, 5, 2.5, 1.25];
    let remainingPerSide = Math.max(0, (targetWeight - barWeight) / 2);
    const result: { plate: number; count: number }[] = [];

    for (const plate of availablePlates) {
      if (remainingPerSide >= plate) {
        const count = Math.floor(remainingPerSide / plate);
        result.push({ plate, count });
        remainingPerSide -= count * plate;
      }
    }
    return result;
  }, [isBarbell, targetWeight, barWeight, unit]);

  return (
    <div className="liquid-glass rounded-2xl p-4.5 border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="liquid-pill flex h-6 w-6 items-center justify-center rounded-lg text-sky-300">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97ZM5.25 4.97c-.122.499.106 1.028.589 1.202.628.226 1.305.352 2.031.352.726 0 1.403-.126 2.031-.352.483-.174.711-.703.59-1.202L7.87 4.97M5.25 4.97c-1.01.143-2.01.317-3 .52m3-.52L2.63 15.696c-.122.499.106 1.028.589 1.202.628.226 1.305.352 2.031.352.726 0 1.403-.126 2.031-.352.483-.174.711-.703.59-1.202L5.25 4.97Z" />
            </svg>
          </span>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
            {isBarbell ? "Barbell & Plate Setup" : isDumbbell ? "Dumbbell Weight Setup" : "Weight / Resistance Input"}
          </h4>
        </div>

        <UnitTogglePill unit={unit} onChange={onSetUnit} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {isDumbbell ? `Each Dumbbell (${unit.toUpperCase()})` : `Total Lift Weight (${unit.toUpperCase()})`}
          </label>
          <div className="relative mt-1">
            <input
              type="number"
              step={unit === "kg" ? "1" : "2.5"}
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
              className="liquid-input w-full rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold">{unit}</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Target Reps</label>
          <input
            type="number"
            value={repsInput}
            onChange={(e) => setRepsInput(parseInt(e.target.value) || 0)}
            className="liquid-input mt-1 w-full rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(unit === "lbs" ? [2.5, 5, 10, 25] : [1, 2.5, 5, 10]).map((inc) => (
          <button
            key={inc}
            type="button"
            onClick={() => setTargetWeight((w) => w + inc)}
            className="liquid-glass text-[10px] font-bold px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:border-sky-400/40 transition-all"
          >
            +{inc} {unit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setTargetWeight((w) => Math.max(0, w - (unit === "lbs" ? 5 : 2.5)))}
          className="liquid-glass text-[10px] font-bold px-2 py-1 rounded-lg text-slate-400 hover:text-red-300 transition-all"
        >
          -{unit === "lbs" ? 5 : 2.5} {unit}
        </button>
      </div>

      {isBarbell && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Barbell: <strong className="text-white">{barWeight} {unit}</strong></span>
            <div className="flex gap-1.5 text-[9px] font-bold">
              {(unit === "lbs" ? [45, 35, 25] : [20, 15, 10]).map((bw) => (
                <button
                  key={bw}
                  type="button"
                  onClick={() => setBarWeight(bw)}
                  className={`px-1.5 py-0.5 rounded ${barWeight === bw ? "bg-sky-600 text-white" : "text-slate-500 hover:text-white"}`}
                >
                  {bw} {unit} bar
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Each side:</span>
            {plateBreakdown.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Empty bar (no plates needed)</span>
            ) : (
              <div className="flex flex-wrap gap-1.5 items-center">
                {plateBreakdown.map((p, i) => (
                  <span
                    key={i}
                    className="liquid-pill px-2 py-0.5 text-xs font-mono font-bold text-cyan-300 border-sky-500/30"
                  >
                    {p.count} × {p.plate} {unit}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => onLogSet(targetWeight, repsInput)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:from-sky-400 hover:to-cyan-400 active:scale-[0.98]"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Log Completed Set
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Exercise Detail Modal (Ocean Serenity)
   ═══════════════════════════════════════════════════════════════ */
function ExerciseDetailModal({
  exercise,
  unit,
  onSetUnit,
  history,
  onAddHistorySet,
  onClose,
}: {
  exercise: ExerciseLibraryItem;
  unit: "lbs" | "kg";
  onSetUnit: (u: "lbs" | "kg") => void;
  history: ExerciseHistoryItem[];
  onAddHistorySet: (exId: string, weight: number, reps: number, unit: "lbs" | "kg") => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"guide" | "history" | "setup">("guide");

  function handleLogSet(weight: number, reps: number) {
    onAddHistorySet(exercise.id, weight, reps, unit);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4" style={{ animation: "fadeIn 0.25s ease-out" }}>
      <div className="absolute inset-0 bg-[#020713]/85 backdrop-blur-md" onClick={onClose} />
      <div
        className="liquid-glass relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5"
        style={{ animation: "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="liquid-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300 border-sky-500/30">
                {exercise.bodyPart}
              </span>
              <span className="liquid-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300 border-cyan-500/30">
                {exercise.category}
              </span>
              <span className="liquid-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-300 border-teal-500/30">
                {exercise.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{exercise.name}</h2>
          </div>

          <div className="flex items-center gap-3">
            <UnitTogglePill unit={unit} onChange={onSetUnit} size="md" />

            <button
              type="button"
              onClick={onClose}
              className="liquid-pill h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white"
              title="Close modal"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="liquid-pill rounded-xl p-1 flex gap-1 border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "guide" ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Video & Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("setup")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "setup" ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Weight & Plates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "history" ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            History ({history.length})
          </button>
        </div>

        {activeTab === "guide" && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${exercise.videoEmbedId}?rel=0&modestbranding=1`}
                title={`${exercise.name} Demonstration Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            <div className="liquid-glass rounded-2xl p-4 border-white/10 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Anatomy</h4>
              <div className="space-y-1 text-xs">
                <p>
                  <strong className="text-sky-300">Primary:</strong>{" "}
                  <span className="text-slate-200">{exercise.primaryMuscle}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Secondary:</strong>{" "}
                  <span className="text-slate-300">{exercise.secondaryMuscles.join(", ")}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="liquid-glass rounded-2xl p-4 border-white/10 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">1. Setup</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{exercise.instructions.setup}</p>
              </div>

              <div className="liquid-glass rounded-2xl p-4 border-white/10 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-teal-300">2. Execution</h4>
                <ol className="space-y-1.5 text-xs text-slate-200">
                  {exercise.instructions.execution.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="liquid-pill flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-cyan-300">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="liquid-glass rounded-2xl p-3.5 border-white/10 space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Pro Tips</h4>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {exercise.instructions.tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-sky-400">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="liquid-glass rounded-2xl p-3.5 border-red-500/20 bg-red-950/10 space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-300">Avoid</h4>
                  <ul className="space-y-1 text-[11px] text-red-200/80">
                    {exercise.instructions.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400">✕</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "setup" && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <WeightAndPlateCalculator
              category={exercise.category}
              defaultBarWeightLbs={exercise.defaultBarWeightLbs}
              unit={unit}
              onSetUnit={onSetUnit}
              onLogSet={handleLogSet}
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Recorded Sessions</h4>
              <button
                type="button"
                onClick={() => setActiveTab("setup")}
                className="text-xs font-bold text-sky-400 hover:underline"
              >
                + Log New Set
              </button>
            </div>

            {history.length === 0 ? (
              <div className="liquid-glass flex flex-col items-center justify-center rounded-2xl p-8 text-center">
                <svg className="h-8 w-8 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-sm font-bold text-white">No session history yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Use the Weight & Plates tab to record your first set.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.map((item) => (
                  <div key={item.id} className="liquid-glass rounded-2xl p-4 border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">{item.date}</span>
                      <span className="liquid-pill px-2 py-0.5 text-[10px] font-semibold text-slate-400 rounded-md">
                        {item.sets.length} sets completed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {item.sets.map((s, idx) => (
                        <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Set {s.setNum}</span>
                          <span className="text-xs font-extrabold text-white">
                            {s.weight} {item.unit} × {s.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Comprehensive A to Z Exercise Library Tab Component
   ═══════════════════════════════════════════════════════════════ */
function ExerciseLibraryTab({
  onSelectExercise,
  unit,
  onSetUnit,
  onBack,
}: {
  onSelectExercise: (ex: ExerciseLibraryItem) => void;
  unit: "lbs" | "kg";
  onSetUnit: (u: "lbs" | "kg") => void;
  onBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("All");
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const bodyParts = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
  const categories = ["All", "Barbell", "Dumbbell", "Bodyweight", "Cable", "Machine"];

  // Unique starting letters present in the library
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    EXERCISE_LIBRARY.forEach((ex) => {
      const first = ex.name[0].toUpperCase();
      if (first >= "A" && first <= "Z") letters.add(first);
    });
    return ["All", ...Array.from(letters).sort()];
  }, []);

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchSearch =
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.secondaryMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchLetter =
        selectedLetter === "All" || ex.name.toUpperCase().startsWith(selectedLetter);

      const matchBodyPart = selectedBodyPart === "All" || ex.bodyPart === selectedBodyPart;
      const matchCategory = selectedCategory === "All" || ex.category === selectedCategory;

      return matchSearch && matchLetter && matchBodyPart && matchCategory;
    });
  }, [searchQuery, selectedLetter, selectedBodyPart, selectedCategory]);

  return (
    <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out_both]">
      {/* Top Header Strip with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="liquid-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:border-sky-400/40 transition-all group shrink-0"
            title="Return to Dashboard"
          >
            <svg className="h-4 w-4 text-sky-400 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-white">Exercise Directory</h2>
            <p className="text-[11px] text-slate-400">Comprehensive guides & plate calculators (A to Z)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unit:</span>
          <UnitTogglePill unit={unit} onChange={onSetUnit} size="sm" />
        </div>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 border-white/10 space-y-4.5">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name or muscle (e.g. Bench, Squat, Deltoids, Lats)…"
            className="liquid-input w-full rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Alphabet A-Z Quick Jump Filter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Alphabetical Index (A–Z)</span>
            <span className="text-[10px] font-semibold text-sky-300">
              Showing {filteredExercises.length} of {EXERCISE_LIBRARY.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {availableLetters.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(letter)}
                className={`min-w-[28px] h-7 px-1.5 text-xs font-bold rounded-lg button-press transition-all ${
                  selectedLetter === letter
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/25"
                    : "liquid-glass text-slate-400 hover:text-white"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Body Part & Equipment Categories */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          {/* Target Body Parts */}
          <div className="flex flex-wrap gap-1">
            {bodyParts.map((bp) => (
              <button
                key={bp}
                type="button"
                onClick={() => setSelectedBodyPart(bp)}
                className={`px-3 py-1 text-xs font-bold rounded-xl button-press transition-all ${
                  selectedBodyPart === bp
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/20"
                    : "liquid-glass text-slate-400 hover:text-white"
                }`}
              >
                {bp}
              </button>
            ))}
          </div>

          {/* Equipment Types */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-xl button-press transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                    : "liquid-glass text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises Grid (Alphabetical) */}
      {filteredExercises.length === 0 ? (
        <div className="liquid-glass flex flex-col items-center justify-center rounded-3xl p-12 text-center">
          <svg className="h-10 w-10 text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <h3 className="text-base font-bold text-white">No matching exercises found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Try adjusting your search keywords, body part filter, or letter selection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedLetter("All");
              setSelectedBodyPart("All");
              setSelectedCategory("All");
            }}
            className="mt-4 liquid-glass px-4 py-2 text-xs font-bold text-sky-300 hover:text-white rounded-xl button-press"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className="liquid-glass card-hover-lift shimmer-hover cursor-pointer rounded-3xl p-5 border border-white/10 hover:border-sky-400/40 transition-all space-y-3 group button-press"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="liquid-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300 border-sky-500/30">
                    {ex.bodyPart}
                  </span>
                  <span className="liquid-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300 border-cyan-500/30">
                    {ex.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-sky-300 transition-colors flex items-center gap-1">
                  <span>View Guide</span>
                  <span className="group-hover-arrow">→</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-sky-300 transition-colors">
                  {ex.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  Target: {ex.primaryMuscle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] text-slate-400">
                <span>{ex.difficulty}</span>
                <span className="text-sky-300 font-semibold">Video + Setup ({unit.toUpperCase()})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Minimalist Executive Fitness Dashboard
   ═══════════════════════════════════════════════════════════════ */
function DashboardTab({
  onNavigateTab,
  onQuickStart,
  onStartTemplate,
  onSelectExercise,
  metrics,
  exerciseHistory,
  userTemplates,
}: {
  onNavigateTab: (t: HomeTab) => void;
  onQuickStart: () => void;
  onStartTemplate: (t: WorkoutTemplate) => void;
  onSelectExercise: (ex: ExerciseLibraryItem) => void;
  metrics: MetricEntry[];
  exerciseHistory: Record<string, ExerciseHistoryItem[]>;
  userTemplates: WorkoutTemplate[];
}) {
  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const initialMetric = metrics.length > 0 ? metrics[0] : null;
  const weightDelta =
    latestMetric && initialMetric
      ? Math.round((latestMetric.weight - initialMetric.weight) * 10) / 10
      : 0;

  // Flattened session history items
  const allSessions = useMemo(() => {
    const list: { id: string; exName: string; date: string; setsCount: number; maxWeight: number; unit: string }[] = [];
    Object.entries(exerciseHistory).forEach(([exId, sessions]) => {
      const ex = EXERCISE_LIBRARY.find((e) => e.id === exId);
      sessions.forEach((s) => {
        const maxW = s.sets.reduce((max, cur) => Math.max(max, cur.weight), 0);
        list.push({
          id: s.id,
          exName: ex ? ex.name : "Exercise Set",
          date: s.date,
          setsCount: s.sets.length,
          maxWeight: maxW,
          unit: s.unit,
        });
      });
    });
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  }, [exerciseHistory]);

  const spotlightExercises = useMemo(() => {
    const ids = ["lib-bench-press", "lib-back-squat", "lib-lat-pulldown"];
    return EXERCISE_LIBRARY.filter((ex) => ids.includes(ex.id)).slice(0, 3);
  }, []);

  const weeklySchedule = useMemo(() => {
    const daysConfig = [
      { dayKey: 1, day: "Mon", title: "Push", duration: "48m" },
      { dayKey: 2, day: "Tue", title: "Pull", duration: "52m" },
      { dayKey: 3, day: "Wed", title: "Recovery", duration: "25m" },
      { dayKey: 4, day: "Thu", title: "Legs", duration: "55m" },
      { dayKey: 5, day: "Fri", title: "Upper", duration: "45m" },
      { dayKey: 6, day: "Sat", title: "Conditioning", duration: "50m" },
      { dayKey: 0, day: "Sun", title: "Mobility", duration: "Active" },
    ];

    const todayDay = new Date().getDay(); // 0 is Sunday
    const normalizedToday = todayDay === 0 ? 7 : todayDay;

    return daysConfig.map((item) => {
      const normalizedDay = item.dayKey === 0 ? 7 : item.dayKey;
      let status: "completed" | "today" | "upcoming";
      if (normalizedDay < normalizedToday) {
        status = "completed";
      } else if (normalizedDay === normalizedToday) {
        status = "today";
      } else {
        status = "upcoming";
      }
      return {
        day: item.day,
        title: item.title,
        duration: item.duration,
        status,
      };
    });
  }, []);

  // Top 4 curated templates for quick launch
  const topTemplates = useMemo(() => {
    const list = [...userTemplates, ...EXAMPLE_TEMPLATES];
    return list.slice(0, 4);
  }, [userTemplates]);

  return (
    <div className="animate-[fadeInUp_0.3s_ease-out_both] space-y-5">
      {/* ── 1. Compact Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-white/[0.06] animate-fade-in-down">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Training <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">Command Center</span>
          </h1>
          <span className="liquid-pill hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-sky-300 animate-float">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
            <span>Active Cycle</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onQuickStart}
            className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 px-3 py-1.5 text-xs font-bold text-slate-200 border border-white/10 transition-all button-press shimmer-hover"
          >
            <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
            <span>+ Quick Workout</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("ai")}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:opacity-95 transition-opacity button-press shimmer-hover"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
            <span>AI Studio</span>
          </button>
        </div>
      </div>

      {/* ── 2. Unified Streamlined 4-Stat Strip (Staggered Animation) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Streak */}
        <div className="liquid-glass card-hover-lift shimmer-hover rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Consistency</span>
            <span className="text-[10px] font-bold text-sky-400">92%</span>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-white">5</span>
            <span className="text-xs font-bold text-sky-400 ml-1">Day Streak</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">4 sessions logged this week</p>
        </div>

        {/* Weight */}
        <div
          onClick={() => onNavigateTab("metrics")}
          className="liquid-glass card-hover-lift shimmer-hover liquid-glass-interactive cursor-pointer rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between animate-fade-in-up stagger-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Body Weight</span>
            <span className="liquid-pill px-1.5 py-0.2 text-[9px] font-bold text-teal-300 rounded">BMI 23.8</span>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-white">{latestMetric ? latestMetric.weight : "175.4"}</span>
            <span className="text-xs font-bold text-teal-400 ml-1">lbs</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {weightDelta !== 0 ? `${weightDelta > 0 ? "+" : ""}${weightDelta} lbs baseline` : "Baseline calibrated"}
          </p>
        </div>

        {/* Volume Time */}
        <div className="liquid-glass card-hover-lift shimmer-hover rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Volume Time</span>
            <span className="text-[10px] font-bold text-cyan-300">93%</span>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-white">225</span>
            <span className="text-xs font-bold text-cyan-400 ml-1">mins</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Target: 240 mins / week</p>
        </div>

        {/* Split */}
        <div className="liquid-glass card-hover-lift shimmer-hover rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Muscle Split</span>
            <span className="text-[10px] font-bold text-emerald-400">Optimal</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-black text-white">Push / Pull / Legs</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">35% Push • 35% Pull • 30% Legs</p>
        </div>
      </div>

      {/* ── 3. Combined Microcycle Tracker & AI Training Cue ── */}
      <div className="liquid-glass rounded-2xl p-4 border border-white/10 space-y-3 animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white">Weekly Microcycle</span>
            <span className="text-[10px] text-slate-400">• Mon to Sun</span>
          </div>
          <button
            type="button"
            onClick={onQuickStart}
            className="text-[11px] font-bold text-sky-400 hover:text-white transition-colors flex items-center gap-1 button-press group"
          >
            <span>Start Today&apos;s Workout</span>
            <span className="group-hover-arrow">→</span>
          </button>
        </div>

        {/* 7-Day Microcycle Strip */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weeklySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-2 sm:p-2.5 text-center border card-hover-lift button-press ${
                item.status === "today"
                  ? "border-cyan-400/70 bg-cyan-950/40 ring-1 ring-cyan-400/40 shadow-sm shadow-cyan-500/20"
                  : item.status === "completed"
                  ? "border-sky-500/30 bg-sky-950/20"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-[11px] font-bold text-white">{item.day}</span>
                {item.status === "completed" && (
                  <span className="text-cyan-400 text-[9px] font-black animate-check-pop">✓</span>
                )}
                {item.status === "today" && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                )}
              </div>
              <p className={`text-[10px] font-bold mt-1 truncate ${item.status === "today" ? "text-cyan-300 font-extrabold" : "text-slate-400"}`}>
                {item.title}
              </p>
            </div>
          ))}
        </div>

        {/* Slim AI Cue Footer */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 min-w-0">
            <span className="liquid-pill px-1.5 py-0.2 rounded text-[9px] font-bold text-cyan-300 uppercase shrink-0 animate-subtle-pulse">
              AI Cue
            </span>
            <p className="text-[11px] text-slate-300 truncate font-medium">
              Overload phase: target +2.5 lbs or +1 rep on primary compound movements. Rest 2–3 min between sets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("ai")}
            className="text-[10px] font-bold text-sky-400 hover:text-white shrink-0 ml-2 button-press flex items-center gap-1 group"
          >
            <span>Custom Routine</span>
            <span className="group-hover-arrow">→</span>
          </button>
        </div>
      </div>

      {/* ── 4. Main Two-Column Hub (Workouts on Left, Telemetry on Right) ── */}
      <div className="grid gap-5 lg:grid-cols-12 items-start animate-fade-in-up stagger-3">
        {/* Left Column (7 cols): Quick Launch Blueprints */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Quick Launch Routines</h3>
            <button
              type="button"
              onClick={() => onNavigateTab("templates")}
              className="text-[11px] font-bold text-sky-400 hover:text-white transition-colors group flex items-center gap-1"
            >
              <span>All Templates ({userTemplates.length + EXAMPLE_TEMPLATES.length})</span>
              <span className="group-hover-arrow">→</span>
            </button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {topTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="liquid-glass card-hover-lift shimmer-hover rounded-2xl p-3.5 border border-white/10 hover:border-sky-400/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="liquid-pill px-2 py-0.5 text-[9px] font-bold uppercase text-sky-300 rounded">
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{tmpl.exercises.length} Exercises</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-2 group-hover:text-sky-300 transition-colors">
                    {tmpl.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {tmpl.exercises.map((e) => e.name).slice(0, 3).join(", ")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartTemplate(tmpl)}
                  className="mt-3 w-full py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-bold transition-all button-press flex items-center justify-center gap-1 group/btn"
                >
                  <span>Start Workout</span>
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Activity Stream & Quick Guides */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recent Performance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Recent Performance</h3>
              <button
                type="button"
                onClick={() => onNavigateTab("metrics")}
                className="text-[11px] font-bold text-sky-400 hover:text-white transition-colors group flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <span className="group-hover-arrow">→</span>
              </button>
            </div>

            <div className="liquid-glass rounded-2xl p-3 border border-white/10 space-y-1.5">
              {allSessions.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No recorded lifts yet. Start a session to see telemetry!
                </div>
              ) : (
                allSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 px-2.5 py-2 text-xs card-hover-lift transition-all hover:bg-white/[0.05]"
                  >
                    <div>
                      <p className="font-bold text-white text-[11px]">{s.exName}</p>
                      <p className="font-mono text-[9px] text-slate-400">{s.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sky-300 text-[11px]">
                        {s.maxWeight > 0 ? `${s.maxWeight} ${s.unit}` : "Bodyweight"}
                      </p>
                      <p className="text-[9px] text-slate-400">{s.setsCount} sets</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Exercise Spotlight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Exercise Library Spotlight</h3>
              <button
                type="button"
                onClick={() => onNavigateTab("exercises")}
                className="text-[11px] font-bold text-sky-400 hover:text-white transition-colors group flex items-center gap-1"
              >
                <span>A–Z Library (77)</span>
                <span className="group-hover-arrow">→</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {spotlightExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onSelectExercise(ex)}
                  className="liquid-glass card-hover-lift shimmer-hover cursor-pointer rounded-xl p-2 border border-white/10 text-center hover:border-cyan-400/40 transition-all group button-press"
                >
                  <p className="text-[11px] font-extrabold text-white group-hover:text-cyan-300 truncate transition-colors">
                    {ex.name}
                  </p>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">{ex.bodyPart}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ╔═══════════════════════════════════════════════════════════╗
   ║                      MAIN DASHBOARD                      ║
   ╚═══════════════════════════════════════════════════════════════╝
   ═══════════════════════════════════════════════════════════════ */
type AppPhase = "home" | "tracking" | "summary";
type HomeTab = "dashboard" | "ai" | "quick" | "templates" | "exercises" | "metrics";

export default function Home() {
  /* ── Sidebar & Navigation state ───────── */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showTipJar, setShowTipJar] = useState(false);

  /* ── Tab & Form state ─────────────────── */
  const [tab, setTab] = useState<HomeTab>("dashboard");
  const [preferredUnit, setPreferredUnit] = useState<"lbs" | "kg">("lbs");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [equipment, setEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WorkoutDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ── Templates state ──────────────────── */
  const [userTemplates, setUserTemplates] = useState<WorkoutTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => {
    setUserTemplates(loadUserTemplates());
  }, []);

  function saveTemplate(t: WorkoutTemplate) {
    const updated = [...userTemplates, t];
    setUserTemplates(updated);
    saveUserTemplates(updated);
    setShowCreateModal(false);
  }

  function deleteTemplate(id: string) {
    const updated = userTemplates.filter((t) => t.id !== id);
    setUserTemplates(updated);
    saveUserTemplates(updated);
  }

  /* ── Body Metrics state ───────────────── */
  const [metrics, setMetrics] = useState<MetricEntry[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [activeMetric, setActiveMetric] = useState<ActiveMetricType>("weight");
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("days");

  useEffect(() => {
    setMetrics(loadUserMetrics());
  }, []);

  function addMetricEntry(entry: MetricEntry) {
    const updated = [...metrics, entry];
    setMetrics(updated);
    saveUserMetrics(updated);
    setShowLogModal(false);
  }

  function deleteMetricEntry(id: string) {
    const updated = metrics.filter((m) => m.id !== id);
    setMetrics(updated);
    saveUserMetrics(updated);
  }

  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const initialMetric = metrics.length > 0 ? metrics[0] : null;

  /* ── Exercise Library & History state ─── */
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, ExerciseHistoryItem[]>>({});
  const [selectedExercise, setSelectedExercise] = useState<ExerciseLibraryItem | null>(null);

  useEffect(() => {
    setExerciseHistory(loadExerciseHistory());
  }, []);

  function addExerciseHistorySet(exId: string, weight: number, reps: number, unit: "lbs" | "kg") {
    const todayStr = new Date().toISOString().split("T")[0];
    const currentHist = exerciseHistory[exId] || [];
    const todaySession = currentHist.find((h) => h.date === todayStr);

    let updatedHist: ExerciseHistoryItem[];
    if (todaySession) {
      const nextSetNum = todaySession.sets.length + 1;
      const updatedSession = {
        ...todaySession,
        sets: [...todaySession.sets, { setNum: nextSetNum, weight, reps }],
      };
      updatedHist = currentHist.map((h) => (h.id === todaySession.id ? updatedSession : h));
    } else {
      const newSession: ExerciseHistoryItem = {
        id: uid(),
        date: todayStr,
        unit,
        sets: [{ setNum: 1, weight, reps }],
      };
      updatedHist = [newSession, ...currentHist];
    }

    const nextState = { ...exerciseHistory, [exId]: updatedHist };
    setExerciseHistory(nextState);
    saveExerciseHistory(nextState);
  }

  /* ── Tracking state ───────────────────── */
  const [phase, setPhase] = useState<AppPhase>("home");
  const [workoutTitle, setWorkoutTitle] = useState("Custom Session");
  const [trackedExercises, setTrackedExercises] = useState<TrackedExercise[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isReady = goal !== "" && experience !== "" && equipment !== "";

  useEffect(() => {
    if (phase === "tracking") {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  /* ── Actions ──────────────────────────── */
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!isReady || loading) return;
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, experience, equipment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation request failed");
      if (!data.plan || !Array.isArray(data.plan)) throw new Error("Unexpected response from AI");
      setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  }

  function startFromPlan(dayIdx: number) {
    if (!plan) return;
    const day = plan[dayIdx];
    setWorkoutTitle(day.day);
    setTrackedExercises(exercisesToTracked(day.exercises));
    setPhase("tracking");
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startFromTemplate(template: WorkoutTemplate) {
    setWorkoutTitle(template.name);
    setTrackedExercises(exercisesToTracked(template.exercises));
    setPhase("tracking");
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function quickStart() {
    setWorkoutTitle("Quick Session");
    setTrackedExercises([]);
    setPhase("tracking");
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishWorkout() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("summary");
  }

  function resetHome() {
    setPhase("home");
    setPlan(null);
    setTrackedExercises([]);
    setElapsedSeconds(0);
    setGoal("");
    setExperience("");
    setEquipment("");
    setTab("dashboard");
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateToTab(targetTab: HomeTab) {
    setTab(targetTab);
    if (phase !== "home") setPhase("home");
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ═══════════════════════════════════════════════════════════════
     Sidebar / Tabs Navigation Items
     ═══════════════════════════════════════════════════════════════ */
  const NAV_ITEMS: { key: HomeTab; label: string; sub: string; badge?: string; icon: React.ReactNode }[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      sub: "Overview & Daily Stats",
      badge: "Hub",
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      ),
    },
    {
      key: "ai",
      label: "AI Studio",
      sub: "Smart Routine Generator",
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
        </svg>
      ),
    },
    {
      key: "quick",
      label: "Quick Start",
      sub: "Freeform & Presets",
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
    },
    {
      key: "templates",
      label: "Templates",
      sub: "Saved Blueprints",
      badge: `${userTemplates.length + EXAMPLE_TEMPLATES.length}`,
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
        </svg>
      ),
    },
    {
      key: "exercises",
      label: "Exercise Library",
      sub: "A to Z Catalog & Videos",
      badge: `${EXERCISE_LIBRARY.length}`,
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      key: "metrics",
      label: "Body & Metrics",
      sub: "Weight, Fat, Calories, BMI",
      badge: "Graphs",
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
  ];

  const currentTabInfo = NAV_ITEMS.find((n) => n.key === tab) || NAV_ITEMS[0];

  return (
    <>
      <LiquidBackground />

      <div className="flex min-h-screen">
        {/* ═══════════════════════════════════════════════════════════
            COLLAPSIBLE SIDEBAR (Desktop)
           ═══════════════════════════════════════════════════════════ */}
        <aside
          className={`hidden lg:flex flex-col border-r border-sky-400/[0.12] bg-[#040914]/90 backdrop-blur-2xl transition-all duration-300 z-40 sticky top-0 h-screen overflow-x-hidden overflow-y-auto no-scrollbar select-none ${
            sidebarCollapsed ? "w-20 p-3" : "w-64 p-5"
          }`}
        >
          {/* Logo & Toggle Header */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
            <button
              type="button"
              onClick={resetHome}
              className={`flex items-center gap-2.5 text-left group overflow-hidden ${sidebarCollapsed ? "justify-center w-full" : ""}`}
              title="Return to AI Studio / Home"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-sky-400/30 bg-sky-950/40 shadow-lg shadow-sky-500/20 group-hover:border-sky-400/60 transition-all p-1">
                <Image
                  src="/forma-logo.png"
                  alt="Forma.AI Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(56,189,248,0.35)]"
                  priority
                />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <span className="text-base font-black tracking-tight text-white block leading-tight">
                    Forma<span className="text-sky-400 font-black">.AI</span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-sky-400/90 block">
                    Studio v2.4
                  </span>
                </div>
              )}
            </button>

            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="liquid-pill h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-all shrink-0"
                title="Collapse sidebar"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
          </div>

          {/* If Collapsed, quick expand toggle icon */}
          {sidebarCollapsed && (
            <div className="py-1.5 flex justify-center">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="liquid-pill h-6 w-6 flex items-center justify-center rounded-lg text-sky-400 hover:text-white transition-all"
                title="Expand sidebar"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}

          {/* Live Date & Time Widget (Below Logo) */}
          <div className="pt-3 pb-1">
            <LiveDateTime compact={sidebarCollapsed} />
          </div>

          {/* Quick Workout Button */}
          <div className="pt-2 pb-2">
            <button
              type="button"
              onClick={quickStart}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:from-sky-400 hover:to-teal-300 active:scale-[0.98] button-press shimmer-hover animate-gradient-flow ${
                sidebarCollapsed ? "px-2 text-[10px]" : "px-4"
              }`}
              title="Start workout session"
            >
              <svg className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              {!sidebarCollapsed && <span>Quick Workout</span>}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-1.5 py-3 overflow-y-auto overflow-x-hidden no-scrollbar">
            {!sidebarCollapsed && (
              <p className="px-2 pb-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Navigation
              </p>
            )}

            {NAV_ITEMS.map((item) => {
              const active = tab === item.key && phase === "home";
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigateToTab(item.key)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-all button-press ${
                    active
                      ? "bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 text-white shadow-md shadow-sky-500/25 border border-white/20 animate-scale-in"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                  title={item.label}
                >
                  <span className={`transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5 ${active ? "text-white" : "text-sky-400 group-hover:text-cyan-300"}`}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0 transition-transform duration-200 group-hover:translate-x-0.5">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`liquid-pill px-1.5 py-0.2 text-[9px] font-semibold rounded transition-colors ${
                              active ? "bg-white/20 text-white" : "text-sky-300 group-hover:text-white"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] block truncate mt-0.5 transition-colors ${
                          active ? "text-sky-100 font-medium" : "text-slate-400 font-normal group-hover:text-slate-300"
                        }`}
                      >
                        {item.sub}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Workout Widget in Sidebar (if active) */}
          {phase === "tracking" && !sidebarCollapsed && (
            <div className="mb-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3 animate-[pulse-glow_3s_ease-in-out_infinite]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                  </span>
                  Workout In Progress
                </span>
                <span className="font-mono text-xs font-bold text-white">{formatTime(elapsedSeconds)}</span>
              </div>
              <p className="mt-1 truncate text-xs font-extrabold text-white">{workoutTitle}</p>
            </div>
          )}

          {/* Sidebar Footer */}
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <button
              type="button"
              onClick={() => setShowTipJar(true)}
              className={`liquid-glass flex w-full items-center gap-2 rounded-xl py-2 text-xs font-semibold text-slate-300 hover:text-white transition-all ${
                sidebarCollapsed ? "justify-center px-1" : "px-3"
              }`}
              title="Support developer"
            >
              <svg className="h-4 w-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {!sidebarCollapsed && <span>Tip Jar / Support</span>}
            </button>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════
            MOBILE DRAWER OVERLAY
           ═══════════════════════════════════════════════════════════ */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" style={{ animation: "fadeIn 0.2s ease-out" }}>
            <div className="absolute inset-0 bg-[#020713]/85 backdrop-blur-md" onClick={() => setMobileDrawerOpen(false)} />
            <div className="liquid-glass absolute left-0 top-0 bottom-0 w-72 p-5 flex flex-col justify-between shadow-2xl z-10 border-r border-sky-400/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <button type="button" onClick={resetHome} className="flex items-center gap-2.5">
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-sky-400/30 bg-sky-950/40 p-0.5 shadow-md shadow-sky-500/20">
                      <Image
                        src="/forma-logo.png"
                        alt="Forma.AI Logo"
                        width={30}
                        height={30}
                        className="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(56,189,248,0.35)]"
                      />
                    </div>
                    <span className="text-base font-black text-white">Forma.AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="liquid-pill h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Mobile Live Date & Time */}
                <div>
                  <LiveDateTime />
                </div>

                <div className="space-y-1.5 pt-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                  <p className="px-2 pb-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    Navigation Menu
                  </p>
                  {NAV_ITEMS.map((item) => {
                    const active = tab === item.key && phase === "home";
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => navigateToTab(item.key)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs font-bold transition-all ${
                          active
                            ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className={`${active ? "text-white" : "text-sky-400"}`}>{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="block truncate">{item.label}</span>
                          <span
                            className={`text-[10px] block truncate mt-0.5 ${
                              active ? "text-sky-100 font-medium" : "text-slate-400 font-normal"
                            }`}
                          >
                            {item.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowTipJar(true);
                  }}
                  className="liquid-glass flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white"
                >
                  <svg className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  Tip Jar / Donations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MAIN BODY / APP CONTENT WRAPPER
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Top Sticky App Header */}
          <header className="sticky top-0 z-40 border-b border-sky-400/[0.12] bg-[#040914]/85 backdrop-blur-2xl">
            <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6">
              {/* Left: Sidebar Toggle & Breadcrumb Navigation */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(true)}
                  className="lg:hidden liquid-pill flex h-9 w-9 items-center justify-center rounded-xl text-sky-400 hover:text-white"
                  title="Open Navigation Menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex liquid-pill h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-sky-300 transition-colors"
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>

                {/* Breadcrumbs / Back button */}
                <div className="flex items-center gap-2">
                  {tab !== "dashboard" && phase === "home" ? (
                    <button
                      type="button"
                      onClick={() => navigateToTab("dashboard")}
                      className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-300 hover:text-white hover:border-sky-400/50 transition-all group"
                      title="Return to Dashboard"
                    >
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                  ) : null}

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="font-semibold text-slate-500">/</span>
                    <span className="font-bold text-white">{currentTabInfo.label}</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">

                {phase === "tracking" ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetHome}
                      className="liquid-pill flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-all rounded-full"
                    >
                      <svg className="h-3.5 w-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      <span>Back</span>
                    </button>
                    <div className="liquid-pill flex items-center gap-1.5 rounded-full px-3 py-1 text-cyan-400 border-cyan-500/30">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider">{formatTime(elapsedSeconds)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="liquid-pill flex items-center gap-2 rounded-full px-3 py-1 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                    <span className="text-[11px] font-semibold text-slate-300">Studio Ready</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6">
            {phase === "home" && (
              <>
                {/* ─── TAB 0: DASHBOARD ─── */}
                {tab === "dashboard" && (
                  <DashboardTab
                    onNavigateTab={navigateToTab}
                    onQuickStart={quickStart}
                    onStartTemplate={startFromTemplate}
                    onSelectExercise={setSelectedExercise}
                    metrics={metrics}
                    exerciseHistory={exerciseHistory}
                    userTemplates={userTemplates}
                  />
                )}

                {/* ─── TAB 1: AI GENERATOR ─── */}
                {tab === "ai" && (
                  <div className="space-y-6">
                    {/* Hero Intro */}
                    <div className="py-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300 mb-2">
                        <span>Intelligent Performance</span>
                      </div>
                      <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                        Forma <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">Workout Studio</span>
                      </h1>
                      <p className="mt-1 text-xs text-slate-400 max-w-lg">
                        Synthesize customized 3-day workout routines or browse exercises, track live sessions, and measure progression.
                      </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-12 items-start">
                      <form id="workout-form" onSubmit={handleGenerate} className="lg:col-span-6">
                        <div className="liquid-glass relative overflow-hidden rounded-3xl p-6 shadow-2xl">
                          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                          <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="liquid-pill flex h-7 w-7 items-center justify-center rounded-xl text-sky-300">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                                </svg>
                              </span>
                              <h2 className="text-sm font-extrabold text-white">Generate Routine</h2>
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Groq LLM</span>
                          </div>

                          <div className="space-y-5">
                            <FitnessGoalSelector value={goal} onChange={setGoal} />
                            <ExperienceLevelSelector value={experience} onChange={setExperience} />
                            <EquipmentMixSelector value={equipment} onChange={setEquipment} />
                          </div>

                          <button
                            type="submit"
                            disabled={!isReady || loading}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl transition-all hover:from-sky-400 hover:to-teal-300 disabled:opacity-40 active:scale-[0.98] button-press shimmer-hover animate-gradient-flow"
                            style={isReady && !loading ? { animation: "pulse-glow 3s ease-in-out infinite" } : undefined}
                          >
                            {loading ? (
                              <>
                                <Spinner className="h-4 w-4" /> Synthesizing Plan…
                              </>
                            ) : (
                              <>
                                <svg className="h-4 w-4 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                                </svg>
                                Build 3-Day Plan
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      <div className="lg:col-span-6 space-y-4">
                        {error && (
                          <div className="liquid-glass flex items-start gap-3 rounded-2xl border-red-500/30 bg-red-950/20 p-4 text-xs animate-scale-in">
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            <p className="text-red-300 leading-relaxed">{error}</p>
                            <button onClick={() => setError(null)} className="ml-auto text-red-400/60 hover:text-red-200">
                              ✕
                            </button>
                          </div>
                        )}

                        {loading && (
                          <div className="liquid-glass rounded-3xl p-8 animate-fade-in">
                            <div className="flex items-center gap-3">
                              <Spinner className="h-5 w-5 text-sky-400" />
                              <div>
                                <p className="text-sm font-bold text-white">AI Coach is calculating routine…</p>
                                <p className="text-xs text-slate-400">Optimizing volume, rest intervals, and exercises</p>
                              </div>
                            </div>
                            <div className="mt-6 space-y-3">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="h-4 animate-pulse rounded-lg bg-white/5" style={{ width: `${88 - i * 15}%` }} />
                              ))}
                            </div>
                          </div>
                        )}

                        {plan && !loading && (
                          <div className="space-y-3 animate-fade-in-up">
                            <div className="flex items-center justify-between px-1">
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400">Custom 3-Day Plan Generated</p>
                              <span className="text-[10px] text-slate-400">Tap a day to begin</span>
                            </div>
                            {plan.map((day, i) => (
                              <button
                                key={i}
                                onClick={() => startFromPlan(i)}
                                className={`liquid-glass card-hover-lift shimmer-hover group w-full overflow-hidden rounded-2xl p-5 text-left transition-all button-press animate-fade-in-up stagger-${i + 1}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="liquid-pill rounded-lg px-2.5 py-1 text-xs font-bold text-sky-300 border-sky-500/30">
                                    {day.day}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300 opacity-80 group-hover:opacity-100 transition-all">
                                    <span>Start Workout</span>
                                    <svg className="h-3.5 w-3.5 group-hover-arrow" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {day.exercises.map((ex, j) => (
                                    <span key={j} className="rounded-lg bg-white/[0.04] border border-white/[0.05] px-2.5 py-1 text-xs text-slate-300">
                                      {ex.name}
                                    </span>
                                  ))}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {!plan && !loading && !error && (
                          <div className="liquid-glass flex flex-col items-center justify-center rounded-3xl p-10 text-center">
                            <div className="liquid-pill flex h-14 w-14 items-center justify-center rounded-2xl text-sky-300 mb-3">
                              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-bold text-white">Generated Plan Area</h3>
                            <p className="mt-1 max-w-xs text-xs text-slate-400">
                              Configure your target parameters on the left to synthesize an adaptive 3-day schedule.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: QUICK START ─── */}
                {tab === "quick" && (
                  <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out_both]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigateToTab("ai")}
                        className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white group"
                      >
                        <svg className="h-4 w-4 text-sky-400 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        <span>Dashboard</span>
                      </button>
                      <h2 className="text-lg font-extrabold text-white">Quick Start Workouts</h2>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-lg space-y-6">
                        <button
                          onClick={quickStart}
                          className="liquid-glass liquid-glass-interactive group flex w-full items-center gap-5 rounded-3xl p-6 text-left"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-xl shadow-sky-500/25 transition-transform group-hover:scale-105">
                            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-white">Start Empty Workout</h3>
                            <p className="mt-0.5 text-xs text-slate-400">Freely add and track exercises as you train</p>
                          </div>
                          <svg className="ml-auto h-5 w-5 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-sky-300" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>

                        <div>
                          <div className="mb-3 flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Quick Preset Routines</p>
                            <span className="text-[10px] text-slate-500">Popular</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {EXAMPLE_TEMPLATES.slice(0, 4).map((t) => (
                              <button
                                key={t.id}
                                onClick={() => startFromTemplate(t)}
                                className="liquid-glass liquid-glass-interactive rounded-2xl p-4 text-left group"
                              >
                                <span className="liquid-pill inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300 mb-2">
                                  {t.category}
                                </span>
                                <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{t.name}</p>
                                <p className="mt-1 text-[10px] text-slate-400">{t.exercises.length} exercises</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: TEMPLATES ─── */}
                {tab === "templates" && (
                  <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out_both]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => navigateToTab("ai")}
                          className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white group"
                        >
                          <svg className="h-4 w-4 text-sky-400 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                          </svg>
                          <span>Dashboard</span>
                        </button>
                        <h2 className="text-lg font-extrabold text-white">Routines & Templates</h2>
                      </div>

                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:from-sky-400 hover:to-cyan-400 active:scale-[0.98]"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Template
                      </button>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-sm font-extrabold text-white mb-2 px-1">My Saved Templates</h3>
                        {userTemplates.length === 0 ? (
                          <div className="liquid-glass flex items-center gap-4 rounded-3xl p-6">
                            <div className="liquid-pill flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sky-300">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">No custom templates yet</p>
                              <p className="text-xs text-slate-400">Click &quot;Create Template&quot; to design your own exercise blueprint.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {userTemplates.map((t) => (
                              <div key={t.id} className="liquid-glass liquid-glass-interactive group relative overflow-hidden rounded-2xl">
                                <button onClick={() => startFromTemplate(t)} className="w-full p-4 text-left">
                                  <span className="liquid-pill inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300 mb-1.5">
                                    {t.category}
                                  </span>
                                  <p className="text-sm font-extrabold text-white">{t.name}</p>
                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    {t.exercises.length} exercises • {t.exercises.reduce((s, e) => s + e.sets, 0)} total sets
                                  </p>
                                  <div className="mt-2.5 flex flex-wrap gap-1">
                                    {t.exercises.slice(0, 3).map((e, i) => (
                                      <span key={i} className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-300">
                                        {e.name}
                                      </span>
                                    ))}
                                    {t.exercises.length > 3 && (
                                      <span className="text-[10px] text-slate-500 font-semibold">+{t.exercises.length - 3}</span>
                                    )}
                                  </div>
                                </button>
                                <button
                                  onClick={() => deleteTemplate(t.id)}
                                  className="absolute right-2.5 top-2.5 rounded-lg p-1 text-slate-500 opacity-0 transition-all hover:bg-red-500/20 hover:text-red-300 group-hover:opacity-100"
                                  title="Delete"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-white mb-2 px-1">Example Templates</h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {EXAMPLE_TEMPLATES.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => startFromTemplate(t)}
                              className="liquid-glass liquid-glass-interactive group overflow-hidden rounded-2xl p-4 text-left transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="liquid-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">
                                  {t.category}
                                </span>
                                <span className="text-[10px] font-bold text-sky-300 opacity-0 transition-opacity group-hover:opacity-100">
                                  Start →
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{t.name}</p>
                              <p className="text-[10px] text-slate-400">
                                {t.exercises.length} exercises • {t.exercises.reduce((s, e) => s + e.sets, 0)} total sets
                              </p>
                              <div className="mt-2.5 flex flex-wrap gap-1">
                                {t.exercises.map((e, i) => (
                                  <span key={i} className="rounded-md bg-white/[0.04] border border-white/[0.05] px-1.5 py-0.5 text-[10px] text-slate-300">
                                    {e.name}
                                  </span>
                                ))}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 4: EXERCISE LIBRARY (40+ Exercises A to Z) ─── */}
                {tab === "exercises" && (
                  <ExerciseLibraryTab
                    onSelectExercise={(ex) => setSelectedExercise(ex)}
                    unit={preferredUnit}
                    onSetUnit={(u) => setPreferredUnit(u)}
                    onBack={() => navigateToTab("ai")}
                  />
                )}

                {/* ─── TAB 5: BODY & METRICS ─── */}
                {tab === "metrics" && (
                  <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out_both]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigateToTab("ai")}
                        className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white group"
                      >
                        <svg className="h-4 w-4 text-sky-400 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        <span>Dashboard</span>
                      </button>
                      <h2 className="text-lg font-extrabold text-white">Body Progression & Measurements</h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div
                        onClick={() => setActiveMetric("weight")}
                        className={`liquid-glass liquid-glass-interactive cursor-pointer rounded-3xl p-5 border transition-all ${
                          activeMetric === "weight"
                            ? "border-sky-400/60 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/40"
                            : "border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Body Weight</span>
                          <span className="liquid-pill flex h-6 w-6 items-center justify-center rounded-lg text-sky-300">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97ZM5.25 4.97c-.122.499.106 1.028.589 1.202.628.226 1.305.352 2.031.352.726 0 1.403-.126 2.031-.352.483-.174.711-.703.59-1.202L7.87 4.97M5.25 4.97c-1.01.143-2.01.317-3 .52m3-.52L2.63 15.696c-.122.499.106 1.028.589 1.202.628.226 1.305.352 2.031.352.726 0 1.403-.126 2.031-.352.483-.174.711-.703.59-1.202L5.25 4.97Z" />
                            </svg>
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-black tracking-tight text-white">
                          {latestMetric ? `${latestMetric.weight} lbs` : "—"}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-sky-300">
                          {metrics.length > 1
                            ? `${Math.round((latestMetric!.weight - metrics[0].weight) * 10) / 10} lbs overall`
                            : "Baseline set"}
                        </p>
                      </div>

                      <div
                        onClick={() => setActiveMetric("bodyFat")}
                        className={`liquid-glass liquid-glass-interactive cursor-pointer rounded-3xl p-5 border transition-all ${
                          activeMetric === "bodyFat"
                            ? "border-teal-400/60 shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/40"
                            : "border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Body Fat</span>
                          <span className="liquid-pill flex h-6 w-6 items-center justify-center rounded-lg text-teal-300">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                            </svg>
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-black tracking-tight text-white">
                          {latestMetric ? `${latestMetric.bodyFat}%` : "—"}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-teal-300">Composition tracking</p>
                      </div>

                      <div
                        onClick={() => setActiveMetric("calories")}
                        className={`liquid-glass liquid-glass-interactive cursor-pointer rounded-3xl p-5 border transition-all ${
                          activeMetric === "calories"
                            ? "border-cyan-400/60 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40"
                            : "border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Intake</span>
                          <span className="liquid-pill flex h-6 w-6 items-center justify-center rounded-lg text-cyan-300">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                            </svg>
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-black tracking-tight text-white">
                          {latestMetric ? `${latestMetric.calories.toLocaleString()} kcal` : "—"}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-cyan-300">Target intake</p>
                      </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-12 items-start">
                      <div className="liquid-glass rounded-3xl p-6 shadow-2xl lg:col-span-7 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                              <h3 className="text-sm font-extrabold text-white">
                                {activeMetric === "weight" ? "Weight Progression" : activeMetric === "bodyFat" ? "Body Fat Percentage" : "Caloric Intake Log"}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Timeline trends & historical measurements</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="liquid-pill flex rounded-xl p-0.5 border-white/10">
                              <button
                                type="button"
                                onClick={() => setTimelineFilter("days")}
                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                                  timelineFilter === "days" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-white"
                                }`}
                              >
                                Days
                              </button>
                              <button
                                type="button"
                                onClick={() => setTimelineFilter("months")}
                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                                  timelineFilter === "months" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-white"
                                }`}
                              >
                                Months
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => setShowLogModal(true)}
                              className="flex items-center gap-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 text-[10px] font-bold transition-all hover:bg-cyan-500/30"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              Log
                            </button>
                          </div>
                        </div>

                        <div className="pt-2">
                          <MetricsChart metrics={metrics} activeMetric={activeMetric} timelineFilter={timelineFilter} />
                        </div>

                        <div className="pt-4 border-t border-white/[0.06]">
                          <div className="flex items-center justify-between mb-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Logs</p>
                            <span className="text-[10px] text-slate-500">{metrics.length} recorded</span>
                          </div>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {[...metrics].reverse().slice(0, 5).map((m) => (
                              <div key={m.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
                                <span className="font-mono text-slate-400">{m.date}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-white">{m.weight} lbs</span>
                                  {m.bodyFat > 0 && <span className="text-teal-300">{m.bodyFat}%</span>}
                                  {m.calories > 0 && <span className="text-cyan-300">{m.calories} kcal</span>}
                                  <button
                                    onClick={() => deleteMetricEntry(m.id)}
                                    className="text-slate-500 hover:text-red-400 transition-colors p-0.5"
                                    title="Delete"
                                  >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5">
                        <BmiCalculator />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ══════════════ TRACKING VIEW ══════════════ */}
            {phase === "tracking" && (
              <div className="mx-auto w-full max-w-2xl">
                <ActiveWorkout
                  dayTitle={workoutTitle}
                  tracked={trackedExercises}
                  setTracked={setTrackedExercises}
                  onFinish={finishWorkout}
                  onBack={resetHome}
                  elapsedSeconds={elapsedSeconds}
                  unit={preferredUnit}
                  onSetUnit={setPreferredUnit}
                />
              </div>
            )}
          </main>

          {/* Footer */}
          {phase === "home" && (
            <footer className="border-t border-sky-400/[0.08] py-6 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Forma.AI — Intelligent Fitness Experience
            </footer>
          )}
        </div>
      </div>

      {/* ══════════════ EXERCISE DETAIL MODAL ══════════════ */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          unit={preferredUnit}
          onSetUnit={(u) => setPreferredUnit(u)}
          history={exerciseHistory[selectedExercise.id] || []}
          onAddHistorySet={addExerciseHistorySet}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* ══════════════ SUMMARY MODAL ══════════════ */}
      {phase === "summary" && (
        <WorkoutSummary
          dayTitle={workoutTitle}
          trackedExercises={trackedExercises}
          elapsedSeconds={elapsedSeconds}
          onClose={resetHome}
        />
      )}

      {/* ══════════════ CREATE TEMPLATE MODAL ══════════════ */}
      {showCreateModal && (
        <CreateTemplateModal onSave={saveTemplate} onClose={() => setShowCreateModal(false)} />
      )}

      {/* ══════════════ LOG METRICS MODAL ══════════════ */}
      {showLogModal && (
        <LogMetricModal onSave={addMetricEntry} onClose={() => setShowLogModal(false)} />
      )}

      {/* ══════════════ TIP JAR MODAL ══════════════ */}
      {showTipJar && <TipJarModal onClose={() => setShowTipJar(false)} />}
    </>
  );
}
