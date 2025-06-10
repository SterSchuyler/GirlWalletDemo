import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

const WalletScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>
      
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>$2,500.00</Text>
        <Text style={styles.balanceCurrency}>USDC</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Swap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.transactionItem}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>Sent to Sarah</Text>
            <Text style={styles.transactionDate}>Today, 2:30 PM</Text>
          </View>
          <Text style={styles.transactionAmount}>-50.00 USDC</Text>
        </View>
        <View style={styles.transactionItem}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>Received from Maya</Text>
            <Text style={styles.transactionDate}>Yesterday, 4:15 PM</Text>
          </View>
          <Text style={[styles.transactionAmount, styles.receivedAmount]}>+100.00 USDC</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.large,
    paddingTop: theme.spacing.xlarge,
  },
  title: {
    fontSize: theme.typography.fontSize.xlarge,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  balanceCard: {
    margin: theme.spacing.medium,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: theme.typography.fontSize.medium,
    color: '#ffffff',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: theme.typography.fontFamily.medium,
    color: '#ffffff',
    marginVertical: theme.spacing.small,
  },
  balanceCurrency: {
    fontSize: theme.typography.fontSize.medium,
    color: '#ffffff',
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.medium,
  },
  actionButton: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
  },
  transactionsContainer: {
    padding: theme.spacing.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
    borderRadius: 8,
    marginBottom: theme.spacing.small,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  transactionDate: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.error,
  },
  receivedAmount: {
    color: '#4CAF50',
  },
});

export default WalletScreen; 