import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { register } = useApp();
  const theme = useTheme();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(email, password, name);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
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
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign up to get started
          </Text>

          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
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
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => router.push('/login')}
            style={styles.linkButton}
          >
            Already have an account? Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  content: { padding: 16 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 24, color: '#666' },
  input: { marginBottom: 16 },
  error: { marginBottom: 16 },
  button: { marginTop: 8 },
  linkButton: { marginTop: 16 },
}); 