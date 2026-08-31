-- ═══════════════════════════════════════════════════════════
-- FORMA.AI — Supabase Database Schema
-- Run this in your Supabase Project > SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Create the 'workouts' table
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    day_title TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    completed_sets INTEGER DEFAULT 0,
    total_sets INTEGER DEFAULT 0,
    exercises JSONB DEFAULT '[]'::jsonb,
    calories INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'lbs',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create index on user_id and created_at for fast queries
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts (user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON public.workouts (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies allowing authenticated and anonymous clients to manage their records
CREATE POLICY "Allow read access to all workouts" ON public.workouts
    FOR SELECT
    USING (true);

CREATE POLICY "Allow insert access to workouts" ON public.workouts
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow update access to own workouts" ON public.workouts
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow delete access to own workouts" ON public.workouts
    FOR DELETE
    USING (true);
