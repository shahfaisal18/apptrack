import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitStats } from '@/types/habit';

const STORAGE_KEY = 'faisal_habits_v1';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getDatesBack = (days: number) => {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    return formatDate(date);
  });
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const saveHabits = useCallback(async (nextHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextHabits));
      setHabits(nextHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  }, []);

  const loadHabits = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setHabits(JSON.parse(raw));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const addHabit = async (name: string, description?: string) => {
    const now = new Date().toISOString();
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description?.trim(),
      createdAt: now,
      updatedAt: now,
      completions: {},
    };
    await saveHabits([...habits, newHabit]);
  };

  const updateHabit = async (id: string, updates: Pick<Habit, 'name' | 'description'>) => {
    const nextHabits = habits.map((habit) =>
      habit.id === id
        ? {
            ...habit,
            ...updates,
            name: updates.name.trim(),
            description: updates.description?.trim(),
            updatedAt: new Date().toISOString(),
          }
        : habit,
    );

    await saveHabits(nextHabits);
  };

  const deleteHabit = async (id: string) => {
    await saveHabits(habits.filter((habit) => habit.id !== id));
  };

  const toggleHabitForDate = async (habitId: string, date: string) => {
    const nextHabits = habits.map((habit) => {
      if (habit.id !== habitId) {
        return habit;
      }

      return {
        ...habit,
        updatedAt: new Date().toISOString(),
        completions: {
          ...habit.completions,
          [date]: !habit.completions[date],
        },
      };
    });

    await saveHabits(nextHabits);
  };

  const getCompletionCountByDate = useCallback(
    (date: string) => habits.filter((habit) => habit.completions[date]).length,
    [habits],
  );

  const calculateStreakForHabit = useCallback((habit: Habit) => {
    let streak = 0;
    const cursor = new Date();

    while (true) {
      const key = formatDate(cursor);
      if (!habit.completions[key]) {
        break;
      }

      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }, []);

  const stats: HabitStats = useMemo(() => {
    const lookbackDates = getDatesBack(30);
    const totalPossible = lookbackDates.length * habits.length;
    const totalCompletions = lookbackDates.reduce(
      (acc, date) => acc + habits.filter((habit) => habit.completions[date]).length,
      0,
    );

    const completionRate = totalPossible === 0 ? 0 : (totalCompletions / totalPossible) * 100;

    const streaks = habits.map(calculateStreakForHabit);
    const currentStreak = streaks.length ? Math.max(...streaks) : 0;

    const longestStreak = habits.reduce((globalBest, habit) => {
      let localBest = 0;
      let running = 0;

      const orderedDates = Object.keys(habit.completions).sort();
      orderedDates.forEach((date) => {
        if (habit.completions[date]) {
          running += 1;
          localBest = Math.max(localBest, running);
        } else {
          running = 0;
        }
      });

      return Math.max(globalBest, localBest);
    }, 0);

    return {
      completionRate,
      totalCompletions,
      currentStreak,
      longestStreak,
    };
  }, [calculateStreakForHabit, habits]);

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitForDate,
    getCompletionCountByDate,
    stats,
    formatDate,
    getDatesBack,
  };
}
