import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Wallet } from '../../types/wallet';

interface WalletCardProps {
  wallet: Wallet;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  return (
    <Card style={styles.balanceCard}>
      <Card.Content>
        <Text variant="titleLarge">{wallet.name}</Text>
        <Text variant="displaySmall" style={styles.balance}>
          ${wallet.balance.toLocaleString()}
        </Text>
        <Text variant="bodyMedium" style={styles.currency}>
          {wallet.currency}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    margin: 16,
  },
  balance: {
    marginTop: 8,
    color: '#2196F3',
  },
  currency: {
    color: '#666',
  },
}); 