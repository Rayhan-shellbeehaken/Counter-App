import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { useAuth } from '@/hooks/useAuth';

/* ---------------------------------
   HOOK
   Owns all logic for LoginScreen.
   Screen only renders — no logic there.
--------------------------------- */

export const useLoginForm = () => {
  const { login, loginWithGoogle } = useAuth();

  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,         setError]         = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email:    '',
      password: '',
    },
  });

  /* ---------------------------------
     EMAIL LOGIN
  --------------------------------- */
  const onSubmit = async ({ email = '', password = '' } = {}) => {
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result?.success) {
        const msg = result?.error ?? 'Invalid email or password';
        setError(msg);
        Alert.alert('Login Failed', msg);
      }
      // success → AuthContext updates user → navigator handles redirect
    } catch {
      const msg = 'An unexpected error occurred. Please try again.';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------
     GOOGLE LOGIN
  --------------------------------- */
  const onGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result?.success && !result?.cancelled) {
        Alert.alert(
          'Google Sign-In Failed',
          result?.error ?? 'Please try again.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    // form
    control,
    errors,
    error,
    // state
    loading,
    googleLoading,
    // handlers
    onSubmit:      handleSubmit(onSubmit),
    onGoogleLogin,
  };
};