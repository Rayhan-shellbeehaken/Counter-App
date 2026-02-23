import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/config/firebaseConfig";
import { signUpUser, signInUser, signOutUser } from "@/services/authService";

export const AuthContext = createContext({});

const defaultProps = {
  children: null,
};

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
    if (firebaseUser) {
      const userData = extractUserData(firebaseUser);
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const handleAuthError = (error = null) => {
    console.error("Auth state error:", error);
    setLoading(false);
  };

  const signup = async (email = "", password = "") => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signUpUser(email, password);
      const userData = extractUserData(userCredential.user);

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email = "", password = "") => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInUser(email, password);
      const userData = extractUserData(userCredential.user);

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
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
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
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

const renderProvider = ({
  value = {},
  loading = true,
  children = null,
} = {}) => {
  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const extractUserData = (firebaseUser = {}) => ({
  uid: firebaseUser.uid ?? null,
  email: firebaseUser.email ?? null,
  displayName: firebaseUser.displayName ?? null,
  photoURL: firebaseUser.photoURL ?? null,
  emailVerified: firebaseUser.emailVerified ?? false,
});

const getErrorMessage = (error = {}) => {
  const code = error?.code ?? "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Email is already registered";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later";
    case "auth/network-request-failed":
      return "Network error. Check your connection";
    default:
      return error?.message ?? "An error occurred";
  }
};
