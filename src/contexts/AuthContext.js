import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'react-native';

import { auth } from '@/config/firebaseConfig';
import { signUpUser, signInUser, signOutUser } from '@/services/authService';
import { saveUserToStorage, loadUserFromStorage, clearUserFromStorage } from '@/services/secureStorage';
import { loadProfileFromFirestore, updateUserProfile as firestoreUpdateProfile } from '@/services/firestoreProfileService';
import { signInWithGoogle, signOutFromGoogle, configureGoogleSignIn } from '@/services/googleAuthService';
import { deleteAccount, reauthenticateUser } from '@/services/accountDeletionService';

/* ---------------------------------
   CONTEXT
--------------------------------- */

export const AuthContext = createContext({});

// Configure Google Sign-In once at module level
configureGoogleSignIn();

/* ---------------------------------
   PROVIDER
--------------------------------- */

export function AuthProvider({ children = null }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      // Show cached user instantly while Firebase confirms session
      const storedUser = await loadUserFromStorage();
      if (storedUser) setUser(storedUser);

      const unsubscribe = subscribeToAuthChanges();
      return unsubscribe;
    };

    const unsubscribePromise = bootstrap();
    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe?.());
    };
  }, []);

  /* ---------------------------------
     AUTH STATE LISTENER
     Fires on: login, logout, token refresh
     Merges Firebase Auth + Firestore profile
  --------------------------------- */
  const subscribeToAuthChanges = () =>
    onAuthStateChanged(auth, handleAuthStateChange, handleAuthError);

  const handleAuthStateChange = async (firebaseUser = null) => {
    if (firebaseUser) {
      const userData = await buildUserData(firebaseUser);
      setUser(userData);
      await saveUserToStorage(userData);
    } else {
      setUser(null);
      await clearUserFromStorage();
    }
    setLoading(false);
  };

  const handleAuthError = (err = null) => {
    console.error('❌ Auth state error:', err);
    setLoading(false);
  };

  /* ---------------------------------
     EMAIL / PASSWORD LOGIN
  --------------------------------- */
  const login = async (email = '', password = '') => {
    try {
      setError(null);
      setLoading(true);
      const { user: firebaseUser } = await signInUser(email, password);
      const userData = await buildUserData(firebaseUser);
      setUser(userData);
      await saveUserToStorage(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------
     EMAIL / PASSWORD SIGNUP
  --------------------------------- */
  const signup = async (email = '', password = '') => {
    try {
      setError(null);
      setLoading(true);
      const { user: firebaseUser } = await signUpUser(email, password);
      const userData = extractUserData(firebaseUser);
      setUser(userData);
      await saveUserToStorage(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert('Signup Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------
     GOOGLE SIGN IN
     Google provides real name + photo
     so profile feels complete immediately.
  --------------------------------- */
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const { user: firebaseUser } = await signInWithGoogle();
      const userData = await buildUserData(firebaseUser);
      setUser(userData);
      await saveUserToStorage(userData);
      return { success: true, user: userData };
    } catch (err) {
      // User cancelled — not an error worth alerting
      if (err?.code === 'SIGN_IN_CANCELLED' || err?.code === '-5') {
        return { success: false, cancelled: true };
      }
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert('Google Sign-In Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------
     LOGOUT
  --------------------------------- */
  const logout = async () => {
    try {
      setError(null);
      await signOutUser();
      await signOutFromGoogle(); // no-op if not a Google session
      setUser(null);
      await clearUserFromStorage();
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert('Logout Failed', message);
      return { success: false, error: message };
    }
  };

  /* ---------------------------------
     UPDATE PROFILE
     displayName → Firebase Auth + Firestore
     photoURL    → Firestore only (base64 too large for Auth)
  --------------------------------- */
  const updateProfile = async ({
    displayName = null,
    photoURL    = null,
  } = {}) => {
    try {
      setError(null);
      const uid = user?.uid;
      if (!uid) throw new Error('No user signed in');

      await firestoreUpdateProfile({ uid, displayName, photoURL });

      const updatedUser = {
        ...user,
        ...(displayName !== null && { displayName }),
        ...(photoURL    !== null && { photoURL }),
      };

      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      const message = err?.message ?? 'Failed to update profile.';
      setError(message);
      Alert.alert('Update Failed', message);
      return { success: false, error: message };
    }
  };

  /* ---------------------------------
     DELETE ACCOUNT
     Email users  → prompted for password (re-auth required)
     Google users → confirmed via Alert only (token is fresh)
     Wipes: Firestore data, Firebase Auth, SecureStore
  --------------------------------- */
  const removeAccount = () => {
    const uid         = user?.uid;
    const isGoogleUser = user?.providerData === 'google.com';

    return new Promise((resolve) => {
      if (isGoogleUser) {
        showDeleteConfirmation(uid, resolve);
      } else {
        showPasswordPrompt(uid, resolve);
      }
    });
  };

  const showDeleteConfirmation = (uid = '', resolve = () => {}) => {
    Alert.alert(
      '⚠️ Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve({ success: false }) },
        {
          text:    'Delete',
          style:   'destructive',
          onPress: () => performDeletion(uid, resolve),
        },
      ]
    );
  };

  const showPasswordPrompt = (uid = '', resolve = () => {}) => {
    Alert.prompt(
      '⚠️ Confirm Deletion',
      'Enter your password to permanently delete your account.',
      async (password) => {
        if (!password) { resolve({ success: false }); return; }
        try {
          await reauthenticateUser(password);
          performDeletion(uid, resolve);
        } catch {
          Alert.alert('Error', 'Incorrect password. Please try again.');
          resolve({ success: false, error: 'Incorrect password' });
        }
      },
      'secure-text'
    );
  };

  const performDeletion = async (uid = '', resolve = () => {}) => {
    try {
      await deleteAccount(uid);
      setUser(null);
      resolve({ success: true });
    } catch (err) {
      const message = err?.message ?? 'Failed to delete account.';
      Alert.alert('Deletion Failed', message);
      resolve({ success: false, error: message });
    }
  };

  /* ---------------------------------
     CONTEXT VALUE
  --------------------------------- */
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    // auth actions
    login,
    signup,
    loginWithGoogle,
    logout,
    // profile actions
    updateProfile,
    removeAccount,
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------------------------
   HELPERS
--------------------------------- */

// Builds full user object — Firebase Auth base + Firestore override
const buildUserData = async (firebaseUser = {}) => {
  const baseData      = extractUserData(firebaseUser);
  const firestoreData = await loadProfileFromFirestore(baseData.uid);
  return mergeWithFirestore(baseData, firestoreData);
};

const extractUserData = (firebaseUser = {}) => ({
  uid:           firebaseUser.uid                           ?? null,
  email:         firebaseUser.email                         ?? null,
  displayName:   firebaseUser.displayName                   ?? null,
  photoURL:      firebaseUser.photoURL                      ?? null,
  emailVerified: firebaseUser.emailVerified                 ?? false,
  providerData:  firebaseUser.providerData?.[0]?.providerId ?? 'password',
});

const mergeWithFirestore = (base = {}, firestoreData = null) => {
  if (!firestoreData) return base;
  return {
    ...base,
    ...(firestoreData.displayName && { displayName: firestoreData.displayName }),
    ...(firestoreData.photoURL    && { photoURL:    firestoreData.photoURL }),
  };
};

const getErrorMessage = (error = {}) => {
  switch (error?.code) {
    case 'auth/email-already-in-use':   return 'This email is already registered.';
    case 'auth/invalid-email':          return 'Please enter a valid email address.';
    case 'auth/weak-password':          return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':         return 'No account found with this email.';
    case 'auth/wrong-password':         return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':     return 'Invalid email or password.';
    case 'auth/user-disabled':          return 'This account has been disabled.';
    case 'auth/too-many-requests':      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    case 'auth/requires-recent-login':  return 'Please log in again to complete this action.';
    default:
      return error?.message ?? 'An unexpected error occurred.';
  }
};