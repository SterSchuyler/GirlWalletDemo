import { Redirect, Stack } from 'expo-router';
import { useApp } from '../../src/context/AppContext';

export default function AuthLayout() {
  const { currentUser, isLoading } = useApp();

  // Show loading state
  if (isLoading) {
    return null;
  }

  // If user is logged in, redirect to home
  if (currentUser) {
    return <Redirect href="/" />;
  }

  // If user is not logged in, show auth screens
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 