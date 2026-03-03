import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'auth_user';

/* ---------------------------------
   SAVE USER
   Strips photoURL before saving —
   base64 strings exceed SecureStore's
   2048 byte limit. Photo lives in
   Firestore instead.
--------------------------------- */

export const saveUserToStorage = async (userData = null) => {
  try {
    if (!userData) {
      await SecureStore.deleteItemAsync(USER_KEY);
      return;
    }

    // Strip photo — stored in Firestore, not locally
    const { photoURL, ...userWithoutPhoto } = userData;
    const serialized = JSON.stringify(userWithoutPhoto);
    await SecureStore.setItemAsync(USER_KEY, serialized);
  } catch (error) {
    console.error('❌ Failed to save user to storage:', error);
  }
};

/* ---------------------------------
   LOAD USER
   Returns base user data without photo.
   AuthContext merges the Firestore photo
   on top after loading.
--------------------------------- */

export const loadUserFromStorage = async () => {
  try {
    const serialized = await SecureStore.getItemAsync(USER_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('❌ Failed to load user from storage:', error);
    return null;
  }
};

/* ---------------------------------
   CLEAR USER
--------------------------------- */

export const clearUserFromStorage = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('❌ Failed to clear user from storage:', error);
  }
};