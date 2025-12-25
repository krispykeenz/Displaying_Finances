import type { Expense, User } from '../types';
import {
  demoOnAuthStateChanged,
  demoSignIn,
  demoSignUp,
  demoSignOut,
  demoFetchExpenses,
  demoAddExpense,
  demoUpdateExpense,
  demoDeleteExpense,
  isDemoMode,
} from '../demo/demoBackend';

// Firebase (real backend)
import { onAuthStateChanged as fbOnAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase';

export function onAuthStateChangedApp(callback: (user: User | null) => void): () => void {
  if (isDemoMode) {
    return demoOnAuthStateChanged(callback);
  }

  const unsubscribe = fbOnAuthStateChanged(auth, (user) => {
    if (!user) {
      callback(null);
      return;
    }

    callback({
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || undefined,
    });
  });

  return unsubscribe;
}

export async function signInApp(email: string, password: string): Promise<User> {
  if (isDemoMode) {
    return demoSignIn(email, password);
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    id: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName || undefined,
  };
}

export async function signUpApp(email: string, password: string): Promise<User> {
  if (isDemoMode) {
    return demoSignUp(email, password);
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return {
    id: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName || undefined,
  };
}

export async function signOutApp(): Promise<void> {
  if (isDemoMode) {
    await demoSignOut();
    return;
  }

  await signOut(auth);
}

export async function fetchExpensesForUser(userId: string): Promise<Expense[]> {
  if (isDemoMode) {
    return demoFetchExpenses(userId);
  }

  const q = query(collection(db, 'expenses'), where('userId', '==', userId), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  querySnapshot.forEach((d) => {
    expenses.push({ id: d.id, ...(d.data() as any) } as Expense);
  });
  return expenses;
}

export async function addExpenseForUser(expense: Omit<Expense, 'id'>): Promise<Expense> {
  if (isDemoMode) {
    return demoAddExpense(expense);
  }

  const docRef = await addDoc(collection(db, 'expenses'), expense as any);
  return { id: docRef.id, ...expense };
}

export async function updateExpenseForUser(expense: Expense): Promise<Expense> {
  if (isDemoMode) {
    return demoUpdateExpense(expense);
  }

  const { id, ...updateData } = expense;
  await updateDoc(doc(db, 'expenses', id), updateData as any);
  return expense;
}

export async function deleteExpenseForUser(expenseId: string): Promise<void> {
  if (isDemoMode) {
    await demoDeleteExpense(expenseId);
    return;
  }

  await deleteDoc(doc(db, 'expenses', expenseId));
}
