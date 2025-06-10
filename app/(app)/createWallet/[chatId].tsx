import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, useTheme, SegmentedButtons } from 'react-native-paper';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useApp } from '../../../src/context/AppContext';
import { Chat } from '../../../src/types';
import { Currency } from '../../../src/types/wallet';
import { User } from '../../../src/types/user';
import { userService } from '../../../src/services/userService';

export default function CreateWalletScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const { currentUser, chats, createWallet } = useApp();
  const theme = useTheme();

  const [walletName, setWalletName] = useState('');
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [requiredSignatures, setRequiredSignatures] = useState('2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<User[]>([]);

  const chat = chats.find((c: Chat) => c.id === chatId);
  const maxSignatures = chat?.members.length || 2;

  useEffect(() => {
    const fetchMembers = async () => {
      if (!chat) return;

      try {
        // For now, create mock user objects since we don't have a real user service
        const mockMembers: User[] = chat.members.map((memberId, index) => ({
          id: memberId,
          name: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          password: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isVerified: true,
          preferences: {
            notifications: {
              push: true,
              sms: true
            },
            privacy: {
              showBalance: true,
              showTransactions: true,
              showGroups: true
            },
            theme: 'light',
            language: 'en'
          }
        }));
        setMembers(mockMembers);
      } catch (err) {
        console.error('Error fetching member details:', err);
        setError('Failed to load member details');
      }
    };

    fetchMembers();
  }, [chat]);

  const handleCreateWallet = async () => {
    if (!walletName.trim()) {
      setError('Please enter a wallet name');
      return;
    }

    const signatures = parseInt(requiredSignatures);
    if (isNaN(signatures) || signatures < 2 || signatures > maxSignatures) {
      setError(`Required signatures must be between 2 and ${maxSignatures}`);
      return;
    }

    if (!chat) {
      setError('Chat not found');
      return;
    }

    if (members.length === 0) {
      setError('Failed to load member details');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const wallet = await createWallet({
        name: walletName.trim(),
        currency,
        requiredSignatures: signatures,
        chatId: chatId as string,
        members,
      });

      router.replace({
        pathname: '/(app)/wallet/[id]',
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
        <Text>Chat not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Create Group Wallet',
          headerLeft: () => (
            <Button
              onPress={() => router.back()}
              textColor={theme.colors.primary}
            >
              Cancel
            </Button>
          ),
        }} 
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Wallet Name"
                value={walletName}
                onChangeText={setWalletName}
                style={styles.input}
              />

              <Text variant="titleMedium" style={styles.sectionTitle}>
                Currency
              </Text>

              <SegmentedButtons
                value={currency}
                onValueChange={value => setCurrency(value as Currency)}
                buttons={[
                  { value: 'USDC', label: 'USDC' },
                  { value: 'SOL', label: 'SOL' },
                  { value: 'BTC', label: 'BTC' },
                ]}
                style={styles.currencyButtons}
              />

              <TextInput
                label="Required Signatures"
                value={requiredSignatures}
                onChangeText={setRequiredSignatures}
                keyboardType="number-pad"
                style={styles.input}
                right={
                  <TextInput.Affix text={`/ ${maxSignatures}`} />
                }
              />

              <Text variant="bodySmall" style={styles.helperText}>
                At least 2 signatures are required to approve transactions
              </Text>
            </Card.Content>
          </Card>

          {error && (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleCreateWallet}
            loading={loading}
            disabled={loading || !walletName.trim() || members.length === 0}
            style={styles.createButton}
          >
            Create Wallet
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  formCard: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  currencyButtons: {
    marginBottom: 16,
  },
  helperText: {
    marginTop: -8,
    marginBottom: 16,
    opacity: 0.7,
  },
  createButton: {
    marginTop: 16,
  },
  error: {
    marginBottom: 16,
  },
}); 