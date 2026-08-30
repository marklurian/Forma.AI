"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────── */
interface Exercise {
  name: string;
  sets: number;
  reps: string;
}

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

/* ────────────────────────────────────────────────────────────
   Dropdown option definitions
   ──────────────────────────────────────────────────────────── */
const FITNESS_GOALS = ["Lose Weight", "Build Muscle", "Get Lean", "Strength"] as const;
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const EQUIPMENT_OPTIONS = ["Full Gym", "Dumbbells Only", "Bodyweight"] as const;

/* ────────────────────────────────────────────────────────────
   Day badge color map
   ──────────────────────────────────────────────────────────── */
const DAY_COLORS = [
  { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/20" },
  { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/20" },
  { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20" },
];

/* ────────────────────────────────────────────────────────────
   Decorative background grid dots
   ──────────────────────────────────────────────────────────── */
function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Radial purple glow behind hero */}
      <div className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)]" />
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Reusable select component
   ──────────────────────────────────────────────────────────── */
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
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium tracking-wide text-muted"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-xl border border-border bg-surface px-4 py-3.5 pr-10 text-sm text-foreground shadow-sm transition-all duration-200 hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Loading spinner for CTA button
   ──────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Workout result placeholder (skeleton)
   ──────────────────────────────────────────────────────────── */
function WorkoutSkeleton() {
  return (
    <section
      id="workout-result"
      className="mx-auto mt-16 w-full max-w-2xl animate-[fadeInUp_0.5s_ease-out_both] px-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-md">
        {/* Decorative corner accent */}
        <div
          aria-hidden
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl"
        />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <svg
              className="h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            Your Workout Plan
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-lg bg-border/60"
                style={{ animationDelay: `${i * 120}ms` }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-3.5 rounded-md bg-border/60"
                  style={{ width: `${70 - i * 8}%` }}
                />
                <div
                  className="h-2.5 rounded-md bg-border/40"
                  style={{ width: `${50 - i * 5}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Your AI-generated workout plan will appear here.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Workout result display (populated)
   ──────────────────────────────────────────────────────────── */
function WorkoutPlan({ plan }: { plan: WorkoutDay[] }) {
  return (
    <section
      id="workout-result"
      className="mx-auto mt-16 w-full max-w-3xl animate-[fadeInUp_0.5s_ease-out_both] px-4"
    >
      {/* Section header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
          <svg
            className="h-5 w-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          Your Workout Plan
        </h2>
      </div>

      {/* Day cards */}
      <div className="space-y-6">
        {plan.map((day, dayIdx) => {
          const color = DAY_COLORS[dayIdx % DAY_COLORS.length];
          return (
            <div
              key={dayIdx}
              className="relative overflow-hidden rounded-2xl border border-border bg-surface/50 backdrop-blur-md transition-all duration-300 hover:border-border/80 hover:bg-surface/70"
              style={{ animationDelay: `${dayIdx * 150}ms` }}
            >
              {/* Top gradient bar */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              />

              {/* Day header */}
              <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${color.bg} ${color.text} ${color.border}`}
                >
                  {day.day}
                </span>
              </div>

              {/* Exercise table */}
              <div className="divide-y divide-border/30">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_80px_100px] items-center gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                  <span>Exercise</span>
                  <span className="text-center">Sets</span>
                  <span className="text-center">Reps</span>
                </div>

                {/* Exercise rows */}
                {day.exercises.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="grid grid-cols-[1fr_80px_100px] items-center gap-4 px-6 py-3.5 transition-colors duration-150 hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-border/40 text-xs font-semibold text-muted">
                        {exIdx + 1}
                      </span>
                      <span className="text-sm font-medium">{ex.name}</span>
                    </div>
                    <span className="text-center text-sm font-semibold text-foreground">
                      {ex.sets}
                    </span>
                    <span className="text-center text-sm text-muted">
                      {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Error alert
   ──────────────────────────────────────────────────────────── */
function ErrorAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-lg items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 animate-[fadeInUp_0.3s_ease-out_both]">
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

/* ────────────────────────────────────────────────────────────
   Main page
   ──────────────────────────────────────────────────────────── */
export default function Home() {
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [equipment, setEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WorkoutDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isReady = goal !== "" && experience !== "" && equipment !== "";

  async function handleSubmit(e: React.FormEvent) {
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

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (!data.plan || !Array.isArray(data.plan)) {
        throw new Error("Unexpected response format from AI");
      }

      setPlan(data.plan);

      // Scroll to results after a brief delay for render
      setTimeout(() => {
        const result = document.getElementById("workout-result");
        result?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate workout plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <GridBackground />

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a
            href="/"
            id="nav-logo"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            {/* Dumbbell icon */}
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 6.75h.75a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-.75m0-10.5v10.5m0-10.5H4.5a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h2.25m10.5-10.5h-.75a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h.75m0-10.5v10.5m0-10.5h2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-2.25M12 6v12"
                />
              </svg>
            </span>
            <span>
              Forma<span className="text-accent">.AI</span>
            </span>
          </a>

          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-muted">AI Online</span>
          </div>
        </div>
      </nav>

      {/* ── Hero + Form ────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-20">
        {/* Headline */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium tracking-wide text-accent">
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
            personalized workout schedule in&nbsp;seconds.
          </p>
        </div>

        {/* Form card */}
        <form
          id="workout-form"
          onSubmit={handleSubmit}
          className="mx-auto mt-12 w-full max-w-lg"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 shadow-xl shadow-black/20 backdrop-blur-md sm:p-8">
            {/* Top gradient bar */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
            />

            <div className="space-y-5">
              <SelectField
                id="fitness-goal"
                label="FITNESS GOAL"
                value={goal}
                onChange={setGoal}
                options={FITNESS_GOALS}
                placeholder="Select your goal…"
              />
              <SelectField
                id="experience-level"
                label="EXPERIENCE LEVEL"
                value={experience}
                onChange={setExperience}
                options={EXPERIENCE_LEVELS}
                placeholder="Select your level…"
              />
              <SelectField
                id="equipment-available"
                label="EQUIPMENT AVAILABLE"
                value={equipment}
                onChange={setEquipment}
                options={EQUIPMENT_OPTIONS}
                placeholder="Select your equipment…"
              />
            </div>

            <button
              id="generate-button"
              type="submit"
              disabled={!isReady || loading}
              className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-4 text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              style={isReady && !loading ? { animation: "pulse-glow 3s ease-in-out infinite" } : undefined}
            >
              {loading ? (
                <>
                  <Spinner />
                  Generating…
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455 2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                  Generate My Workout
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error alert */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        {/* Workout results — show skeleton if no plan yet, show plan if available */}
        {plan ? <WorkoutPlan plan={plan} /> : !loading && <WorkoutSkeleton />}

        {/* Loading skeleton during generation */}
        {loading && (
          <section className="mx-auto mt-16 w-full max-w-2xl px-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Spinner />
                <p className="text-sm font-medium text-muted">
                  AI is building your personalized workout plan…
                </p>
              </div>
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 animate-pulse rounded-md bg-border/40" style={{ width: `${90 - i * 15}%`, animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Forma.AI — AI-powered fitness, built for you.
      </footer>

      {/* Inline keyframes for the fade-in animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
