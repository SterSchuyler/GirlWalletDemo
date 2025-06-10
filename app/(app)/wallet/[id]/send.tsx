import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, useTheme, TextInput, HelperText } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useApp } from '../../../../src/context/AppContext';
import { walletService } from '../../../../src/services/walletService';
import { Wallet } from '../../../../src/types';

export default function SendScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useApp();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const fetchWallet = async () => {
      try {
        const walletData = await walletService.getWallet(id);
        if (!walletData) {
          throw new Error('Wallet not found');
        }
        setWallet(walletData);
      } catch (err: any) {
        console.error('Error fetching wallet:', err);
        setError(err.message || 'Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [id, currentUser]);

  const handleSend = async () => {
    if (!wallet || !currentUser) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum > wallet.balance) {
      setError('Insufficient funds');
      return;
    }

    if (!recipient.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await walletService.createTransaction(
        wallet.id,
        'withdrawal',
        amountNum,
        description || 'Payment',
        currentUser.id
      );

      router.replace({
        pathname: '/(app)/wallet/[id]',
        params: { id: wallet.id }
      });
    } catch (err: any) {
      console.error('Error sending funds:', err);
      setError(err.message || 'Failed to send funds');
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading wallet...</Text>
      </View>
    );
  }

  if (error || !wallet) {
    return (
      <View style={styles.container}>
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error || 'Wallet not found'}
        </Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Send Funds',
          headerLeft: () => (
            <Button
              onPress={() => router.back()}
              textColor={theme.colors.primary}
            >
              Back
            </Button>
          ),
        }} 
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card style={styles.balanceCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Available Balance
              </Text>
              <Text variant="headlineMedium" style={styles.balance}>
                {wallet.balance.toLocaleString()} {wallet.currency}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                right={<TextInput.Affix text={wallet.currency} />}
                style={styles.input}
                error={!!error && error.includes('amount')}
              />
              <HelperText type="error" visible={!!error && error.includes('amount')}>
                {error}
              </HelperText>

              <TextInput
                label="Recipient Address"
                value={recipient}
                onChangeText={setRecipient}
                style={styles.input}
                error={!!error && error.includes('recipient')}
              />
              <HelperText type="error" visible={!!error && error.includes('recipient')}>
                {error}
              </HelperText>

              <TextInput
                label="Description (Optional)"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
                numberOfLines={2}
              />
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleSend}
            loading={sending}
            disabled={sending || !amount || !recipient}
            style={styles.sendButton}
          >
            Send {wallet.currency}
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
  balanceCard: {
    marginBottom: 16,
  },
  balance: {
    marginTop: 8,
  },
  formCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  sendButton: {
    marginTop: 8,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
  },
}); 