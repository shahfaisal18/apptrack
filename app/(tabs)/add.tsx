import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useHabits } from '@/hooks/useHabits';

export default function ManageHabitsScreen() {
  const { habits, addHabit, deleteHabit, updateHabit } = useHabits();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a habit name.');
      return;
    }

    if (editingId) {
      await updateHabit(editingId, { name, description });
      setEditingId(null);
    } else {
      await addHabit(name, description);
    }

    setName('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Habits</Text>
          <Text style={styles.subtitle}>Create, edit, and remove habits for Faisal</Text>
        </View>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Habit name (e.g. Read 20 minutes)"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Description (optional)"
            style={[styles.input, styles.multiline]}
            multiline
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={submit}>
            <Plus color="#fff" size={18} />
            <Text style={styles.buttonText}>{editingId ? 'Save Habit' : 'Add Habit'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Existing Habits</Text>
          {habits.length === 0 ? <Text style={styles.emptyText}>No habits yet.</Text> : null}
          {habits.map((habit) => (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.habitTextWrap}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {!!habit.description && <Text style={styles.habitDescription}>{habit.description}</Text>}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => {
                    setEditingId(habit.id);
                    setName(habit.name);
                    setDescription(habit.description ?? '');
                  }}
                  style={styles.iconButton}>
                  <Pencil size={18} color="#1D4ED8" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteHabit(habit.id)} style={styles.iconButton}>
                  <Trash2 size={18} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  formCard: { marginHorizontal: 20, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  listSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#0F172A' },
  emptyText: { color: '#64748B' },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitTextWrap: { flex: 1, paddingRight: 12 },
  habitName: { fontWeight: '600', fontSize: 16, color: '#0F172A' },
  habitDescription: { marginTop: 4, color: '#64748B' },
  actions: { flexDirection: 'row', gap: 6 },
  iconButton: { padding: 8, borderRadius: 8, backgroundColor: '#EFF6FF' },
});
