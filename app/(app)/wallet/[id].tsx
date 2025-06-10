import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, ActivityIndicator, useTheme, List, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../../src/context/AppContext';
import { walletService } from '../../../src/services/walletService';
import { Wallet, Transaction } from '../../../src/types';
import { Ionicons } from '@expo/vector-icons';

export default function WalletDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useApp();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const fetchWalletData = async () => {
      try {
        console.log('Fetching wallet:', { id, userId: currentUser.id });
        const [walletData, transactionData] = await Promise.all([
          walletService.getWallet(id),
          walletService.getTransactionsByWallet(id)
        ]);
        
        console.log('Wallet data:', walletData);
        console.log('Transaction data:', transactionData);
        
        if (!walletData) {
          throw new Error('Wallet not found');
        }
        
        setWallet(walletData);
        setTransactions(transactionData);
      } catch (err: any) {
        console.error('Error fetching wallet data:', err);
        setError(err.message || 'Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [id, currentUser]);

  const handleReceive = () => {
    router.push({
      pathname: '/(app)/wallet/[id]/receive',
      params: { id }
    });
  };

  const handleSend = () => {
    router.push({
      pathname: '/(app)/wallet/[id]/send',
      params: { id }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading wallet...</Text>
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
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  if (!wallet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Wallet not found
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.walletCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.walletName}>
              {wallet.name}
            </Text>
            <Text variant="displaySmall" style={styles.balance}>
              {wallet.balance.toLocaleString()} {wallet.currency}
            </Text>
            <Text variant="bodyMedium" style={styles.currency}>
              {wallet.currency}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleReceive}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            icon="arrow-down"
          >
            Receive
          </Button>
          <Button
            mode="contained"
            onPress={handleSend}
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
            icon="arrow-up"
          >
            Send
          </Button>
        </View>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Wallet Details
            </Text>
            <Text variant="bodyMedium">
              Required Signatures: {wallet.requiredSignatures}
            </Text>
            <Text variant="bodyMedium">
              Members: {wallet.members.length}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.transactionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Transactions
            </Text>
            {transactions.length === 0 ? (
              <Text style={styles.noTransactions}>No transactions yet</Text>
            ) : (
              transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <List.Item
                    title={`${transaction.type === 'deposit' ? 'Received' : 'Sent'} ${transaction.amount} ${wallet.currency}`}
                    description={transaction.description}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon={transaction.type === 'deposit' ? 'arrow-down' : 'arrow-up'}
                        color={transaction.type === 'deposit' ? theme.colors.primary : theme.colors.secondary}
                      />
                    )}
                    right={props => (
                      <Text {...props} style={styles.transactionDate}>
                        {formatDate(transaction.date)}
                      </Text>
                    )}
                  />
                  {index < transactions.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </Card.Content>
        </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
  },
  walletCard: {
    marginBottom: 16,
  },
  walletName: {
    marginBottom: 8,
  },
  balance: {
    marginBottom: 4,
  },
  currency: {
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  detailsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  transactionsCard: {
    marginBottom: 16,
  },
  noTransactions: {
    textAlign: 'center',
    opacity: 0.7,
    marginVertical: 16,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 