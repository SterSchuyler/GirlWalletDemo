import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { userService } from '../../services/userService';
import { verificationService } from '../../services/verificationService';
import { isValidPhoneNumber, isValidPin } from '../../utils/validation';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const theme = useTheme();

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!isValidPin(pin)) {
      setError('PIN must be 6 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if we can request a new code
      const canRequest = await verificationService.canRequestNewCode(phoneNumber);
      if (!canRequest) {
        setError('Please wait 1 minute before requesting a new code');
        return;
      }

      // Generate and store verification code
      await verificationService.generateAndStoreCode(phoneNumber);

      // Navigate to verification screen
      navigation.navigate('VerifyPhone', {
        phoneNumber,
        onVerificationComplete: async () => {
          try {
            // After verification, complete registration
            await userService.register({
              name: name.trim(),
              phoneNumber,
              pin,
            });
            navigation.replace('Login');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to complete registration');
          }
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start registration');
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
            Join Girl Wallet to start sending and receiving money securely
          </Text>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="PIN (6 digits)"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Confirm PIN"
            value={confirmPin}
            onChangeText={setConfirmPin}
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
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.link}
          >
            Already have an account? Login
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