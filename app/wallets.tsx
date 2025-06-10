import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, FAB, Portal, Modal, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { Wallet } from '../src/types/wallet';

export default function WalletsScreen() {
  const router = useRouter();
  const { wallets, walletsLoading, walletsError, createWallet } = useApp();
  const [newWalletModalVisible, setNewWalletModalVisible] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletCurrency, setNewWalletCurrency] = useState('USD');

  const handleCreateWallet = async () => {
    try {
      await createWallet(newWalletName, newWalletCurrency);
      setNewWalletModalVisible(false);
      setNewWalletName('');
      setNewWalletCurrency('USD');
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const renderWalletCard = ({ item }: { item: Wallet }) => (
    <Card
      style={styles.card}
      onPress={() => router.push(`/wallet/${item.id}`)}
    >
      <Card.Content>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="headlineMedium" style={styles.balance}>
          ${item.balance.toLocaleString()}
        </Text>
        <Text variant="bodyMedium" style={styles.currency}>
          {item.currency}
        </Text>
      </Card.Content>
    </Card>
  );

  if (walletsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading wallets...</Text>
      </View>
    );
  }

  if (walletsError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{walletsError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        My Wallets
      </Text>
      {wallets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            You don't have any wallets yet.
          </Text>
          <Button
            mode="contained"
            onPress={() => setNewWalletModalVisible(true)}
            style={styles.createButton}
          >
            Create Your First Wallet
          </Button>
        </View>
      ) : (
        <FlatList
          data={wallets}
          renderItem={renderWalletCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setNewWalletModalVisible(true)}
        label="New Wallet"
      />

      <Portal>
        <Modal
          visible={newWalletModalVisible}
          onDismiss={() => setNewWalletModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Create New Wallet
          </Text>
          <TextInput
            label="Wallet Name"
            value={newWalletName}
            onChangeText={setNewWalletName}
            style={styles.input}
          />
          <TextInput
            label="Currency"
            value={newWalletCurrency}
            onChangeText={setNewWalletCurrency}
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setNewWalletModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateWallet}
              style={styles.modalButton}
              disabled={!newWalletName.trim()}
            >
              Create
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    padding: 16,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  balance: {
    marginTop: 8,
    color: '#2196F3',
  },
  currency: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  createButton: {
    minWidth: 200,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    minWidth: 100,
  },
  error: {
    color: '#F44336',
  },
}); 