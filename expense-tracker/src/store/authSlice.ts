import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { AuthState, User } from '../types';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userCredential.user.displayName || undefined,
    };
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userCredential.user.displayName || undefined,
    };
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
