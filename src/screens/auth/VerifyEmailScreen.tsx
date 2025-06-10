import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { userService } from '../../services/userService';
import { useApp } from '../../context/AppContext';

type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyEmail'>;
type VerifyEmailScreenRouteProp = RouteProp<RootStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute<VerifyEmailScreenRouteProp>();
  const { setUser } = useApp();
  const theme = useTheme();

  const handleVerify = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await userService.verifyEmail({
        email: route.params.email,
        code,
      });
      setUser(user);
      navigation.replace('Main');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await userService.register({
        email: route.params.email,
        name: '', // This will be ignored since the user already exists
        password: '', // This will be ignored since the user already exists
      });
      setError('A new verification code has been sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification code');
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
            Verify Your Email
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Please enter the verification code sent to your email
          </Text>

          <TextInput
            label="Verification Code"
            value={code}
            onChangeText={setCode}
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
            onPress={handleVerify}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Verify Email
          </Button>

          <Button
            mode="text"
            onPress={handleResendCode}
            disabled={loading}
            style={styles.link}
          >
            Resend Code
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