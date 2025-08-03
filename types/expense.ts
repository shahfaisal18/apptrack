export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: 'Food', color: '#EF4444', icon: '🍽️' },
  { id: '2', name: 'Transport', color: '#3B82F6', icon: '🚗' },
  { id: '3', name: 'Shopping', color: '#8B5CF6', icon: '🛍️' },
  { id: '4', name: 'Entertainment', color: '#F59E0B', icon: '🎬' },
  { id: '5', name: 'Health', color: '#10B981', icon: '🏥' },
  { id: '6', name: 'Education', color: '#6366F1', icon: '📚' },
  { id: '7', name: 'Bills', color: '#DC2626', icon: '📱' },
  { id: '8', name: 'Other', color: '#6B7280', icon: '💰' },
];