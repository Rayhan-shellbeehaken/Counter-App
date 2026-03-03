import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import { auth } from "@/config/firebaseConfig";

/* ---------------------------------
   SIGN UP
--------------------------------- */

export const signUpUser = async (email = "", password = "") => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential;
  } catch (error) {
    throw error;
  }
};

/* ---------------------------------
   SIGN IN
--------------------------------- */

export const signInUser = async (email = "", password = "") => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential;
  } catch (error) {
    throw error;
  }
};

/* ---------------------------------
   SIGN OUT
--------------------------------- */

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

/* ---------------------------------
   PASSWORD RESET
--------------------------------- */

export const sendPasswordReset = async (email = "") => {
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

/* ---------------------------------
   UPDATE USER PROFILE
--------------------------------- */

export const updateUserProfile = async (updates = {}) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No user is currently signed in");
  }

  try {
    await updateProfile(currentUser, updates);
  } catch (error) {
    throw error;
  }
};

/* ---------------------------------
   EMAIL VERIFICATION
--------------------------------- */

export const sendVerificationEmail = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No user is currently signed in");
  }

  try {
    await sendEmailVerification(currentUser);
  } catch (error) {
    throw error;
  }
};

/* ---------------------------------
   GET CURRENT USER
--------------------------------- */

export const getCurrentUser = () => {
  return auth.currentUser;
};
