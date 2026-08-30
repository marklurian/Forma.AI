"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
interface Exercise { name: string; sets: number; reps: string; }
interface WorkoutDay { day: string; exercises: Exercise[]; }
interface TrackedSet { targetReps: string; weight: string; actualReps: string; completed: boolean; }
interface TrackedExercise { name: string; trackedSets: TrackedSet[]; }
interface WorkoutTemplate { id: string; name: string; icon: string; exercises: Exercise[]; isExample?: boolean; }

/* ═══════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════ */
const FITNESS_GOALS = ["Lose Weight", "Build Muscle", "Get Lean", "Strength"] as const;
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const EQUIPMENT_OPTIONS = ["Full Gym", "Dumbbells Only", "Bodyweight"] as const;

const EXAMPLE_TEMPLATES: WorkoutTemplate[] = [
  { id: "ex-push", name: "Push Day", icon: "🫸", isExample: true, exercises: [
    { name: "Barbell Bench Press", sets: 4, reps: "8-10" },
    { name: "Overhead Press", sets: 3, reps: "8-10" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
    { name: "Lateral Raises", sets: 3, reps: "12-15" },
    { name: "Tricep Pushdowns", sets: 3, reps: "12-15" },
    { name: "Overhead Tricep Extension", sets: 3, reps: "10-12" },
  ]},
  { id: "ex-pull", name: "Pull Day", icon: "💪", isExample: true, exercises: [
    { name: "Barbell Rows", sets: 4, reps: "8-10" },
    { name: "Pull-Ups", sets: 3, reps: "6-10" },
    { name: "Seated Cable Rows", sets: 3, reps: "10-12" },
    { name: "Face Pulls", sets: 3, reps: "15-20" },
    { name: "Barbell Curls", sets: 3, reps: "10-12" },
    { name: "Hammer Curls", sets: 3, reps: "10-12" },
  ]},
  { id: "ex-legs", name: "Leg Day", icon: "🦵", isExample: true, exercises: [
    { name: "Barbell Squat", sets: 4, reps: "6-8" },
    { name: "Romanian Deadlift", sets: 4, reps: "8-10" },
    { name: "Leg Press", sets: 3, reps: "10-12" },
    { name: "Walking Lunges", sets: 3, reps: "12 each" },
    { name: "Leg Curl", sets: 3, reps: "12-15" },
    { name: "Calf Raises", sets: 4, reps: "15-20" },
  ]},
  { id: "ex-upper", name: "Upper Body", icon: "🏋️", isExample: true, exercises: [
    { name: "Bench Press", sets: 4, reps: "8-10" },
    { name: "Barbell Rows", sets: 4, reps: "8-10" },
    { name: "Overhead Press", sets: 3, reps: "10-12" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12" },
    { name: "Dumbbell Flyes", sets: 3, reps: "12-15" },
    { name: "Bicep Curls", sets: 3, reps: "10-12" },
  ]},
  { id: "ex-full", name: "Full Body", icon: "⚡", isExample: true, exercises: [
    { name: "Deadlift", sets: 3, reps: "5-6" },
    { name: "Bench Press", sets: 3, reps: "8-10" },
    { name: "Squat", sets: 3, reps: "8-10" },
    { name: "Pull-Ups", sets: 3, reps: "6-10" },
    { name: "Overhead Press", sets: 3, reps: "8-10" },
    { name: "Plank", sets: 3, reps: "45-60s" },
  ]},
  { id: "ex-hiit", name: "HIIT Cardio", icon: "🔥", isExample: true, exercises: [
    { name: "Burpees", sets: 4, reps: "30s" },
    { name: "Jump Squats", sets: 4, reps: "30s" },
    { name: "Mountain Climbers", sets: 4, reps: "30s" },
    { name: "High Knees", sets: 4, reps: "30s" },
    { name: "Box Jumps", sets: 3, reps: "12" },
    { name: "Battle Ropes", sets: 3, reps: "30s" },
  ]},
];

/* ═══════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════ */
function formatTime(s: number) { const m = Math.floor(s / 60); return `${m}:${(s % 60).toString().padStart(2, "0")}`; }
function formatTimeLong(s: number) { const m = Math.floor(s / 60); return m === 0 ? `${s}s` : `${m}m ${s % 60}s`; }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function exercisesToTracked(exercises: Exercise[]): TrackedExercise[] {
  return exercises.map((ex) => ({
    name: ex.name,
    trackedSets: Array.from({ length: ex.sets }, () => ({
      targetReps: ex.reps, weight: "", actualReps: "", completed: false,
    })),
  }));
}

/* localStorage helpers for templates */
function loadUserTemplates(): WorkoutTemplate[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("forma-templates") || "[]"); }
  catch { return []; }
}
function saveUserTemplates(t: WorkoutTemplate[]) {
  localStorage.setItem("forma-templates", JSON.stringify(t));
}

