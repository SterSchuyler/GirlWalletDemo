import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { userService } from '../../services/userService';
import { useApp } from '../../context/AppContext';
import { isValidPhoneNumber, isValidPin } from '../../utils/validation';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setUser } = useApp();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!isValidPin(pin)) {
      setError('PIN must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await userService.login({
        phoneNumber,
        pin,
      });
      setUser(user);
      navigation.replace('Main');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to your Girl Wallet account
          </Text>

          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!error}
          />

          {error ? (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Login
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.link}
          >
            Don't have an account? Register
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.link}
          >
            Forgot PIN?
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  link: {
    marginTop: 16,
  },
}); 