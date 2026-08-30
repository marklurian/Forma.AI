"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

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

/* ═══════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════ */
const FITNESS_GOALS = ["Lose Weight", "Build Muscle", "Get Lean", "Strength"] as const;
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const EQUIPMENT_OPTIONS = ["Full Gym", "Dumbbells Only", "Bodyweight"] as const;

const DAY_COLORS = [
  { accent: "from-violet-500 to-purple-600", badge: "bg-violet-500/15 text-violet-400 border-violet-500/25", ring: "ring-violet-500/30" },
  { accent: "from-cyan-500 to-blue-600", badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25", ring: "ring-cyan-500/30" },
  { accent: "from-amber-500 to-orange-600", badge: "bg-amber-500/15 text-amber-400 border-amber-500/25", ring: "ring-amber-500/30" },
];

/* ═══════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════ */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTimeLong(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

/* ═══════════════════════════════════════════════════════════════
   Decorative Background
   ═══════════════════════════════════════════════════════════════ */
function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[12%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)]" />
      <div className="absolute right-[10%] top-[60%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_70%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Reusable Select
   ═══════════════════════════════════════════════════════════════ */
function SelectField({ id, label, value, onChange, options, placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  options: readonly string[]; placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-xl border border-border bg-surface px-4 py-3.5 pr-10 text-sm text-foreground transition-all duration-200 hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Spinner
   ═══════════════════════════════════════════════════════════════ */
function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Completion Checkbox (satisfying toggle)
   ═══════════════════════════════════════════════════════════════ */
function SetCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`group relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
        checked
          ? "border-emerald-500 bg-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
          : "border-border bg-surface hover:border-muted"
      }`}
    >
      {checked && (
        <svg className="h-4 w-4 text-emerald-400" style={{ animation: "checkPop 0.3s ease-out" }} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      )}
    </button>
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
      setTracked((prev) => {
        const next = prev.map((ex, ei) =>
          ei !== exIdx
            ? ex
            : {
                ...ex,
                trackedSets: ex.trackedSets.map((s, si) =>
                  si !== setIdx ? s : { ...s, [field]: value }
                ),
              }
        );
        return next;
      });
    },
    [setTracked]
  );

  return (
    <div className="animate-[fadeInUp_0.5s_ease-out_both]">
      {/* Header bar */}
      <div className="glass-card sticky top-16 z-40 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">Active Workout</p>
            <h2 className="mt-0.5 text-lg font-bold tracking-tight">{dayTitle}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-lg font-bold tabular-nums text-foreground">{formatTime(elapsedSeconds)}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted">Elapsed</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{completedSets}<span className="text-muted">/{totalSets}</span></p>
              <p className="text-[10px] uppercase tracking-wider text-muted">Sets</p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Exercise cards */}
      <div className="space-y-4">
        {tracked.map((ex, exIdx) => {
          const exCompleted = ex.trackedSets.every((s) => s.completed);
          return (
            <div
              key={exIdx}
              className={`glass-card overflow-hidden rounded-2xl transition-all duration-300 ${
                exCompleted ? "border-emerald-500/20 ring-1 ring-emerald-500/10" : ""
              }`}
              style={{ animationDelay: `${exIdx * 80}ms`, animation: "fadeInUp 0.4s ease-out both" }}
            >
              {/* Exercise header */}
              <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    exCompleted ? "bg-emerald-500/15 text-emerald-400" : "bg-accent/10 text-accent"
                  }`}>
                    {exCompleted ? "✓" : exIdx + 1}
                  </span>
                  <h3 className={`text-sm font-semibold sm:text-base ${exCompleted ? "text-emerald-300" : ""}`}>
                    {ex.name}
                  </h3>
                </div>
                <span className="rounded-md bg-border/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                  {ex.trackedSets.filter((s) => s.completed).length}/{ex.trackedSets.length} sets
                </span>
              </div>

              {/* Set rows */}
              <div className="divide-y divide-white/[0.03]">
                {/* Column headers */}
                <div className="grid grid-cols-[40px_1fr_1fr_36px] items-center gap-2 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted sm:grid-cols-[50px_1fr_1fr_40px]">
                  <span>Set</span>
                  <span>Weight (lbs)</span>
                  <span>Reps</span>
                  <span className="text-center">Done</span>
                </div>
                {ex.trackedSets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`grid grid-cols-[40px_1fr_1fr_36px] items-center gap-2 px-5 py-2.5 transition-colors duration-200 sm:grid-cols-[50px_1fr_1fr_40px] ${
                      set.completed ? "bg-emerald-500/[0.04]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Set number */}
                    <span className={`text-sm font-semibold tabular-nums ${set.completed ? "text-emerald-400" : "text-muted"}`}>
                      {setIdx + 1}
                    </span>

                    {/* Weight input */}
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="—"
                      value={set.weight}
                      onChange={(e) => updateSet(exIdx, setIdx, "weight", e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-sm font-medium tabular-nums transition-all duration-200 focus:outline-none focus:ring-2 ${
                        set.completed
                          ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300 focus:ring-emerald-500/20"
                          : "border-border bg-background text-foreground focus:border-accent focus:ring-accent/20"
                      }`}
                    />

                    {/* Reps input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder={set.targetReps}
                        value={set.actualReps}
                        onChange={(e) => updateSet(exIdx, setIdx, "actualReps", e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm font-medium tabular-nums transition-all duration-200 focus:outline-none focus:ring-2 ${
                          set.completed
                            ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300 focus:ring-emerald-500/20"
                            : "border-border bg-background text-foreground focus:border-accent focus:ring-accent/20"
                        }`}
                      />
                      <span className="hidden text-[10px] text-muted sm:block">/{set.targetReps}</span>
                    </div>

                    {/* Checkbox */}
                    <div className="flex justify-center">
                      <SetCheckbox
                        checked={set.completed}
                        onChange={() => updateSet(exIdx, setIdx, "completed", !set.completed)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky finish button */}
      <div className="sticky bottom-0 z-40 mt-6 pb-6">
        <div className="glass-card rounded-2xl p-3">
          <button
            id="finish-workout-button"
            type="button"
            onClick={() => onFinish()}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-[0.98]"
            style={{ animation: "success-glow 3s ease-in-out infinite" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Workout Summary Modal
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
  // Calculate stats
  const completedSets = trackedExercises.flatMap((ex) => ex.trackedSets).filter((s) => s.completed);
  const totalVolume = completedSets.reduce((sum, s) => {
    const w = parseFloat(s.weight) || 0;
    const r = parseInt(s.actualReps) || parseInt(s.targetReps) || 0;
    return sum + w * r;
  }, 0);
  const estimatedCalories = Math.round(totalVolume * 0.05 + elapsedSeconds * 0.12);
  const totalExercises = trackedExercises.length;
  const exercisesCompleted = trackedExercises.filter((ex) => ex.trackedSets.some((s) => s.completed)).length;

  const stats = [
    { label: "Total Time", value: formatTimeLong(elapsedSeconds), icon: "🕐" },
    { label: "Sets Completed", value: `${completedSets.length}`, icon: "💪" },
    { label: "Total Volume", value: `${totalVolume.toLocaleString()} lbs`, icon: "🏋️" },
    { label: "Est. Calories", value: `${estimatedCalories} kcal`, icon: "🔥" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0c0c12] shadow-2xl shadow-black/50"
        style={{ animation: "scaleIn 0.4s ease-out" }}
      >
        {/* Top glow */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Confetti decoration */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-3 overflow-hidden py-2">
          {["🎉", "💪", "⭐", "🔥", "🏆"].map((emoji, i) => (
            <span key={i} className="text-xl" style={{ animation: `confetti-fall 1.5s ease-out ${i * 0.15}s both` }}>
              {emoji}
            </span>
          ))}
        </div>

        <div className="p-6 pt-12 sm:p-8 sm:pt-14">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 shadow-lg shadow-emerald-500/10">
              <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Workout Complete!</h2>
            <p className="mt-1.5 text-sm text-muted">{dayTitle} • {exercisesCompleted}/{totalExercises} exercises</p>
          </div>

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-4 text-center"
                style={{ animation: `fadeInUp 0.4s ease-out ${0.2 + i * 0.1}s both` }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className="mt-2 text-lg font-bold tracking-tight sm:text-xl">{stat.value}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Exercise breakdown */}
          <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">Exercise Breakdown</h3>
            <div className="space-y-2">
              {trackedExercises.map((ex, i) => {
                const done = ex.trackedSets.filter((s) => s.completed).length;
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className={done > 0 ? "text-foreground" : "text-muted line-through"}>{ex.name}</span>
                    <span className={`font-mono text-xs font-semibold ${done === ex.trackedSets.length ? "text-emerald-400" : "text-muted"}`}>
                      {done}/{ex.trackedSets.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Tip Jar ──────────────────────────── */}
          <div className="mt-8 rounded-2xl border border-accent/15 bg-accent/[0.04] p-6 text-center">
            <h3 className="text-lg font-bold tracking-tight">Buy me a protein shake 🥤</h3>
            <div className="mx-auto mt-4 w-48 overflow-hidden rounded-xl border border-white/10 shadow-lg">
              <Image
                src="/qr-code.jpg"
                alt="QR code for donations"
                width={192}
                height={192}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Scan with GCash, Maya, or any bank app to support!
            </p>
          </div>

          {/* Close button */}
          <button
            id="close-summary-button"
            type="button"
            onClick={onClose}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-surface-hover active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Workout Plan — Pick a Day
   ═══════════════════════════════════════════════════════════════ */
function WorkoutPlan({ plan, onStartDay }: { plan: WorkoutDay[]; onStartDay: (dayIdx: number) => void }) {
  return (
    <section className="mx-auto mt-14 w-full max-w-3xl animate-[fadeInUp_0.5s_ease-out_both] px-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Your Workout Plan</h2>
          <p className="text-xs text-muted">Pick a day to start tracking</p>
        </div>
      </div>

      <div className="space-y-4">
        {plan.map((day, dayIdx) => {
          const color = DAY_COLORS[dayIdx % DAY_COLORS.length];
          return (
            <div
              key={dayIdx}
              className="glass-card group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20"
              onClick={() => onStartDay(dayIdx)}
              style={{ animation: `fadeInUp 0.4s ease-out ${dayIdx * 100}ms both` }}
            >
              <div aria-hidden className={`h-px bg-gradient-to-r ${color.accent} opacity-40`} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-lg border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${color.badge}`}>
                      {day.day}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Start Workout</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {day.exercises.map((ex, exIdx) => (
                    <span key={exIdx} className="rounded-md bg-white/[0.04] px-2.5 py-1 text-xs text-muted">
                      {ex.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Error Alert
   ═══════════════════════════════════════════════════════════════ */
function ErrorAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mx-auto mt-6 flex w-full max-w-lg items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 animate-[fadeInUp_0.3s_ease-out_both]">
      <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-medium text-red-300">Generation Failed</p>
        <p className="mt-0.5 text-sm text-red-400/80">{message}</p>
      </div>
      <button onClick={onDismiss} className="shrink-0 text-red-400/60 transition-colors hover:text-red-300">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Skeleton placeholder
   ═══════════════════════════════════════════════════════════════ */
function WorkoutSkeleton() {
  return (
    <section className="mx-auto mt-14 w-full max-w-2xl animate-[fadeInUp_0.5s_ease-out_both] px-4">
      <div className="glass-card overflow-hidden rounded-2xl p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold tracking-tight">Your Workout Plan</h2>
        </div>
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-border/40" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 animate-pulse rounded-md bg-border/40" style={{ width: `${70 - i * 8}%` }} />
                <div className="h-2.5 animate-pulse rounded-md bg-border/30" style={{ width: `${50 - i * 5}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted">Your AI-generated workout plan will appear here.</p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ╔═══════════════════════════════════════════════════════════╗
   ║                      MAIN PAGE                           ║
   ╚═══════════════════════════════════════════════════════════╝
   ═══════════════════════════════════════════════════════════════ */
type AppPhase = "form" | "tracking" | "summary";

export default function Home() {
  /* ── Form state ───────────────────────── */
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [equipment, setEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WorkoutDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ── Tracking state ───────────────────── */
  const [phase, setPhase] = useState<AppPhase>("form");
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);
  const [trackedExercises, setTrackedExercises] = useState<TrackedExercise[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isReady = goal !== "" && experience !== "" && equipment !== "";

  /* ── Timer ────────────────────────────── */
  useEffect(() => {
    if (phase === "tracking") {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  /* ── Generate plan ────────────────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isReady || loading) return;

    setLoading(true);
    setError(null);
    setPlan(null);
    setPhase("form");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, experience, equipment }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (!data.plan || !Array.isArray(data.plan)) throw new Error("Unexpected response format from AI");

      setPlan(data.plan);
      setTimeout(() => {
        document.getElementById("workout-plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate workout plan");
    } finally {
      setLoading(false);
    }
  }

  /* ── Start tracking a day ──────────────── */
  function startDay(dayIdx: number) {
    if (!plan) return;
    const day = plan[dayIdx];
    setActiveDayIdx(dayIdx);

    const tracked: TrackedExercise[] = day.exercises.map((ex) => ({
      name: ex.name,
      trackedSets: Array.from({ length: ex.sets }, () => ({
        targetReps: ex.reps,
        weight: "",
        actualReps: "",
        completed: false,
      })),
    }));

    setTrackedExercises(tracked);
    setPhase("tracking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Finish workout ────────────────────── */
  function finishWorkout() {
    if (timerRef.current) clearInterval(timerRef.current);
    // Read latest tracked data from the ActiveWorkout child
    // Since ActiveWorkout manages its own state, we capture via a callback
    setPhase("summary");
  }

  /* ── Reset ─────────────────────────────── */
  function resetToHome() {
    setPhase("form");
    setPlan(null);
    setTrackedExercises([]);
    setElapsedSeconds(0);
    setGoal("");
    setExperience("");
    setEquipment("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ═══════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════ */
  return (
    <>
      <GridBackground />

      {/* ── Nav ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#06060a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <button
            onClick={phase !== "form" ? resetToHome : undefined}
            id="nav-logo"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-.75m0-10.5v10.5m0-10.5H4.5a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h2.25m10.5-10.5h-.75a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h.75m0-10.5v10.5m0-10.5h2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-2.25M12 6v12" />
              </svg>
            </span>
            <span>Forma<span className="text-accent">.AI</span></span>
          </button>

          {phase === "tracking" ? (
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-400">Workout Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-muted">AI Online</span>
            </div>
          )}
        </div>
      </nav>

      {/* ── Content ──────────────────────────── */}
      <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-16 sm:pt-20">

        {/* ── PHASE: FORM (hero + form + plan) ── */}
        {phase === "form" && (
          <>
            {/* Hero */}
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-accent">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
                POWERED BY AI
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Train Smarter,{" "}
                <span className="bg-gradient-to-r from-accent to-fuchsia-400 bg-clip-text text-transparent">
                  Not Harder
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                Tell us your goals, experience, and equipment — our AI builds a
                personalized workout schedule you can track in&nbsp;real&nbsp;time.
              </p>
            </div>

            {/* Form */}
            <form id="workout-form" onSubmit={handleSubmit} className="mx-auto mt-12 w-full max-w-lg">
              <div className="glass-card relative overflow-hidden rounded-2xl p-6 shadow-xl shadow-black/20 sm:p-8">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                <div className="space-y-5">
                  <SelectField id="fitness-goal" label="Fitness Goal" value={goal} onChange={setGoal} options={FITNESS_GOALS} placeholder="Select your goal…" />
                  <SelectField id="experience-level" label="Experience Level" value={experience} onChange={setExperience} options={EXPERIENCE_LEVELS} placeholder="Select your level…" />
                  <SelectField id="equipment-available" label="Equipment Available" value={equipment} onChange={setEquipment} options={EQUIPMENT_OPTIONS} placeholder="Select your equipment…" />
                </div>
                <button
                  id="generate-button"
                  type="submit"
                  disabled={!isReady || loading}
                  className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none active:scale-[0.98]"
                  style={isReady && !loading ? { animation: "pulse-glow 3s ease-in-out infinite" } : undefined}
                >
                  {loading ? (
                    <><Spinner /> Generating…</>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                      </svg>
                      Generate My Workout
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error */}
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

            {/* Loading skeleton */}
            {loading && (
              <section className="mx-auto mt-14 w-full max-w-2xl px-4">
                <div className="glass-card rounded-2xl p-8">
                  <div className="flex items-center gap-3">
                    <Spinner />
                    <p className="text-sm font-medium text-muted">AI is crafting your personalized plan…</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 animate-pulse rounded-md bg-border/40" style={{ width: `${90 - i * 15}%`, animationDelay: `${i * 200}ms` }} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Plan — pick a day */}
            <div id="workout-plan">
              {plan ? (
                <WorkoutPlan plan={plan} onStartDay={startDay} />
              ) : (
                !loading && <WorkoutSkeleton />
              )}
            </div>
          </>
        )}

        {/* ── PHASE: TRACKING ──────────────── */}
        {phase === "tracking" && plan && (
          <div className="mx-auto w-full max-w-2xl">
            <ActiveWorkout
              dayTitle={plan[activeDayIdx].day}
              tracked={trackedExercises}
              setTracked={setTrackedExercises}
              onFinish={finishWorkout}
              elapsedSeconds={elapsedSeconds}
            />
          </div>
        )}
      </main>

      {/* ── PHASE: SUMMARY MODAL ────────────── */}
      {phase === "summary" && plan && (
        <WorkoutSummary
          dayTitle={plan[activeDayIdx].day}
          trackedExercises={trackedExercises}
          elapsedSeconds={elapsedSeconds}
          onClose={resetToHome}
        />
      )}

      {/* Footer (only on form phase) */}
      {phase === "form" && (
        <footer className="border-t border-white/[0.04] py-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Forma.AI — AI-powered fitness, built for you.
        </footer>
      )}
    </>
  );
}