/* ═══════════════════════════════════════════════════════════════
   Background
   ═══════════════════════════════════════════════════════════════ */
function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[8%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)]" />
      <div className="absolute right-[10%] top-[55%] h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.04)_0%,transparent_70%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Small Reusable Components
   ═══════════════════════════════════════════════════════════════ */
function SelectField({ id, label, value, onChange, options, placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  options: readonly string[]; placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2.5 pr-9 text-sm text-foreground transition-all hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function SetCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`group flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
        checked ? "border-emerald-500 bg-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.3)]" : "border-border bg-surface hover:border-muted"
      }`}>
      {checked && (
        <svg className="h-4 w-4 text-emerald-400" style={{ animation: "checkPop 0.3s ease-out" }} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Add Exercise Inline Form
   ═══════════════════════════════════════════════════════════════ */
function AddExerciseInline({ onAdd }: { onAdd: (ex: Exercise) => void }) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [open, setOpen] = useState(false);

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), sets: parseInt(sets) || 3, reps: reps || "10" });
    setName(""); setSets("3"); setReps("10"); setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted transition-all hover:border-accent/40 hover:text-accent">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Exercise
      </button>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 animate-[fadeInUp_0.2s_ease-out_both]">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Exercise name…"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        autoFocus onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[9px] font-semibold uppercase tracking-widest text-muted">Sets</label>
          <input type="number" value={sets} onChange={(e) => setSets(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none" />
        </div>
        <div className="flex-1">
          <label className="text-[9px] font-semibold uppercase tracking-widest text-muted">Reps</label>
          <input value={reps} onChange={(e) => setReps(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none" />
        </div>
        <button type="button" onClick={handleAdd} disabled={!name.trim()}
          className="mt-4 rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover disabled:opacity-40">
          Add
        </button>
        <button type="button" onClick={() => setOpen(false)}
          className="mt-4 rounded-lg px-3 py-1.5 text-sm text-muted hover:text-foreground">
          ✕
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Active Workout Tracker
   ═══════════════════════════════════════════════════════════════ */
function ActiveWorkout({ dayTitle, tracked, setTracked, onFinish, elapsedSeconds }: {
  dayTitle: string; tracked: TrackedExercise[];
  setTracked: React.Dispatch<React.SetStateAction<TrackedExercise[]>>;
  onFinish: () => void; elapsedSeconds: number;
}) {
  const totalSets = tracked.reduce((sum, ex) => sum + ex.trackedSets.length, 0);
  const completedSets = tracked.reduce((sum, ex) => sum + ex.trackedSets.filter((s) => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const updateSet = useCallback((exIdx: number, setIdx: number, field: keyof TrackedSet, value: string | boolean) => {
    setTracked((prev) => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex, trackedSets: ex.trackedSets.map((s, si) => si !== setIdx ? s : { ...s, [field]: value }),
    }));
  }, [setTracked]);

  function removeExercise(exIdx: number) {
    setTracked((prev) => prev.filter((_, i) => i !== exIdx));
  }

  function addExercise(ex: Exercise) {
    const newTracked: TrackedExercise = {
      name: ex.name,
      trackedSets: Array.from({ length: ex.sets }, () => ({
        targetReps: ex.reps, weight: "", actualReps: "", completed: false,
      })),
    };
    setTracked((prev) => [...prev, newTracked]);
  }

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out_both]">
      {/* Sticky header */}
      <div className="glass-card sticky top-16 z-40 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">Active Workout</p>
            <h2 className="truncate text-base font-bold tracking-tight">{dayTitle}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="font-mono text-base font-bold tabular-nums">{formatTime(elapsedSeconds)}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted">Time</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold">{completedSets}<span className="text-muted text-xs">/{totalSets}</span></p>
              <p className="text-[9px] uppercase tracking-wider text-muted">Sets</p>
            </div>
          </div>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Exercise cards */}
      <div className="space-y-3">
        {tracked.map((ex, exIdx) => {
          const exDone = ex.trackedSets.every((s) => s.completed);
          return (
            <div key={exIdx} className={`glass-card overflow-hidden rounded-2xl transition-all duration-300 ${exDone ? "border-emerald-500/20" : ""}`}>
              <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${exDone ? "bg-emerald-500/15 text-emerald-400" : "bg-accent/10 text-accent"}`}>
                    {exDone ? "✓" : exIdx + 1}
                  </span>
                  <h3 className={`truncate text-sm font-semibold ${exDone ? "text-emerald-300" : ""}`}>{ex.name}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-md bg-border/50 px-1.5 py-0.5 text-[9px] font-medium text-muted">{ex.trackedSets.filter(s => s.completed).length}/{ex.trackedSets.length}</span>
                  <button type="button" onClick={() => removeExercise(exIdx)} className="text-muted/50 hover:text-red-400 transition-colors" title="Remove">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="divide-y divide-white/[0.03]">
                <div className="grid grid-cols-[36px_1fr_1fr_32px] items-center gap-1.5 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                  <span>Set</span><span>Weight</span><span>Reps</span><span className="text-center">✓</span>
                </div>
                {ex.trackedSets.map((set, si) => (
                  <div key={si} className={`grid grid-cols-[36px_1fr_1fr_32px] items-center gap-1.5 px-4 py-2 transition-colors ${set.completed ? "bg-emerald-500/[0.04]" : "hover:bg-white/[0.015]"}`}>
                    <span className={`text-xs font-semibold tabular-nums ${set.completed ? "text-emerald-400" : "text-muted"}`}>{si + 1}</span>
                    <input type="number" inputMode="decimal" placeholder="—" value={set.weight} onChange={(e) => updateSet(exIdx, si, "weight", e.target.value)}
                      className={`w-full rounded-lg border px-2.5 py-1.5 text-xs font-medium tabular-nums transition-all focus:outline-none focus:ring-1 ${set.completed ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300 focus:ring-emerald-500/20" : "border-border bg-background text-foreground focus:ring-accent/20"}`} />
                    <div className="flex items-center gap-1">
                      <input type="number" inputMode="numeric" placeholder={set.targetReps} value={set.actualReps} onChange={(e) => updateSet(exIdx, si, "actualReps", e.target.value)}
                        className={`w-full rounded-lg border px-2.5 py-1.5 text-xs font-medium tabular-nums transition-all focus:outline-none focus:ring-1 ${set.completed ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300 focus:ring-emerald-500/20" : "border-border bg-background text-foreground focus:ring-accent/20"}`} />
                    </div>
                    <div className="flex justify-center"><SetCheckbox checked={set.completed} onChange={() => updateSet(exIdx, si, "completed", !set.completed)} /></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <AddExerciseInline onAdd={addExercise} />
      </div>

      {/* Sticky finish */}
      <div className="sticky bottom-0 z-40 mt-4 pb-4">
        <div className="glass-card rounded-2xl p-2.5">
          <button type="button" onClick={onFinish}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98]"
            style={{ animation: "success-glow 3s ease-in-out infinite" }}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Workout Summary Modal (kept from previous, condensed)
   ═══════════════════════════════════════════════════════════════ */
function WorkoutSummary({ dayTitle, trackedExercises, elapsedSeconds, onClose }: {
  dayTitle: string; trackedExercises: TrackedExercise[]; elapsedSeconds: number; onClose: () => void;
}) {
  const completedSets = trackedExercises.flatMap((ex) => ex.trackedSets).filter((s) => s.completed);
  const totalVolume = completedSets.reduce((sum, s) => {
    const w = parseFloat(s.weight) || 0;
    const r = parseInt(s.actualReps) || parseInt(s.targetReps) || 0;
    return sum + w * r;
  }, 0);
  const estimatedCalories = Math.round(totalVolume * 0.05 + elapsedSeconds * 0.12);
  const stats = [
    { label: "Total Time", value: formatTimeLong(elapsedSeconds), icon: "🕐" },
    { label: "Sets Done", value: `${completedSets.length}`, icon: "💪" },
    { label: "Volume", value: `${totalVolume.toLocaleString()} lbs`, icon: "🏋️" },
    { label: "Calories", value: `${estimatedCalories} kcal`, icon: "🔥" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0c0c12] shadow-2xl" style={{ animation: "scaleIn 0.4s ease-out" }}>
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-3 overflow-hidden py-2">
          {["🎉", "💪", "⭐", "🔥", "🏆"].map((e, i) => <span key={i} className="text-xl" style={{ animation: `confetti-fall 1.5s ease-out ${i * 0.15}s both` }}>{e}</span>)}
        </div>
        <div className="p-6 pt-12 sm:p-8 sm:pt-14">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
              <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Workout Complete!</h2>
            <p className="mt-1 text-sm text-muted">{dayTitle}</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {stats.map((s, i) => (
              <div key={i} className="glass-card rounded-xl p-3 text-center" style={{ animation: `fadeInUp 0.4s ease-out ${0.15 + i * 0.08}s both` }}>
                <span className="text-xl">{s.icon}</span>
                <p className="mt-1 text-base font-bold">{s.value}</p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Exercises</h3>
            <div className="space-y-1.5">
              {trackedExercises.map((ex, i) => {
                const done = ex.trackedSets.filter(s => s.completed).length;
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className={done > 0 ? "" : "text-muted line-through"}>{ex.name}</span>
                    <span className={`font-mono text-xs font-semibold ${done === ex.trackedSets.length ? "text-emerald-400" : "text-muted"}`}>{done}/{ex.trackedSets.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Tip Jar */}
          <div className="mt-6 rounded-2xl border border-accent/15 bg-accent/[0.04] p-5 text-center">
            <h3 className="text-lg font-bold tracking-tight">Buy me a protein shake 🥤</h3>
            <div className="mx-auto mt-3 w-44 overflow-hidden rounded-xl border border-white/10 shadow-lg">
              <Image src="/qr-code.jpg" alt="QR code for donations" width={176} height={176} className="h-auto w-full" />
            </div>
            <p className="mt-2.5 text-xs text-muted">Scan with GCash, Maya, or any bank app to support!</p>
          </div>
          <button type="button" onClick={onClose} className="mt-5 flex w-full items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold transition-all hover:bg-surface-hover active:scale-[0.98]">Back to Home</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Create Template Modal
   ═══════════════════════════════════════════════════════════════ */
function CreateTemplateModal({ onSave, onClose }: { onSave: (t: WorkoutTemplate) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  function addEx(ex: Exercise) { setExercises((prev) => [...prev, ex]); }
  function removeEx(idx: number) { setExercises((prev) => prev.filter((_, i) => i !== idx)); }

  function handleSave() {
    if (!name.trim() || exercises.length === 0) return;
    onSave({ id: uid(), name: name.trim(), icon: "📋", exercises });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0c0c12] shadow-2xl" style={{ animation: "scaleIn 0.3s ease-out" }}>
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="p-6">
          <h2 className="text-lg font-bold tracking-tight">Create Template</h2>
          <p className="mt-1 text-xs text-muted">Build a reusable workout template</p>

          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name…"
            className="mt-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" autoFocus />

          <div className="mt-4 space-y-2">
            {exercises.map((ex, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-surface/50 px-3 py-2 text-sm">
                <span>{ex.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{ex.sets}×{ex.reps}</span>
                  <button type="button" onClick={() => removeEx(i)} className="text-red-400/60 hover:text-red-400">✕</button>
                </div>
              </div>
            ))}
            <AddExerciseInline onAdd={addEx} />
          </div>

          <div className="mt-5 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-all hover:bg-surface-hover">Cancel</button>
            <button type="button" onClick={handleSave} disabled={!name.trim() || exercises.length === 0}
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-accent-hover disabled:opacity-40">Save Template</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ╔═══════════════════════════════════════════════════════════╗
   ║                      MAIN PAGE                           ║
   ╚═══════════════════════════════════════════════════════════╝
   ═══════════════════════════════════════════════════════════════ */
type AppPhase = "home" | "tracking" | "summary";
type HomeTab = "ai" | "quick" | "templates";

export default function Home() {
  /* ── Home / Form ──────────────────────── */
  const [tab, setTab] = useState<HomeTab>("ai");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [equipment, setEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WorkoutDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ── Templates ────────────────────────── */
  const [userTemplates, setUserTemplates] = useState<WorkoutTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => { setUserTemplates(loadUserTemplates()); }, []);

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

  /* ── Tracking ─────────────────────────── */
  const [phase, setPhase] = useState<AppPhase>("home");
  const [workoutTitle, setWorkoutTitle] = useState("Workout");
  const [trackedExercises, setTrackedExercises] = useState<TrackedExercise[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isReady = goal !== "" && experience !== "" && equipment !== "";

  useEffect(() => {
    if (phase === "tracking") {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  /* ── Actions ──────────────────────────── */
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!isReady || loading) return;
    setLoading(true); setError(null); setPlan(null);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goal, experience, equipment }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (!data.plan || !Array.isArray(data.plan)) throw new Error("Unexpected AI response");
      setPlan(data.plan);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to generate"); }
    finally { setLoading(false); }
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
    setWorkoutTitle("Quick Workout");
    setTrackedExercises([]);
    setPhase("tracking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishWorkout() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("summary");
  }

  function resetHome() {
    setPhase("home"); setPlan(null); setTrackedExercises([]); setElapsedSeconds(0);
    setGoal(""); setExperience(""); setEquipment("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ════════════════════ RENDER ════════════════════ */
  const TABS: { key: HomeTab; label: string; icon: React.ReactNode }[] = [
    { key: "ai", label: "AI Generate", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg> },
    { key: "quick", label: "Quick Start", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg> },
    { key: "templates", label: "Templates", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg> },
  ];

  return (
    <>
      <GridBackground />

      {/* ── Nav ──────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#06060a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <button onClick={phase !== "home" ? resetHome : undefined} className="flex items-center gap-2 text-base font-bold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
              <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-.75m0-10.5v10.5m0-10.5H4.5a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h2.25m10.5-10.5h-.75a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h.75m0-10.5v10.5m0-10.5h2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-2.25M12 6v12" /></svg>
            </span>
            <span>Forma<span className="text-accent">.AI</span></span>
          </button>
          {phase === "tracking" ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
              <span className="text-[11px] font-semibold text-emerald-400">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
              <span className="text-[11px] font-medium text-muted">AI Online</span>
            </div>
          )}
        </div>
      </nav>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col px-4 pb-16">

        {/* ══════════════ HOME PHASE ══════════════ */}
        {phase === "home" && (
          <>
            {/* Compact hero */}
            <div className="pt-8 pb-2 text-center sm:pt-10">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Train Smarter, <span className="bg-gradient-to-r from-accent to-fuchsia-400 bg-clip-text text-transparent">Not Harder</span>
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">Generate AI-powered workouts, quick start an empty session, or pick from templates.</p>
            </div>

            {/* Tab bar */}
            <div className="mt-5 flex gap-1 rounded-xl bg-surface/80 p-1 border border-border/50 self-center">
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${tab === t.key ? "bg-accent/15 text-accent shadow-sm" : "text-muted hover:text-foreground"}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* ─── AI Generate Tab ─── */}
            {tab === "ai" && (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Form */}
                <form id="workout-form" onSubmit={handleGenerate}>
                  <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-6">
                    <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                    <div className="mb-4 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                        <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                      </span>
                      <h2 className="text-sm font-bold tracking-tight">AI Workout Generator</h2>
                    </div>
                    <div className="space-y-4">
                      <SelectField id="fitness-goal" label="Goal" value={goal} onChange={setGoal} options={FITNESS_GOALS} placeholder="Select goal…" />
                      <SelectField id="experience-level" label="Level" value={experience} onChange={setExperience} options={EXPERIENCE_LEVELS} placeholder="Select level…" />
                      <SelectField id="equipment" label="Equipment" value={equipment} onChange={setEquipment} options={EQUIPMENT_OPTIONS} placeholder="Select equipment…" />
                    </div>
                    <button type="submit" disabled={!isReady || loading}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent-hover disabled:opacity-40 active:scale-[0.98]"
                      style={isReady && !loading ? { animation: "pulse-glow 3s ease-in-out infinite" } : undefined}>
                      {loading ? <><Spinner /> Generating…</> : <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>Generate My Workout</>}
                    </button>
                  </div>
                </form>

                {/* Plan results */}
                <div>
                  {error && (
                    <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                      <p className="text-red-400/90">{error}</p>
                      <button onClick={() => setError(null)} className="ml-auto shrink-0 text-red-400/50 hover:text-red-300">✕</button>
                    </div>
                  )}
                  {loading && (
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-2.5"><Spinner /><p className="text-sm text-muted">AI is building your plan…</p></div>
                      <div className="mt-4 space-y-2.5">{[1,2,3].map(i => <div key={i} className="h-3.5 animate-pulse rounded-md bg-border/40" style={{ width: `${85 - i * 14}%` }} />)}</div>
                    </div>
                  )}
                  {plan && !loading && (
                    <div className="space-y-3 animate-[fadeInUp_0.4s_ease-out_both]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Your Plan — Tap to start</p>
                      {plan.map((day, i) => (
                        <button key={i} onClick={() => startFromPlan(i)} className="glass-card group w-full overflow-hidden rounded-xl text-left transition-all hover:border-white/[0.12] hover:shadow-lg">
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="rounded-md bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">{day.day}</span>
                              <span className="text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">Start →</span>
                            </div>
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {day.exercises.map((ex, j) => <span key={j} className="rounded bg-white/[0.04] px-2 py-0.5 text-[11px] text-muted">{ex.name}</span>)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {!plan && !loading && !error && (
                    <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                        <svg className="h-6 w-6 text-accent/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>
                      </div>
                      <p className="mt-3 text-sm text-muted">Your AI-generated plan will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── Quick Start Tab ─── */}
            {tab === "quick" && (
              <div className="mt-6 flex flex-col items-center">
                <div className="w-full max-w-md">
                  <button onClick={quickStart}
                    className="glass-card group flex w-full items-center gap-4 rounded-2xl p-6 text-left transition-all hover:border-white/[0.12] hover:shadow-xl hover:shadow-accent/5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-fuchsia-500 shadow-lg shadow-accent/20 transition-transform group-hover:scale-105">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold tracking-tight">Start Empty Workout</h3>
                      <p className="mt-0.5 text-xs text-muted">Jump in and add exercises as you go</p>
                    </div>
                    <svg className="ml-auto h-5 w-5 text-muted/40 transition-all group-hover:translate-x-1 group-hover:text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </button>

                  <div className="mt-6">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Or start from a template</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {EXAMPLE_TEMPLATES.slice(0, 4).map((t) => (
                        <button key={t.id} onClick={() => startFromTemplate(t)}
                          className="glass-card group rounded-xl p-3.5 text-left transition-all hover:border-white/[0.1]">
                          <span className="text-xl">{t.icon}</span>
                          <p className="mt-1.5 text-sm font-semibold">{t.name}</p>
                          <p className="text-[10px] text-muted">{t.exercises.length} exercises</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Templates Tab ─── */}
            {tab === "templates" && (
              <div className="mt-6 space-y-8">
                {/* My Templates */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold tracking-tight">My Templates</h3>
                    <button onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-all hover:bg-accent/20">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      Create
                    </button>
                  </div>
                  {userTemplates.length === 0 ? (
                    <div className="glass-card flex items-center gap-3 rounded-xl p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-border/40 text-lg">📋</div>
                      <div>
                        <p className="text-sm font-medium">No templates yet</p>
                        <p className="text-xs text-muted">Create your first custom workout template</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {userTemplates.map((t) => (
                        <div key={t.id} className="glass-card group relative overflow-hidden rounded-xl transition-all hover:border-white/[0.1]">
                          <button onClick={() => startFromTemplate(t)} className="w-full p-4 text-left">
                            <span className="text-xl">{t.icon}</span>
                            <p className="mt-1.5 text-sm font-semibold">{t.name}</p>
                            <p className="text-[10px] text-muted">{t.exercises.length} exercises • {t.exercises.reduce((s, e) => s + e.sets, 0)} sets</p>
                            <div className="mt-2 flex flex-wrap gap-1">{t.exercises.slice(0, 3).map((e, i) => <span key={i} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted">{e.name}</span>)}
                              {t.exercises.length > 3 && <span className="text-[10px] text-muted">+{t.exercises.length - 3}</span>}
                            </div>
                          </button>
                          <button onClick={() => deleteTemplate(t.id)} className="absolute right-2 top-2 rounded-md p-1 text-muted/30 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100" title="Delete">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Example Templates */}
                <div>
                  <h3 className="mb-3 text-sm font-bold tracking-tight">Example Templates</h3>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {EXAMPLE_TEMPLATES.map((t) => (
                      <button key={t.id} onClick={() => startFromTemplate(t)}
                        className="glass-card group overflow-hidden rounded-xl p-4 text-left transition-all hover:border-white/[0.1] hover:shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{t.icon}</span>
                          <span className="text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">Start →</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold">{t.name}</p>
                        <p className="text-[10px] text-muted">{t.exercises.length} exercises • {t.exercises.reduce((s, e) => s + e.sets, 0)} sets</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {t.exercises.map((e, i) => <span key={i} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted">{e.name}</span>)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════ TRACKING PHASE ══════════════ */}
        {phase === "tracking" && (
          <div className="mx-auto mt-4 w-full max-w-2xl">
            <ActiveWorkout dayTitle={workoutTitle} tracked={trackedExercises} setTracked={setTrackedExercises} onFinish={finishWorkout} elapsedSeconds={elapsedSeconds} />
          </div>
        )}
      </main>

      {/* ══════════════ SUMMARY MODAL ══════════════ */}
      {phase === "summary" && (
        <WorkoutSummary dayTitle={workoutTitle} trackedExercises={trackedExercises} elapsedSeconds={elapsedSeconds} onClose={resetHome} />
      )}

      {/* ══════════════ CREATE TEMPLATE MODAL ══════════════ */}
      {showCreateModal && <CreateTemplateModal onSave={saveTemplate} onClose={() => setShowCreateModal(false)} />}

      {/* Footer */}
      {phase === "home" && (
        <footer className="border-t border-white/[0.04] py-5 text-center text-[11px] text-muted">
          © {new Date().getFullYear()} Forma.AI — AI-powered fitness, built for you.
        </footer>
      )}
    </>
  );
}
