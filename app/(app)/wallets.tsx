import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, ActivityIndicator, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { walletService } from '../../src/lib/supabase';
import { Wallet } from '../../src/types';

export default function WalletsScreen() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const fetchWallets = async () => {
      try {
        const data = await walletService.getWallets(currentUser.id);
        setWallets(data);
      } catch (err: any) {
        console.error('Error fetching wallets:', err);
        setError(err.message || 'Failed to load wallets');
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading wallets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
        <Button
          mode="contained"
          onPress={() => router.replace('/')}
          style={styles.button}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          My Wallets
        </Text>

        {wallets.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                You don't have any wallets yet
              </Text>
              <Button
                mode="contained"
                onPress={() => router.push('/(app)/createWallet')}
                style={styles.button}
              >
                Create Wallet
              </Button>
            </Card.Content>
          </Card>
        ) : (
          wallets.map((wallet) => (
            <Card
              key={wallet.id}
              style={styles.walletCard}
              onPress={() => router.push(`/(app)/wallet/${wallet.id}`)}
            >
              <Card.Content>
                <Text variant="titleLarge">{wallet.name}</Text>
                <Text variant="bodyMedium" style={styles.balance}>
                  Balance: ${wallet.balance.toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={styles.date}>
                  Created: {new Date(wallet.created_at).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}

        <Button
          mode="outlined"
          onPress={() => router.push('/(app)/createWallet')}
          style={styles.createButton}
        >
          Create New Wallet
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyCard: {
    marginBottom: 16,
  },
  emptyText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  walletCard: {
    marginBottom: 16,
  },
  balance: {
    marginTop: 8,
    color: '#666',
  },
  date: {
    marginTop: 4,
    color: '#999',
  },
  button: {
    marginTop: 8,
  },
  createButton: {
    marginTop: 16,
  },
}); 