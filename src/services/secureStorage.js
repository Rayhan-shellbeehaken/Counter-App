import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'auth_user';

/* ---------------------------------
   SAVE USER
--------------------------------- */

export const saveUserToStorage = async (userData = null) => {
  try {
    if (!userData) {
      await SecureStore.deleteItemAsync(USER_KEY);
      return;
    }
    const serialized = JSON.stringify(userData);
    await SecureStore.setItemAsync(USER_KEY, serialized);
    console.log('💾 User saved to secure storage');
  } catch (error) {
    console.error('❌ Failed to save user to storage:', error);
  }
};

/* ---------------------------------
   LOAD USER
--------------------------------- */

export const loadUserFromStorage = async () => {
  try {
    const serialized = await SecureStore.getItemAsync(USER_KEY);
    if (!serialized) return null;
    console.log('📦 User loaded from secure storage');
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
    console.log('🗑️ User cleared from secure storage');
  } catch (error) {
    console.error('❌ Failed to clear user from storage:', error);
  }
};