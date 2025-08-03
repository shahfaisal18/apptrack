import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CirclePlus as PlusCircle, TrendingUp, Calendar } from 'lucide-react-native';
import { useExpenses } from '@/hooks/useExpenses';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { expenses, getTotalAmount, getExpensesByCategory } = useExpenses();

  const totalAmount = getTotalAmount();
  const categoriesData = getExpensesByCategory();
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expense Tracker</Text>
          <Text style={styles.headerSubtitle}>Track your spending</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <TrendingUp size={24} color="#FFFFFF" />
            <Text style={styles.statCardTitle}>Total Spent</Text>
            <Text style={styles.statCardAmount}>${totalAmount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Calendar size={24} color="#10B981" />
            <Text style={styles.statCardTitle}>This Month</Text>
            <Text style={styles.statCardAmount}>${thisMonthTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Quick Add Button */}
        <TouchableOpacity 
          style={styles.quickAddButton}
          onPress={() => router.push('/add')}
        >
          <PlusCircle size={24} color="#FFFFFF" />
          <Text style={styles.quickAddText}>Add New Expense</Text>
        </TouchableOpacity>

        {/* Categories Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {Object.values(categoriesData).map(({ category, total, count }) => (
              <View key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>${total.toFixed(2)}</Text>
                <Text style={styles.categoryCount}>{count} transactions</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentExpenses.length > 0 ? (
            <View style={styles.transactionsList}>
              {recentExpenses.map((expense) => (
                <View key={expense.id} style={styles.transactionItem}>
                  <View style={[styles.transactionIcon, { backgroundColor: expense.category.color }]}>
                    <Text style={styles.transactionEmoji}>{expense.category.icon}</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>{expense.description}</Text>
                    <Text style={styles.transactionCategory}>{expense.category.name}</Text>
                  </View>
                  <Text style={styles.transactionAmount}>-${expense.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No expenses yet. Add your first expense!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCard: {
    backgroundColor: '#10B981',
  },
  statCardTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  statCardAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quickAddText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 18,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
});