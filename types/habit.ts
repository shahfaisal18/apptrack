export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  completions: Record<string, boolean>; // yyyy-mm-dd -> completed
}

export interface HabitStats {
  completionRate: number;
  totalCompletions: number;
  longestStreak: number;
  currentStreak: number;
}
