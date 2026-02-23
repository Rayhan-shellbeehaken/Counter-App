import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'react-native';

import { auth } from '@/config/firebaseConfig';
import {
  signUpUser,
  signInUser,
  signOutUser,
} from '@/services/authService';

/* ---------------------------------
   CONTEXT CREATION
--------------------------------- */

export const AuthContext = createContext({});

/* ---------------------------------
   DEFAULT PROPS
--------------------------------- */

const defaultProps = {
  children: null,
};

/* ---------------------------------
   PROVIDER COMPONENT
--------------------------------- */

export function AuthProvider({
  children = defaultProps.children,
} = defaultProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges();
    return unsubscribe;
  }, []);

  const subscribeToAuthChanges = () => {
    return onAuthStateChanged(auth, handleAuthStateChange, handleAuthError);
  };

  const handleAuthStateChange = (firebaseUser = null) => {
    console.log('🔐 Auth state changed:', firebaseUser ? 'Logged in' : 'Logged out');
    
    if (firebaseUser) {
      const userData = extractUserData(firebaseUser);
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const handleAuthError = (error = null) => {
    console.error('❌ Auth state error:', error);
    setLoading(false);
  };

  const signup = async (email = '', password = '') => {
    try {
      console.log('📝 Attempting signup for:', email);
      setError(null);
      setLoading(true);

      const userCredential = await signUpUser(email, password);
      const userData = extractUserData(userCredential.user);

      console.log('✅ Signup successful:', userData.email);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      console.error('❌ Signup error:', err.code, err.message);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      // Show alert for better visibility
      Alert.alert('Signup Failed', errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email = '', password = '') => {
    try {
      console.log('🔑 Attempting login for:', email);
      setError(null);
      setLoading(true);

      const userCredential = await signInUser(email, password);
      const userData = extractUserData(userCredential.user);

      console.log('✅ Login successful:', userData.email);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      console.error('❌ Login error:', err.code, err.message);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      // Show alert for better visibility
      Alert.alert('Login Failed', errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Attempting logout');
      setError(null);
      await signOutUser();
      setUser(null);
      console.log('✅ Logout successful');
      return { success: true };
    } catch (err) {
      console.error('❌ Logout error:', err);
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

const renderProvider = ({
  value = {},
  loading = true,
  children = null,
} = {}) => {
  if (loading) {
    return null; // Or return <SplashScreen />
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ---------------------------------
   HELPERS
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

  console.log('🔍 Error code:', code);

  switch (code) {
    // Signup errors
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    
    // Login errors
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    
    // Common errors
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/requires-recent-login':
      return 'Please log in again to complete this action.';
    
    // Password reset errors
    case 'auth/expired-action-code':
      return 'This link has expired. Please request a new one.';
    case 'auth/invalid-action-code':
      return 'This link is invalid. Please request a new one.';
    
    // General errors
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again.';
    case 'auth/missing-email':
      return 'Please enter your email address.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    
    default:
      // Log unknown errors for debugging
      console.log('⚠️ Unknown error code:', code);
      return error?.message ?? 'An unexpected error occurred. Please try again.';
  }
};