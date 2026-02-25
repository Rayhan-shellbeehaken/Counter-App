import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'react-native';

import { auth } from '@/config/firebaseConfig';
import { signUpUser, signInUser, signOutUser } from '@/services/authService';
// 🆕 Import storage helpers
import {
  saveUserToStorage,
  loadUserFromStorage,
  clearUserFromStorage,
} from '@/services/secureStorage';

export const AuthContext = createContext({});

const defaultProps = { children: null };

export function AuthProvider({ children = defaultProps.children } = defaultProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🆕 Load persisted user first so UI isn't blank on cold start
    const bootstrap = async () => {
      const storedUser = await loadUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      }
      // Then subscribe — Firebase will confirm or invalidate the session
      const unsubscribe = subscribeToAuthChanges();
      return unsubscribe;
    };

    const unsubscribePromise = bootstrap();
    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe?.());
    };
  }, []);

  const subscribeToAuthChanges = () => {
    return onAuthStateChanged(auth, handleAuthStateChange, handleAuthError);
  };

  const handleAuthStateChange = async (firebaseUser = null) => {
    console.log('🔐 Auth state changed:', firebaseUser ? 'Logged in' : 'Logged out');

    if (firebaseUser) {
      const userData = extractUserData(firebaseUser);
      setUser(userData);
      await saveUserToStorage(userData); // 🆕 Persist on login/session restore
    } else {
      setUser(null);
      await clearUserFromStorage(); // 🆕 Clear on logout/session expiry
    }
    setLoading(false);
  };

  const handleAuthError = (error = null) => {
    console.error('❌ Auth state error:', error);
    setLoading(false);
  };

  const signup = async (email = '', password = '') => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await signUpUser(email, password);
      const userData = extractUserData(userCredential.user);
      setUser(userData);
      await saveUserToStorage(userData); // 🆕
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      Alert.alert('Signup Failed', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email = '', password = '') => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await signInUser(email, password);
      const userData = extractUserData(userCredential.user);
      setUser(userData);
      await saveUserToStorage(userData); // 🆕
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOutUser();
      setUser(null);
      await clearUserFromStorage(); // 🆕
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      Alert.alert('Logout Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return renderProvider({ value, loading, children });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderProvider = ({ value = {}, loading = true, children = null } = {}) => {
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ---------------------------------
   HELPERS (unchanged)
--------------------------------- */

const extractUserData = (firebaseUser = {}) => ({
  uid: firebaseUser.uid ?? null,
  email: firebaseUser.email ?? null,
  displayName: firebaseUser.displayName ?? null,
  photoURL: firebaseUser.photoURL ?? null,
  emailVerified: firebaseUser.emailVerified ?? false,
});

const getErrorMessage = (error = {}) => {
  const code = error?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use': return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Password must be at least 6 characters long.';
    case 'auth/operation-not-allowed': return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/user-not-found': return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential': return 'Invalid email or password. Please check your credentials.';
    case 'auth/user-disabled': return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed': return 'Network error. Please check your internet connection.';
    case 'auth/requires-recent-login': return 'Please log in again to complete this action.';
    case 'auth/internal-error': return 'An internal error occurred. Please try again.';
    case 'auth/missing-email': return 'Please enter your email address.';
    case 'auth/missing-password': return 'Please enter your password.';
    default:
      console.log('⚠️ Unknown error code:', code);
      return error?.message ?? 'An unexpected error occurred. Please try again.';
  }
};
 