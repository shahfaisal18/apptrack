import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '@/hooks/useHabits';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export default function HabitViewsScreen() {
  const { habits, formatDate, getDatesBack, getCompletionCountByDate } = useHabits();
  const [viewMode, setViewMode] = useState<ViewMode>('daily');

  const today = formatDate(new Date());

  const chartDates = useMemo(() => {
    if (viewMode === 'daily') return getDatesBack(1);
    if (viewMode === 'weekly') return getDatesBack(7);
    return getDatesBack(30).filter((_, idx) => idx % 5 === 0);
  }, [getDatesBack, viewMode]);

  const maxDone = Math.max(1, ...chartDates.map((date) => getCompletionCountByDate(date)));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Daily / Weekly / Monthly</Text>
          <Text style={styles.subtitle}>Interactive habit completion graphs</Text>
        </View>

        <View style={styles.segmentWrap}>
          {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.segmentButton, viewMode === item && styles.segmentButtonActive]}
              onPress={() => setViewMode(item)}>
              <Text style={[styles.segmentText, viewMode === item && styles.segmentTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.graphCard}>
          <Text style={styles.graphTitle}>Completions</Text>
          <View style={styles.barsRow}>
            {chartDates.map((date) => {
              const done = getCompletionCountByDate(date);
              const barHeight = (done / maxDone) * 140 + 8;
              return (
                <View key={date} style={styles.barColumn}>
                  <Text style={styles.barValue}>{done}</Text>
                  <View style={[styles.bar, { height: barHeight }]} />
                  <Text style={styles.barLabel}>{viewMode === 'daily' ? 'today' : date.slice(5)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Status for {today}</Text>
          {habits.map((habit) => (
            <View key={habit.id} style={styles.summaryRow}>
              <Text style={styles.summaryName}>{habit.name}</Text>
              <Text style={[styles.badge, habit.completions[today] ? styles.done : styles.pending]}>
                {habit.completions[today] ? 'Done' : 'Not done'}
              </Text>
            </View>
          ))}
          {habits.length === 0 ? <Text style={styles.emptyText}>No habits available yet.</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#0F172A' },
  subtitle: { marginTop: 4, color: '#64748B' },
  segmentWrap: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#E2E8F0', borderRadius: 10, padding: 4 },
  segmentButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  segmentButtonActive: { backgroundColor: '#FFFFFF' },
  segmentText: { textTransform: 'capitalize', color: '#475569', fontWeight: '600' },
  segmentTextActive: { color: '#1D4ED8' },
  graphCard: { margin: 20, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  graphTitle: { fontWeight: '700', fontSize: 18, marginBottom: 14, color: '#0F172A' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 180, gap: 4 },
  barColumn: { flex: 1, alignItems: 'center' },
  bar: { width: '70%', backgroundColor: '#2563EB', borderRadius: 7 },
  barLabel: { marginTop: 6, fontSize: 10, color: '#64748B' },
  barValue: { fontSize: 11, color: '#334155', marginBottom: 4 },
  summaryCard: { marginHorizontal: 20, marginBottom: 24, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  summaryTitle: { fontWeight: '700', fontSize: 18, color: '#0F172A', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  summaryName: { color: '#1E293B', flex: 1, paddingRight: 8 },
  badge: { fontWeight: '600' },
  done: { color: '#16A34A' },
  pending: { color: '#DC2626' },
  emptyText: { color: '#64748B' },
});
