import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Button } from 'react-native-paper';
import { Transaction } from '../../types/wallet';

interface TransactionCardProps {
  transaction: Transaction;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  currentUserId?: string;
}

export default function TransactionCard({
  transaction,
  onApprove,
  onReject,
  onDelete,
  currentUserId,
}: TransactionCardProps) {
  return (
    <Card style={styles.transactionCard}>
      <Card.Content>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text variant="titleMedium">{transaction.description}</Text>
            <Text
              variant="titleMedium"
              style={[
                styles.amount,
                transaction.type === 'income' ? styles.income : styles.expense,
              ]}
            >
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
            </Text>
          </View>
          {transaction.status === 'pending' && currentUserId && (
            <View style={styles.approvalButtons}>
              <IconButton
                icon="check"
                mode="contained"
                size={20}
                onPress={onApprove}
                disabled={transaction.approvedBy?.includes(currentUserId)}
                style={[styles.approvalButton, styles.approveButton]}
              />
              <IconButton
                icon="close"
                mode="contained"
                size={20}
                onPress={onReject}
                disabled={transaction.rejectedBy?.includes(currentUserId)}
                style={[styles.approvalButton, styles.rejectButton]}
              />
            </View>
          )}
        </View>
        <View style={styles.transactionDetails}>
          <Text variant="bodySmall" style={styles.date}>
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
          <Text variant="bodySmall" style={styles.status}>
            Status: {transaction.status}
          </Text>
          {transaction.status === 'pending' && (
            <Text variant="bodySmall" style={styles.approvalStatus}>
              Approved: {transaction.approvedBy?.length || 0} | Rejected: {transaction.rejectedBy?.length || 0}
            </Text>
          )}
        </View>
        {currentUserId && transaction.createdBy === currentUserId && (
          <Button
            mode="text"
            onPress={onDelete}
            style={styles.deleteButton}
          >
            Delete
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flex: 1,
  },
  amount: {
    fontWeight: 'bold',
  },
  income: {
    color: '#4CAF50',
  },
  expense: {
    color: '#F44336',
  },
  transactionDetails: {
    marginTop: 8,
  },
  date: {
    color: '#666',
  },
  status: {
    color: '#666',
    marginTop: 4,
  },
  approvalStatus: {
    color: '#666',
    marginTop: 4,
  },
  approvalButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  approvalButton: {
    margin: 0,
    marginLeft: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
}); 