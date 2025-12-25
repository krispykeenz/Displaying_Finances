import type { Expense, User } from '../types';

const DEMO_MODE_FLAG = 'true';
export const isDemoMode = process.env.EXPO_PUBLIC_DEMO_MODE === DEMO_MODE_FLAG;

type AuthListener = (user: User | null) => void;

let currentUser: User | null = {
  id: 'demo-user-1',
  email: 'demo@expense-tracker.local',
  displayName: 'Demo User',
};

const listeners = new Set<AuthListener>();

function notify() {
  for (const cb of listeners) {
    try {
      cb(currentUser);
    } catch {
      // ignore
    }
  }
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

let expenses: Expense[] = [
  {
    id: 'exp_demo_1',
    userId: 'demo-user-1',
    amount: 3200,
    category: 'Income',
    description: 'Monthly salary',
    date: daysAgo(20),
    type: 'income',
  },
  {
    id: 'exp_demo_2',
    userId: 'demo-user-1',
    amount: 1250,
    category: 'Bills',
    description: 'Rent',
    date: daysAgo(18),
    type: 'expense',
  },
  {
    id: 'exp_demo_3',
    userId: 'demo-user-1',
    amount: 92.45,
    category: 'Food',
    description: 'Groceries',
    date: daysAgo(10),
    type: 'expense',
  },
  {
    id: 'exp_demo_4',
    userId: 'demo-user-1',
    amount: 45.0,
    category: 'Entertainment',
    description: 'Movie night',
    date: daysAgo(7),
    type: 'expense',
  },
  {
    id: 'exp_demo_5',
    userId: 'demo-user-1',
    amount: 60.25,
    category: 'Transport',
    description: 'Gas',
    date: daysAgo(5),
    type: 'expense',
  },
  {
    id: 'exp_demo_6',
    userId: 'demo-user-1',
    amount: 28.99,
    category: 'Shopping',
    description: 'Household items',
    date: daysAgo(2),
    type: 'expense',
  },
];

export function demoOnAuthStateChanged(callback: AuthListener): () => void {
  listeners.add(callback);
  // Immediately emit current user.
  callback(currentUser);
  return () => listeners.delete(callback);
}

export async function demoSignIn(email: string, _password: string): Promise<User> {
  currentUser = {
    id: 'demo-user-1',
    email: email || 'demo@expense-tracker.local',
    displayName: email ? email.split('@')[0] : 'Demo User',
  };
  notify();
  return currentUser;
}

export async function demoSignUp(email: string, _password: string): Promise<User> {
  const id = `demo-user-${Math.floor(Math.random() * 100000)}`;
  currentUser = {
    id,
    email,
    displayName: email.split('@')[0] ?? 'Demo User',
  };
  // Seed some starter expenses for the new demo user.
  expenses = [
    {
      id: `exp_demo_${Date.now()}`,
      userId: id,
      amount: 1500,
      category: 'Income',
      description: 'Demo income',
      date: daysAgo(12),
      type: 'income',
    },
    {
      id: `exp_demo_${Date.now() + 1}`,
      userId: id,
      amount: 75.5,
      category: 'Food',
      description: 'Demo groceries',
      date: daysAgo(4),
      type: 'expense',
    },
    ...expenses,
  ];
  notify();
  return currentUser;
}

export async function demoSignOut(): Promise<void> {
  currentUser = null;
  notify();
}

export async function demoFetchExpenses(userId: string): Promise<Expense[]> {
  const userExpenses = expenses
    .filter((e) => e.userId === userId)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return userExpenses;
}

export async function demoAddExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const next: Expense = { id: `exp_${Date.now()}`, ...expense };
  expenses = [next, ...expenses];
  return next;
}

export async function demoUpdateExpense(expense: Expense): Promise<Expense> {
  expenses = expenses.map((e) => (e.id === expense.id ? expense : e));
  return expense;
}

export async function demoDeleteExpense(expenseId: string): Promise<void> {
  expenses = expenses.filter((e) => e.id !== expenseId);
}
