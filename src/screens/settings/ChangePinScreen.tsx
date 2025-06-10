import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { pinService } from '../../services/pinService';
import { userService } from '../../services/userService';
import { useApp } from '../../context/AppContext';
import { isValidPin } from '../../utils/validation';

type ChangePinScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChangePin'>;

export default function ChangePinScreen() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<ChangePinScreenNavigationProp>();
  const { user } = useApp();
  const theme = useTheme();

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const handleChangePin = async () => {
    if (!user) {
      setError('You must be logged in to change your PIN');
      return;
    }

    if (!isValidPin(currentPin)) {
      setError('Current PIN must be 6 digits');
      return;
    }

    if (!isValidPin(newPin)) {
      setError('New PIN must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify current PIN
      await userService.login({
        phoneNumber: user.phoneNumber,
        pin: currentPin,
      });

      // Update PIN
      await pinService.updatePin(user.id, currentPin, newPin);

      // Update user's PIN in the app
      await userService.updatePin(user.id, newPin);

      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change PIN');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

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
            Change PIN
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Enter your current PIN and choose a new one
          </Text>

          <TextInput
            label="Current PIN"
            value={currentPin}
            onChangeText={setCurrentPin}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!error}
          />

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

          {error ? (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleChangePin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Change PIN
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.link}
          >
            Cancel
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