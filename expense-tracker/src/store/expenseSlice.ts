import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ExpenseState, Expense, Category } from '../types';

const initialState: ExpenseState = {
  expenses: [],
  categories: [
    { id: '1', name: 'Food', color: '#FF6B6B', icon: 'restaurant' },
    { id: '2', name: 'Transport', color: '#4ECDC4', icon: 'directions-car' },
    { id: '3', name: 'Entertainment', color: '#45B7D1', icon: 'movie' },
    { id: '4', name: 'Shopping', color: '#96CEB4', icon: 'shopping-cart' },
    { id: '5', name: 'Bills', color: '#FECA57', icon: 'receipt' },
    { id: '6', name: 'Healthcare', color: '#FF9FF3', icon: 'local-hospital' },
    { id: '7', name: 'Income', color: '#54A0FF', icon: 'attach-money' },
  ],
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (userId: string) => {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const expenses: Expense[] = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() } as Expense);
    });
    return expenses;
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expense: Omit<Expense, 'id'>) => {
    const docRef = await addDoc(collection(db, 'expenses'), expense);
    return { id: docRef.id, ...expense };
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async (expense: Expense) => {
    const { id, ...updateData } = expense;
    await updateDoc(doc(db, 'expenses', id), updateData);
    return expense;
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (expenseId: string) => {
    await deleteDoc(doc(db, 'expenses', expenseId));
    return expenseId;
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
      });
  },
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
