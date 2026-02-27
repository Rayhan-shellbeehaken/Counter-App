import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import { db, auth } from '@/config/firebaseConfig';

/* ---------------------------------
   COLLECTION
   Each user gets their own document:
   users/{uid}  →  { displayName, photoURL, updatedAt }
--------------------------------- */

const getUserDocRef = (uid = '') => doc(db, 'users', uid);

/* ---------------------------------
   SAVE PROFILE TO FIRESTORE
   Called on update. Creates or merges
   the document so existing fields
   are never accidentally wiped.
--------------------------------- */

export const saveProfileToFirestore = async ({
  uid         = '',
  displayName = null,
  photoURL    = null,
} = {}) => {
  if (!uid) throw new Error('uid is required');

  const payload = { updatedAt: new Date().toISOString() };
  if (displayName !== null) payload.displayName = displayName;
  if (photoURL    !== null) payload.photoURL    = photoURL;

  await setDoc(getUserDocRef(uid), payload, { merge: true });
};

/* ---------------------------------
   LOAD PROFILE FROM FIRESTORE
   Returns { displayName, photoURL }
   or null if no document exists yet.
--------------------------------- */

export const loadProfileFromFirestore = async (uid = '') => {
  if (!uid) return null;

  try {
    const snap = await getDoc(getUserDocRef(uid));
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      displayName: data?.displayName ?? null,
      photoURL:    data?.photoURL    ?? null,
    };
  } catch (error) {
    console.error('❌ Failed to load profile from Firestore:', error);
    return null;
  }
};

/* ---------------------------------
   UPDATE DISPLAY NAME
   Saves to both Firebase Auth and
   Firestore so it's always in sync.
--------------------------------- */

export const updateDisplayName = async (uid = '', displayName = '') => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user signed in');

  // Update Firebase Auth
  await updateProfile(currentUser, { displayName });

  // Update Firestore
  await saveProfileToFirestore({ uid, displayName });
};

/* ---------------------------------
   UPDATE PHOTO
   Firestore only — Firebase Auth
   rejects base64 (255 char limit).
--------------------------------- */

export const updatePhotoURL = async (uid = '', photoURL = '') => {
  if (!uid) throw new Error('uid is required');
  await saveProfileToFirestore({ uid, photoURL });
};

/* ---------------------------------
   UPDATE BOTH AT ONCE
--------------------------------- */

export const updateUserProfile = async ({
  uid         = '',
  displayName = null,
  photoURL    = null,
} = {}) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user signed in');

  // displayName → Firebase Auth + Firestore
  if (displayName !== null) {
    await updateProfile(currentUser, { displayName });
  }

  // Both fields → Firestore
  await saveProfileToFirestore({ uid, displayName, photoURL });

  return { displayName, photoURL };
};