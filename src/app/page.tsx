"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef } from "react";

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

/* ═══════════════════════════════════════════════════════════════
   Constants
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
      { name: "Barbell Bench Press", sets: 4, reps: "8-10" },
      { name: "Overhead Dumbbell Press", sets: 3, reps: "8-10" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      { name: "Cable Lateral Raises", sets: 3, reps: "12-15" },
      { name: "Tricep Rope Pushdowns", sets: 3, reps: "12-15" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ex-pull",
    name: "Pull Strength",
    category: "Back & Biceps",
    isExample: true,
    exercises: [
      { name: "Barbell Deadlift", sets: 4, reps: "5-6" },
      { name: "Chest-Supported Row", sets: 4, reps: "8-10" },
      { name: "Lat Pulldown / Pull-Ups", sets: 3, reps: "8-10" },
      { name: "Rear Delt Face Pulls", sets: 3, reps: "15-20" },
      { name: "Incline Dumbbell Curl", sets: 3, reps: "10-12" },
      { name: "Hammer Curls", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ex-legs",
    name: "Leg Power & Quads",
    category: "Lower Body",
    isExample: true,
    exercises: [
      { name: "Barbell Back Squat", sets: 4, reps: "6-8" },
      { name: "Romanian Deadlift", sets: 4, reps: "8-10" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "10 each" },
      { name: "Leg Extension", sets: 3, reps: "12-15" },
      { name: "Seated Hamstring Curl", sets: 3, reps: "12-15" },
      { name: "Standing Calf Raises", sets: 4, reps: "15-20" },
    ],
  },
  {
    id: "ex-upper",
    name: "Upper Body Power",
    category: "Complete Upper",
    isExample: true,
    exercises: [
      { name: "Incline Barbell Bench", sets: 4, reps: "6-8" },
      { name: "Weighted Pull-Up", sets: 4, reps: "6-8" },
      { name: "Standing Overhead Press", sets: 3, reps: "8-10" },
      { name: "Seated Cable Row", sets: 3, reps: "10-12" },
      { name: "Cable Lateral Raise", sets: 3, reps: "12-15" },
      { name: "Dips / Tricep Pushdown", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ex-full",
    name: "Full Body Foundation",
    category: "Total Body",
    isExample: true,
    exercises: [
      { name: "Barbell Squat", sets: 3, reps: "8-10" },
      { name: "Flat Dumbbell Press", sets: 3, reps: "8-10" },
      { name: "Barbell Bent-Over Row", sets: 3, reps: "8-10" },
      { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12" },
      { name: "Dumbbell Lateral Raise", sets: 3, reps: "12-15" },
      { name: "Hanging Knee Raise", sets: 3, reps: "12-15" },
    ],
  },
  {
    id: "ex-hiit",
    name: "HIIT Conditioning",
    category: "Cardio & Stamina",
    isExample: true,
    exercises: [
      { name: "Kettlebell Swings", sets: 4, reps: "20" },
      { name: "Dumbbell Thrusters", sets: 4, reps: "12" },
      { name: "Bodyweight Push-Ups", sets: 4, reps: "15" },
      { name: "Box Jumps / Step-Ups", sets: 4, reps: "12" },
      { name: "Mountain Climbers", sets: 4, reps: "40s" },
      { name: "Plank Hold", sets: 4, reps: "45s" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   Helpers
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

/* ═══════════════════════════════════════════════════════════════
   Liquid Background with Ambient Fluid Orbs
   ═══════════════════════════════════════════════════════════════ */
function LiquidBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Fluid glowing light blobs */}
      <div className="animate-blob-1 absolute -left-[10%] top-[10%] h-[550px] w-[550px] rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="animate-blob-2 absolute -right-[10%] top-[25%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="animate-blob-1 absolute left-[30%] top-[65%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
      
      {/* Subtle fine mesh grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="liquid-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#liquid-grid)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Live Date & Time Widget
   ═══════════════════════════════════════════════════════════════ */
function LiveDateTime() {
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

  return (
    <div className="liquid-pill flex items-center gap-2.5 rounded-full px-3 py-1.5 text-xs text-slate-300">
      <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span className="font-medium text-slate-400">{dateStr}</span>
      <span className="h-2.5 w-px bg-white/10" />
      <span className="font-mono font-semibold text-slate-200">{timeStr}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Clean Select Field
   ═══════════════════════════════════════════════════════════════ */
function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="liquid-input w-full cursor-pointer rounded-xl px-3.5 py-2.5 pr-10 text-sm text-foreground transition-all focus:outline-none"
      >
        <option value="" disabled className="bg-neutral-900 text-slate-500">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-neutral-900 text-slate-200">
            {opt}
          </option>
        ))}
      </select>
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
      className={`group flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
        checked
          ? "border-emerald-400/80 bg-emerald-500/25 shadow-[0_0_14px_rgba(52,211,153,0.35)]"
          : "border-white/15 bg-white/[0.03] hover:border-white/30"
      }`}
    >
      {checked && (
        <svg className="h-4 w-4 text-emerald-300" style={{ animation: "checkPop 0.25s ease-out" }} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
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
        <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
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
          className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover disabled:opacity-40"
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
   Active Workout Tracker
   ═══════════════════════════════════════════════════════════════ */
function ActiveWorkout({
  dayTitle,
  tracked,
  setTracked,
  onFinish,
  elapsedSeconds,
}: {
  dayTitle: string;
  tracked: TrackedExercise[];
  setTracked: React.Dispatch<React.SetStateAction<TrackedExercise[]>>;
  onFinish: () => void;
  elapsedSeconds: number;
}) {
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

  function removeExercise(exIdx: number) {
    setTracked((prev) => prev.filter((_, i) => i !== exIdx));
  }

  function addExercise(ex: Exercise) {
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
  }

  return (
    <div className="animate-[fadeInUp_0.3s_ease-out_both] space-y-4">
      {/* Sticky top metrics bar */}
      <div className="liquid-glass sticky top-16 z-40 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Active Session</p>
            </div>
            <h2 className="truncate text-base font-extrabold tracking-tight text-white mt-0.5">{dayTitle}</h2>
          </div>
          <div className="flex items-center gap-4 shrink-0">
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
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent via-fuchsia-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3.5">
        {tracked.map((ex, exIdx) => {
          const exDone = ex.trackedSets.length > 0 && ex.trackedSets.every((s) => s.completed);
          return (
            <div
              key={exIdx}
              className={`liquid-glass overflow-hidden rounded-2xl transition-all duration-300 ${
                exDone ? "border-emerald-500/30 bg-emerald-950/10" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      exDone
                        ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                        : "bg-purple-500/15 text-purple-300"
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
                  <h3 className={`truncate text-sm font-semibold ${exDone ? "text-emerald-300" : "text-white"}`}>
                    {ex.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="liquid-pill rounded-lg px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {ex.trackedSets.filter((s) => s.completed).length}/{ex.trackedSets.length} sets
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExercise(exIdx)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Remove"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/[0.04]">
                <div className="grid grid-cols-[38px_1fr_1fr_36px] items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <span>Set</span>
                  <span>Weight (lbs)</span>
                  <span>Reps</span>
                  <span className="text-center">Done</span>
                </div>
                {ex.trackedSets.map((set, si) => (
                  <div
                    key={si}
                    className={`grid grid-cols-[38px_1fr_1fr_36px] items-center gap-2 px-4 py-2 transition-colors ${
                      set.completed ? "bg-emerald-500/[0.06]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className={`text-xs font-bold tabular-nums ${set.completed ? "text-emerald-400" : "text-slate-400"}`}>
                      {si + 1}
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="—"
                      value={set.weight}
                      onChange={(e) => updateSet(exIdx, si, "weight", e.target.value)}
                      className={`liquid-input w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-all focus:outline-none ${
                        set.completed ? "text-emerald-300 border-emerald-500/30" : "text-white"
                      }`}
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder={set.targetReps}
                        value={set.actualReps}
                        onChange={(e) => updateSet(exIdx, si, "actualReps", e.target.value)}
                        className={`liquid-input w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-all focus:outline-none ${
                          set.completed ? "text-emerald-300 border-emerald-500/30" : "text-white"
                        }`}
                      />
                    </div>
                    <div className="flex justify-center">
                      <SetCheckbox checked={set.completed} onChange={() => updateSet(exIdx, si, "completed", !set.completed)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <AddExerciseInline onAdd={addExercise} />
      </div>

      {/* Sticky finish button */}
      <div className="sticky bottom-0 z-40 pt-2 pb-4">
        <div className="liquid-glass rounded-2xl p-2.5">
          <button
            type="button"
            onClick={onFinish}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98]"
            style={{ animation: "success-glow 3s ease-in-out infinite" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Complete Workout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Workout Summary Modal (NO EMOJIS)
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
        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: "Sets Finished",
      value: `${completedSets.length}`,
      icon: (
        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: "Total Volume",
      value: `${totalVolume.toLocaleString()} lbs`,
      icon: (
        <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-.75m0-10.5v10.5m0-10.5H4.5a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h2.25m10.5-10.5h-.75a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h.75m0-10.5v10.5m0-10.5h2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-2.25M12 6v12" />
        </svg>
      ),
    },
    {
      label: "Est. Energy",
      value: `${estimatedCalories} kcal`,
      icon: (
        <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.25s ease-out" }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div
        className="liquid-glass relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8"
        style={{ animation: "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        <div className="text-center pt-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 shadow-[0_0_25px_rgba(52,211,153,0.25)] border border-emerald-500/30">
            <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Workout Complete</h2>
          <p className="mt-1 text-xs text-slate-400">{dayTitle}</p>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          {stats.map((s, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-3.5 text-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] mb-1.5">
                {s.icon}
              </div>
              <p className="text-lg font-bold tracking-tight text-white">{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Exercise breakdown */}
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
                  <span className={`font-mono font-bold ${done === ex.trackedSets.length ? "text-emerald-400" : "text-slate-400"}`}>
                    {done}/{ex.trackedSets.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip Jar (NO EMOJI) */}
        <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-5 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
          className="liquid-glass liquid-glass-interactive mt-6 flex w-full items-center justify-center rounded-xl py-3 text-xs font-bold text-white transition-all active:scale-[0.98]"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Create Template Modal (NO EMOJI)
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div
        className="liquid-glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-2xl"
        style={{ animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        
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
            className="flex-1 rounded-xl bg-accent py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover disabled:opacity-40"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ╔═══════════════════════════════════════════════════════════╗
   ║                      MAIN DASHBOARD                      ║
   ╚═══════════════════════════════════════════════════════════╝
   ═══════════════════════════════════════════════════════════════ */
type AppPhase = "home" | "tracking" | "summary";
type HomeTab = "ai" | "quick" | "templates";

export default function Home() {
  /* ── Tab & Form state ─────────────────── */
  const [tab, setTab] = useState<HomeTab>("ai");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startFromTemplate(template: WorkoutTemplate) {
    setWorkoutTitle(template.name);
    setTrackedExercises(exercisesToTracked(template.exercises));
    setPhase("tracking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function quickStart() {
    setWorkoutTitle("Quick Session");
    setTrackedExercises([]);
    setPhase("tracking");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ═══════════════════════════════════════════════════════════════
     Tabs Configuration (NO EMOJI)
     ═══════════════════════════════════════════════════════════════ */
  const TABS: { key: HomeTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "ai",
      label: "AI Studio",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
        </svg>
      ),
    },
    {
      key: "quick",
      label: "Quick Start",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
    },
    {
      key: "templates",
      label: "Templates",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <LiquidBackground />

      {/* ── Top Navigation with Live Clock ──── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050508]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={phase !== "home" ? resetHome : undefined}
            className="flex items-center gap-2.5 text-base font-extrabold tracking-tight group"
          >
            <span className="liquid-pill flex h-8 w-8 items-center justify-center rounded-xl text-accent transition-transform group-hover:scale-105">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-.75m0-10.5v10.5m0-10.5H4.5a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h2.25m10.5-10.5h-.75a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h.75m0-10.5v10.5m0-10.5h2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-2.25M12 6v12" />
              </svg>
            </span>
            <span className="text-white">
              Forma<span className="text-accent font-black">.AI</span>
            </span>
          </button>

          {/* Center Date & Time widget */}
          <div className="hidden md:flex items-center">
            <LiveDateTime />
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <LiveDateTime />
            </div>
            {phase === "tracking" ? (
              <div className="liquid-pill flex items-center gap-2 rounded-full px-3 py-1 text-emerald-400 border-emerald-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Tracking</span>
              </div>
            ) : (
              <div className="liquid-pill flex items-center gap-2 rounded-full px-3 py-1 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-[11px] font-semibold text-slate-300">Ready</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main Content ────────────────────── */}
      <main className="mx-auto flex max-w-6xl flex-1 flex-col px-4 pb-16 pt-6 sm:px-6">
        {phase === "home" && (
          <>
            {/* Header / Hero */}
            <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row sm:py-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300 mb-2">
                  <span>Intelligent Performance</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Forma <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Workout Studio</span>
                </h1>
              </div>

              {/* Liquid Glass Tab Switcher */}
              <div className="liquid-glass rounded-2xl p-1.5 flex gap-1 border-white/10">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      tab === t.key
                        ? "bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 text-white shadow-lg shadow-purple-500/20 border border-white/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── TAB 1: AI GENERATOR (Compact 2-Column) ─── */}
            {tab === "ai" && (
              <div className="mt-6 grid gap-6 lg:grid-cols-12 items-start">
                {/* Form Column */}
                <form id="workout-form" onSubmit={handleGenerate} className="lg:col-span-5">
                  <div className="liquid-glass relative overflow-hidden rounded-3xl p-6 shadow-2xl">
                    <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="liquid-pill flex h-7 w-7 items-center justify-center rounded-xl text-purple-300">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                          </svg>
                        </span>
                        <h2 className="text-sm font-extrabold text-white">Generate Routine</h2>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Groq LLM</span>
                    </div>

                    <div className="space-y-4">
                      <SelectField id="fitness-goal" label="Target Goal" value={goal} onChange={setGoal} options={FITNESS_GOALS} placeholder="Select fitness goal…" />
                      <SelectField id="experience-level" label="Experience Level" value={experience} onChange={setExperience} options={EXPERIENCE_LEVELS} placeholder="Select experience…" />
                      <SelectField id="equipment" label="Equipment Available" value={equipment} onChange={setEquipment} options={EQUIPMENT_OPTIONS} placeholder="Select equipment…" />
                    </div>

                    <button
                      type="submit"
                      disabled={!isReady || loading}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl transition-all hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-40 active:scale-[0.98]"
                      style={isReady && !loading ? { animation: "pulse-glow 3s ease-in-out infinite" } : undefined}
                    >
                      {loading ? (
                        <>
                          <Spinner className="h-4 w-4" /> Synthesizing Plan…
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                          </svg>
                          Build 3-Day Plan
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Live Plan Column */}
                <div className="lg:col-span-7 space-y-4">
                  {error && (
                    <div className="liquid-glass flex items-start gap-3 rounded-2xl border-red-500/30 bg-red-950/20 p-4 text-xs">
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
                    <div className="liquid-glass rounded-3xl p-8">
                      <div className="flex items-center gap-3">
                        <Spinner className="h-5 w-5 text-accent" />
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
                    <div className="space-y-3 animate-[fadeInUp_0.3s_ease-out_both]">
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Custom 3-Day Plan Generated</p>
                        <span className="text-[10px] text-slate-400">Tap a day to begin</span>
                      </div>
                      {plan.map((day, i) => (
                        <button
                          key={i}
                          onClick={() => startFromPlan(i)}
                          className="liquid-glass liquid-glass-interactive group w-full overflow-hidden rounded-2xl p-5 text-left transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="liquid-pill rounded-lg px-2.5 py-1 text-xs font-bold text-purple-300 border-purple-500/30">
                              {day.day}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                              <span>Start Workout</span>
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
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
                      <div className="liquid-pill flex h-14 w-14 items-center justify-center rounded-2xl text-purple-300 mb-3">
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
            )}

            {/* ─── TAB 2: QUICK START ─── */}
            {tab === "quick" && (
              <div className="mt-8 flex flex-col items-center animate-[fadeInUp_0.3s_ease-out_both]">
                <div className="w-full max-w-lg space-y-6">
                  <button
                    onClick={quickStart}
                    className="liquid-glass liquid-glass-interactive group flex w-full items-center gap-5 rounded-3xl p-6 text-left"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-xl shadow-purple-500/25 transition-transform group-hover:scale-105">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Start Empty Workout</h3>
                      <p className="mt-0.5 text-xs text-slate-400">Freely add and track exercises as you train</p>
                    </div>
                    <svg className="ml-auto h-5 w-5 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
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
                          <span className="liquid-pill inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-300 mb-2">
                            {t.category}
                          </span>
                          <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{t.name}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{t.exercises.length} exercises</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: TEMPLATES ─── */}
            {tab === "templates" && (
              <div className="mt-6 space-y-8 animate-[fadeInUp_0.3s_ease-out_both]">
                {/* User Templates */}
                <div>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div>
                      <h3 className="text-sm font-extrabold text-white">My Saved Templates</h3>
                      <p className="text-xs text-slate-400">Custom workout routines stored in your browser</p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:from-purple-500 hover:to-fuchsia-500 active:scale-[0.98]"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Create Template
                    </button>
                  </div>

                  {userTemplates.length === 0 ? (
                    <div className="liquid-glass flex items-center gap-4 rounded-3xl p-6">
                      <div className="liquid-pill flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-purple-300">
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
                            <span className="liquid-pill inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
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

                {/* Example Templates */}
                <div>
                  <div className="mb-3 px-1">
                    <h3 className="text-sm font-extrabold text-white">Preset Templates</h3>
                    <p className="text-xs text-slate-400">Battle-tested routines ready to track</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {EXAMPLE_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => startFromTemplate(t)}
                        className="liquid-glass liquid-glass-interactive group overflow-hidden rounded-2xl p-4 text-left transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="liquid-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-300">
                            {t.category}
                          </span>
                          <span className="text-[10px] font-bold text-purple-300 opacity-0 transition-opacity group-hover:opacity-100">
                            Start →
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{t.name}</p>
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
              elapsedSeconds={elapsedSeconds}
            />
          </div>
        )}
      </main>

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

      {/* Footer */}
      {phase === "home" && (
        <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Forma.AI — Intelligent Fitness Experience
        </footer>
      )}
    </>
  );
}
