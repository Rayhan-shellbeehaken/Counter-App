import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { auth } from '@/config/firebaseConfig';

/* ---------------------------------
   CONFIGURE
   Call this once when app starts.
--------------------------------- */

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '1071659976809-0f0oa7u5rfj9rkad4iqjrl7n4oqestu7.apps.googleusercontent.com',
    offlineAccess: true,
  });
};

/* ---------------------------------
   GOOGLE SIGN IN
   Returns Firebase UserCredential
--------------------------------- */

export const signInWithGoogle = async () => {
  // Ensure Google Play Services are available
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  // Open Google account picker
  const userInfo = await GoogleSignin.signIn();

  if (!userInfo?.idToken) {
    throw new Error('Google Sign-In failed: No ID token received');
  }

  // Create Firebase credential with Google ID token
  const googleCredential = GoogleAuthProvider.credential(
    userInfo.idToken
  );

  // Sign into Firebase
  const userCredential = await signInWithCredential(
    auth,
    googleCredential
  );

  return userCredential;
};

/* ---------------------------------
   GOOGLE SIGN OUT
--------------------------------- */

export const signOutFromGoogle = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
  } catch (error) {
    console.warn('Google signout warning:', error);
  }
};