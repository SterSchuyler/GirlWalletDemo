import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { verificationService } from '../../services/verificationService';
import { isValidVerificationCode } from '../../utils/validation';

type VerifyPhoneScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyPhone'>;
type VerifyPhoneScreenRouteProp = RouteProp<RootStackParamList, 'VerifyPhone'>;

export default function VerifyPhoneScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigation = useNavigation<VerifyPhoneScreenNavigationProp>();
  const route = useRoute<VerifyPhoneScreenRouteProp>();
  const theme = useTheme();

  const { phoneNumber, onVerificationComplete } = route.params;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleVerify = async () => {
    if (!isValidVerificationCode(code)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await verificationService.verifyCode(phoneNumber, code);
      if (isValid) {
        onVerificationComplete();
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      setError(`Please wait ${countdown} seconds before requesting a new code`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const canRequest = await verificationService.canRequestNewCode(phoneNumber);
      if (!canRequest) {
        setError('Please wait 1 minute before requesting a new code');
        return;
      }

      await verificationService.generateAndStoreCode(phoneNumber);
      setCountdown(60); // Start 60-second countdown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
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
            Verify Phone Number
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Enter the 6-digit code sent to {phoneNumber}
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
            Verify
          </Button>

          <Button
            mode="text"
            onPress={handleResendCode}
            disabled={loading || countdown > 0}
            style={styles.link}
          >
            {countdown > 0
              ? `Resend code in ${countdown}s`
              : 'Resend verification code'}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.link}
          >
            Back
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