import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, useTheme, Avatar, List } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { Wallet } from '../../src/types';
import { walletService } from '../../src/services/walletService';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentUser, chats } = useApp();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const chat = chats.find(c => c.walletId === id);

  useEffect(() => {
    const loadWallet = async () => {
      if (!id || !currentUser) {
        setError('Wallet ID or user not found');
        setLoading(false);
        return;
      }

      try {
        const loadedWallet = await walletService.getWallet(id as string);
        if (!loadedWallet) {
          setError('Wallet not found');
          return;
        }
        setWallet(loadedWallet);
      } catch (err: any) {
        console.error('Error loading wallet:', err);
        setError(err.message || 'Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, [id, currentUser]);

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
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.balanceLabel}>
              Balance
            </Text>
            <Text variant="displaySmall" style={styles.balance}>
              {wallet.balance} {wallet.currency}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Wallet Details
            </Text>
            <List.Item
              title="Name"
              description={wallet.name}
              left={props => <List.Icon {...props} icon="wallet" />}
            />
            <List.Item
              title="Currency"
              description={wallet.currency}
              left={props => <List.Icon {...props} icon="currency-usd" />}
            />
            <List.Item
              title="Required Signatures"
              description={`${wallet.requiredSignatures} of ${wallet.members.length}`}
              left={props => <List.Icon {...props} icon="account-multiple" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.membersCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Members
            </Text>
            {wallet.members.map((member) => (
              <List.Item
                key={member.id}
                title={member.name}
                description={member.email}
                left={props => (
                  <Avatar.Text
                    size={40}
                    label={member.name.substring(0, 2).toUpperCase()}
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => router.push({
              pathname: '/send',
              params: { walletId: wallet.id }
            })}
            style={styles.actionButton}
          >
            Send
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push({
              pathname: '/receive',
              params: { walletId: wallet.id }
            })}
            style={styles.actionButton}
          >
            Receive
          </Button>
        </View>
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
  balanceCard: {
    marginBottom: 16,
  },
  balanceLabel: {
    marginBottom: 8,
  },
  balance: {
    fontWeight: 'bold',
  },
  infoCard: {
    marginBottom: 16,
  },
  membersCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  error: {
    marginBottom: 16,
  },
}); 