import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { userService } from '../../services/userService';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'pin'>('phone');
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const theme = useTheme();

  const handleRequestCode = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userService.requestPasswordReset(phoneNumber);
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userService.verifyPasswordResetCode(phoneNumber, code);
      setStep('pin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async () => {
    if (!newPin || !confirmPin) {
      setError('Please fill in all fields');
      return;
    }

    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (newPin.length < 6) {
      setError('PIN must be at least 6 digits long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userService.resetPassword(phoneNumber, code, newPin);
      navigation.replace('Login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset PIN');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return (
          <>
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              style={styles.input}
              error={!!error}
            />
            <Button
              mode="contained"
              onPress={handleRequestCode}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Send Verification Code
            </Button>
          </>
        );
      case 'code':
        return (
          <>
            <TextInput
              label="Verification Code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              error={!!error}
            />
            <Button
              mode="contained"
              onPress={handleVerifyCode}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Verify Code
            </Button>
          </>
        );
      case 'pin':
        return (
          <>
            <TextInput
              label="New PIN"
              value={newPin}
              onChangeText={setNewPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              error={!!error}
            />
            <TextInput
              label="Confirm New PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              error={!!error}
            />
            <Button
              mode="contained"
              onPress={handleResetPin}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Reset PIN
            </Button>
          </>
        );
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
            Reset PIN
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {step === 'phone'
              ? 'Enter your phone number to receive a verification code'
              : step === 'code'
              ? 'Enter the verification code sent to your phone'
              : 'Enter your new PIN'}
          </Text>

          {renderStep()}

          {error ? (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.link}
          >
            Back to Login
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