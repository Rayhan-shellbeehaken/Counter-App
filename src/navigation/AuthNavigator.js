import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@/features/auth/screens/LoginScreen';
import SignupScreen from '@/features/auth/screens/SignupScreen';

 

const Stack = createNativeStackNavigator();
 

const defaultProps = {};

 

export default function AuthNavigator({} = defaultProps) {
  return renderAuthNavigator();
}
 

const renderAuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Login"
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);