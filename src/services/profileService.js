import { updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';

/* ---------------------------------
   UPDATE DISPLAY NAME
--------------------------------- */

export const updateDisplayName = async (displayName = '') => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user signed in');

  await updateProfile(currentUser, { displayName });
  return displayName;
};

/* ---------------------------------
   UPDATE PHOTO URL
   Accepts a base64 data URI directly
   (no Firebase Storage needed)
--------------------------------- */

export const updatePhotoURL = async (photoURL = '') => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user signed in');

  await updateProfile(currentUser, { photoURL });
  return photoURL;
};

/* ---------------------------------
   UPDATE BOTH AT ONCE
--------------------------------- */

export const updateUserProfile = async ({
  displayName = null,
  photoURL    = null,
} = {}) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user signed in');

  const updates = {};
  if (displayName !== null) updates.displayName = displayName;
  if (photoURL    !== null) updates.photoURL    = photoURL;

  await updateProfile(currentUser, updates);
  return updates;
};