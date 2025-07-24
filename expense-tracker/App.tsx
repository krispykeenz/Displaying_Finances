import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store/store';
import { auth } from './src/services/firebase';
import { setUser } from './src/store/authSlice';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        store.dispatch(setUser({
          id: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
        }));
      } else {
        store.dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}
