import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { walletService } from '../../src/lib/supabase';

export default function CreateWalletScreen() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const handleCreateWallet = async () => {
    if (!name.trim()) {
      setError('Please enter a wallet name');
      return;
    }

    if (!currentUser) {
      router.replace('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await walletService.createWallet(currentUser.id, name.trim());
      router.replace(`/(app)/wallet/${data.id}`);
    } catch (err: any) {
      console.error('Error creating wallet:', err);
      setError(err.message || 'Failed to create wallet');
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
            Create New Wallet
          </Text>

          <TextInput
            label="Wallet Name"
            value={name}
            onChangeText={setName}
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
            onPress={handleCreateWallet}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Wallet
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  error: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 