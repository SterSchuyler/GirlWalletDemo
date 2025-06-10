import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { Chat } from '../src/types';

type Currency = 'USDC' | 'SOL' | 'BTC';

export default function CreateWalletScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const { currentUser, chats, createWallet } = useApp();
  const [walletName, setWalletName] = useState('');
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [requiredSignatures, setRequiredSignatures] = useState('2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const chat = chats.find(c => c.id === chatId);
  const memberCount = chat?.members.length || 0;

  const handleCreateWallet = async () => {
    if (!currentUser || !chat) {
      setError('User or chat not found');
      return;
    }

    if (!walletName.trim()) {
      setError('Please enter a wallet name');
      return;
    }

    const signatures = parseInt(requiredSignatures);
    if (isNaN(signatures) || signatures < 2 || signatures > memberCount) {
      setError(`Required signatures must be between 2 and ${memberCount}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const wallet = await createWallet({
        name: walletName.trim(),
        currency,
        requiredSignatures: signatures,
        chatId: chat.id,
        members: chat.members,
      });

      // Update chat with wallet ID
      await chatService.updateChat(chat.id, { walletId: wallet.id });

      // Navigate to the new wallet
      router.replace({
        pathname: '/wallet/[id]',
        params: { id: wallet.id }
      });
    } catch (err: any) {
      console.error('Error creating wallet:', err);
      setError(err.message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  if (!chat) {
    return (
      <View style={styles.container}>
        <Text style={[styles.error, { color: theme.colors.error }]}>
          Chat not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Group Wallet
        </Text>

        <TextInput
          label="Wallet Name"
          value={walletName}
          onChangeText={setWalletName}
          style={styles.input}
          maxLength={50}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Select Currency
        </Text>

        <SegmentedButtons
          value={currency}
          onValueChange={value => setCurrency(value as Currency)}
          buttons={[
            { value: 'USDC', label: 'USDC (Base)' },
            { value: 'SOL', label: 'SOL' },
            { value: 'BTC', label: 'BTC' },
          ]}
          style={styles.segmentedButtons}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Required Signatures
        </Text>

        <TextInput
          label={`Required Signatures (2-${memberCount})`}
          value={requiredSignatures}
          onChangeText={setRequiredSignatures}
          keyboardType="numeric"
          style={styles.input}
        />

        {error && (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleCreateWallet}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Create Wallet
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  error: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
}); 