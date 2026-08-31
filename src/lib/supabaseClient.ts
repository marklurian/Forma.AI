import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseWorkout {
  id?: string;
  user_id: string;
  day_title: string;
  duration_seconds: number;
  completed_sets: number;
  total_sets: number;
  exercises: {
    name: string;
    trackedSets: {
      targetReps: string;
      weight: string;
      actualReps: string;
      completed: boolean;
      restSeconds?: number;
    }[];
  }[];
  calories: number;
  unit: "lbs" | "kg";
  created_at?: string;
}

const LOCAL_STORAGE_KEY = "forma_saved_workouts_v1";

function getLocalWorkouts(userId?: string): SupabaseWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const list: SupabaseWorkout[] = JSON.parse(raw);
    if (userId) {
      return list.filter((w) => w.user_id === userId);
    }
    return list;
  } catch {
    return [];
  }
}

function saveLocalWorkout(workout: SupabaseWorkout): SupabaseWorkout {
  if (typeof window === "undefined") return workout;
  try {
    const list = getLocalWorkouts();
    const withId: SupabaseWorkout = {
      ...workout,
      id: workout.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: workout.created_at || new Date().toISOString(),
    };
    const updated = [withId, ...list.filter((w) => w.id !== withId.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return withId;
  } catch {
    return workout;
  }
}

function deleteLocalWorkout(workoutId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalWorkouts();
    const updated = list.filter((w) => w.id !== workoutId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore error
  }
}

/**
 * Save completed workout record to Supabase (with automatic local fallback)
 */
export async function saveWorkoutToSupabase(
  workout: SupabaseWorkout
): Promise<{ data: SupabaseWorkout | null; isCloud: boolean; error: Error | null }> {
  // Always save locally first as reliable backup
  const localSaved = saveLocalWorkout(workout);

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: localSaved, isCloud: false, error: null };
    }

    const { data, error } = await supabase
      .from("workouts")
      .insert([workout])
      .select()
      .single();

    if (error) {
      // Table might not be created yet in Supabase (PGRST205) or RLS policy needed
      console.warn(
        "Supabase note: Workout saved locally on device. To enable cloud database sync, create the 'workouts' table in your Supabase SQL Editor (see supabase_schema.sql).",
        error.message || error
      );
      return { data: localSaved, isCloud: false, error: null };
    }

    return { data: data || localSaved, isCloud: true, error: null };
  } catch (err: any) {
    console.warn(
      "Supabase sync notice: Workout preserved locally. Cloud sync pending table setup.",
      err?.message || err
    );
    return { data: localSaved, isCloud: false, error: null };
  }
}

/**
 * Fetch all saved workouts for a specific user ID
 */
export async function getUserWorkoutsFromSupabase(
  userId: string
): Promise<{ data: SupabaseWorkout[]; isCloud: boolean; error: Error | null }> {
  const localWorkouts = getLocalWorkouts(userId);

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: localWorkouts, isCloud: false, error: null };
    }

    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback seamlessly to local workouts if table is not created yet
      return { data: localWorkouts, isCloud: false, error: null };
    }

    // Merge cloud and local if any local exist
    const cloudIds = new Set((data || []).map((w: SupabaseWorkout) => w.id));
    const merged = [...(data || []), ...localWorkouts.filter((w) => !cloudIds.has(w.id))];
    merged.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    return { data: merged, isCloud: true, error: null };
  } catch (err: any) {
    return { data: localWorkouts, isCloud: false, error: null };
  }
}

/**
 * Delete a specific workout record
 */
export async function deleteWorkoutFromSupabase(
  workoutId: string,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  deleteLocalWorkout(workoutId);

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: true, error: null };
    }

    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId)
      .eq("user_id", userId);

    if (error) {
      return { success: true, error: null };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: true, error: null };
  }
}
