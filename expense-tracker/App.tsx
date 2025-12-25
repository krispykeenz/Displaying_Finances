import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store/store';
import { setUser } from './src/store/authSlice';
import AppNavigator from './src/navigation/AppNavigator';
import { onAuthStateChangedApp } from './src/services/backend';

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChangedApp((user) => {
      store.dispatch(setUser(user));
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
