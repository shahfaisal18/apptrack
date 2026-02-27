import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BellRing, Flame, Trophy } from 'lucide-react-native';
import { useHabits } from '@/hooks/useHabits';

export default function ProfileScreen() {
  const { habits, stats, getDatesBack, getCompletionCountByDate } = useHabits();

  const last14 = getDatesBack(14);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Faisal's Progress</Text>
          <Text style={styles.subtitle}>Your consistency profile and streak records</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Flame size={20} color="#EA580C" />
            <Text style={styles.value}>{stats.currentStreak}</Text>
            <Text style={styles.label}>Current Streak</Text>
          </View>
          <View style={styles.card}>
            <Trophy size={20} color="#CA8A04" />
            <Text style={styles.value}>{stats.longestStreak}</Text>
            <Text style={styles.label}>Longest Streak</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.value}>{stats.completionRate.toFixed(0)}%</Text>
            <Text style={styles.label}>30-Day Completion</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Last 14 Days Heatmap</Text>
          <View style={styles.heatWrap}>
            {last14.map((date) => {
              const value = habits.length === 0 ? 0 : getCompletionCountByDate(date) / habits.length;
              return <View key={date} style={[styles.heatCell, { opacity: 0.2 + value * 0.8 }]} />;
            })}
          </View>
          <Text style={styles.chartHint}>Darker blue means more habits completed on that day.</Text>
        </View>

        <View style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <BellRing size={18} color="#1D4ED8" />
            <Text style={styles.reminderTitle}>Reminder</Text>
          </View>
          <Text style={styles.reminderText}>
            Tip: Open this app every evening and complete your checklist to protect your streak.
          </Text>
          <Text style={styles.reminderText}>Total active habits: {habits.length}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  subtitle: { marginTop: 4, color: '#64748B' },
  grid: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  value: { marginTop: 6, fontSize: 22, fontWeight: '700', color: '#0F172A' },
  label: { marginTop: 4, textAlign: 'center', color: '#64748B', fontSize: 12 },
  chartCard: { margin: 20, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  chartTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  heatWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heatCell: { width: 20, height: 20, borderRadius: 4, backgroundColor: '#2563EB' },
  chartHint: { marginTop: 10, color: '#64748B' },
  reminderCard: { marginHorizontal: 20, marginBottom: 24, backgroundColor: '#DBEAFE', padding: 14, borderRadius: 12 },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  reminderTitle: { fontWeight: '700', color: '#1E3A8A' },
  reminderText: { color: '#1E3A8A', marginTop: 4 },
});
