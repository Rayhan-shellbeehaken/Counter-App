import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { useAuth } from '@/hooks/useAuth';

/* ---------------------------------
   HOOK
   Owns all logic for SignupScreen.
   Screen only renders — no logic there.
--------------------------------- */

export const useSignupForm = () => {
  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email:           '',
      password:        '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  /* ---------------------------------
     SIGNUP
  --------------------------------- */
  const onSubmit = async ({ email = '', password = '' } = {}) => {
    setError('');
    setLoading(true);
    try {
      const result = await signup(email, password);
      if (!result?.success) {
        const msg = result?.error ?? 'Could not create account';
        setError(msg);
        Alert.alert('Signup Failed', msg);
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

  return {
    // form
    control,
    errors,
    error,
    password,   // needed for confirmPassword validation
    // state
    loading,
    // handlers
    onSubmit: handleSubmit(onSubmit),
  };
};