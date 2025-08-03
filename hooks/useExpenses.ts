import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types/expense';

const STORAGE_KEY = 'expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
          createdAt: new Date(expense.createdAt),
        }));
        setExpenses(parsedExpenses);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveExpenses = async (newExpenses: Expense[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedExpenses = [...expenses, newExpense];
    await saveExpenses(updatedExpenses);
  };

  const deleteExpense = async (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    await saveExpenses(updatedExpenses);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, ...updates } : expense
    );
    await saveExpenses(updatedExpenses);
  };

  const getTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    return expenses.reduce((acc, expense) => {
      const categoryId = expense.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: expense.category,
          total: 0,
          count: 0,
        };
      }
      acc[categoryId].total += expense.amount;
      acc[categoryId].count += 1;
      return acc;
    }, {} as Record<string, { category: any; total: number; count: number }>);
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    updateExpense,
    getTotalAmount,
    getExpensesByCategory,
  };
}