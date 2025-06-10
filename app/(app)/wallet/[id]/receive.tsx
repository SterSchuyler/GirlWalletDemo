import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Share } from 'react-native';
import { Text, Button, Card, useTheme, TextInput, List } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useApp } from '../../../../src/context/AppContext';
import { walletService } from '../../../../src/services/walletService';
import { Wallet } from '../../../../src/types';

export default function ReceiveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useApp();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
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

  const handleShare = async () => {
    if (!wallet) return;

    const message = `Send ${amount || 'any amount'} ${wallet.currency} to our group wallet "${wallet.name}"\n\nWallet Address: ${wallet.id}`;
    try {
      await Share.share({
        message,
        title: 'Share Wallet Address',
      });
    } catch (error) {
      console.error('Error sharing wallet:', error);
    }
  };

  const handleCopyAddress = () => {
    if (!wallet) return;
    // TODO: Implement clipboard functionality
    // For now, just show a success message
    alert('Wallet address copied to clipboard');
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
          title: 'Receive Funds',
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
          <Card style={styles.addressCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Wallet Address
              </Text>
              <List.Item
                title={wallet.id}
                description="Tap to copy"
                onPress={handleCopyAddress}
                right={props => (
                  <List.Icon {...props} icon="content-copy" />
                )}
              />
            </Card.Content>
          </Card>

          <Card style={styles.amountCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Request Amount
              </Text>
              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                right={<TextInput.Affix text={wallet.currency} />}
                style={styles.input}
              />
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleShare}
            style={styles.shareButton}
            icon="share"
          >
            Share Wallet Address
          </Button>

          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                How to Receive Funds
              </Text>
              <List.Item
                title="1. Share your wallet address"
                description="Use the share button above to send your wallet address to others"
                left={props => <List.Icon {...props} icon="share" />}
              />
              <List.Item
                title="2. Wait for the transfer"
                description="The sender will need to use your wallet address to send funds"
                left={props => <List.Icon {...props} icon="clock-outline" />}
              />
              <List.Item
                title="3. Check your balance"
                description="Once received, the funds will appear in your wallet balance"
                left={props => <List.Icon {...props} icon="wallet" />}
              />
            </Card.Content>
          </Card>
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
  addressCard: {
    marginBottom: 16,
  },
  amountCard: {
    marginBottom: 16,
  },
  infoCard: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  shareButton: {
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