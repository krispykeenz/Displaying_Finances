export interface User {
  id: string;
  email: string;
  displayName?: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ExpenseState {
  expenses: Expense[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}
