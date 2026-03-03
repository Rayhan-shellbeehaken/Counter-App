import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';

import { auth, db } from '@/config/firebaseConfig';
import { clearUserFromStorage } from '@/services/secureStorage';

/* ---------------------------------
   DELETE ALL USER DATA FROM FIRESTORE
   Wipes the users/{uid} document.
   Extend this if you have more
   collections tied to the user.
--------------------------------- */

const deleteUserFirestoreData = async (uid = '') => {
  if (!uid) return;

  try {
    // Delete profile document
    await deleteDoc(doc(db, 'users', uid));
    console.log('🗑️ Firestore user data deleted');
  } catch (error) {
    console.error('❌ Failed to delete Firestore data:', error);
    throw error;
  }
};

/* ---------------------------------
   RE-AUTHENTICATE USER
   Firebase requires recent login
   before account deletion.
   Only needed for email/password users.
--------------------------------- */

export const reauthenticateUser = async (password = '') => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user signed in');

  const credential = EmailAuthProvider.credential(
    currentUser.email,
    password
  );

  await reauthenticateWithCredential(currentUser, credential);
};

/* ---------------------------------
   DELETE ACCOUNT
   1. Delete Firestore data
   2. Delete Firebase Auth account
   3. Clear local storage
   
   Zustand stores are cleared by
   AuthContext on auth state change.
--------------------------------- */

export const deleteAccount = async (uid = '') => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user signed in');

  // Step 1 — delete Firestore data first
  // (can't do it after Firebase Auth is deleted)
  await deleteUserFirestoreData(uid);

  // Step 2 — delete Firebase Auth account
  await deleteUser(currentUser);

  // Step 3 — clear local device storage
  await clearUserFromStorage();

  console.log('✅ Account fully deleted');
};