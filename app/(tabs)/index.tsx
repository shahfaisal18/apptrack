import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Circle, Flame, Target } from 'lucide-react-native';
import { useHabits } from '@/hooks/useHabits';

export default function TodayScreen() {
  const { habits, loading, toggleHabitForDate, formatDate, stats } = useHabits();
  const today = formatDate(new Date());

  const completedToday = habits.filter((habit) => habit.completions[today]).length;
  const completionRateToday = habits.length === 0 ? 0 : (completedToday / habits.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Habits of Faisal</Text>
          <Text style={styles.headerSubtitle}>Daily focus and momentum tracker</Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Target color="#2563EB" size={20} />
            <Text style={styles.cardValue}>{completedToday}/{habits.length}</Text>
            <Text style={styles.cardLabel}>Done Today</Text>
          </View>
          <View style={styles.card}>
            <Flame color="#EA580C" size={20} />
            <Text style={styles.cardValue}>{stats.currentStreak}</Text>
            <Text style={styles.cardLabel}>Current Streak</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>Today's completion: {completionRateToday.toFixed(0)}%</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completionRateToday}%` }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          {loading ? <Text style={styles.emptyText}>Loading habits...</Text> : null}
          {!loading && habits.length === 0 ? (
            <Text style={styles.emptyText}>No habits yet. Add one from the Manage tab.</Text>
          ) : null}

          {habits.map((habit) => {
            const done = !!habit.completions[today];
            return (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitRow}
                onPress={() => toggleHabitForDate(habit.id, today)}>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  {!!habit.description && <Text style={styles.habitDescription}>{habit.description}</Text>}
                </View>
                {done ? <CheckCircle2 size={24} color="#16A34A" /> : <Circle size={24} color="#9CA3AF" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { marginTop: 4, color: '#475569' },
  cardsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20 },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardValue: { marginTop: 8, fontSize: 22, fontWeight: '700', color: '#0F172A' },
  cardLabel: { color: '#64748B', fontSize: 12, marginTop: 4 },
  progressCard: { margin: 20, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14 },
  progressText: { fontWeight: '600', marginBottom: 10, color: '#0F172A' },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2563EB' },
  section: { paddingHorizontal: 20, paddingBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  emptyText: { color: '#64748B', marginBottom: 10 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  habitInfo: { flex: 1, marginRight: 10 },
  habitName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  habitDescription: { marginTop: 4, color: '#6B7280' },
});
