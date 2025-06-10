import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, List, Portal, Modal, Snackbar, ActivityIndicator } from 'react-native-paper';
import { Chat } from '../../types';
import CreateMultisigWallet from '../wallet/CreateMultisigWallet';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';

interface GroupInfoProps {
  chat: Chat;
  onClose: () => void;
}

export default function GroupInfo({ chat, onClose }: GroupInfoProps) {
  const router = useRouter();
  const { currentUser, isLoading } = useApp();
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Add debug logging for user context
  useEffect(() => {
    console.log('GroupInfo - User Context:', {
      currentUser,
      isLoading,
      chatId: chat.id
    });
  }, [currentUser, isLoading, chat.id]);

  const handleWalletSuccess = (wallet: any) => {
    console.log('GroupInfo: Wallet created successfully:', wallet);
    if (!wallet || !wallet.id) {
      console.error('Invalid wallet data received:', wallet);
      return;
    }

    // Close modal and show success message
    setWalletModalVisible(false);
    setSnackbarVisible(true);

    // Navigate to wallet screen with a delay
    setTimeout(() => {
      try {
        console.log('GroupInfo: Navigating to wallet:', wallet.id);
        router.replace({
          pathname: '/wallet/[id]',
          params: { id: wallet.id }
        });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 500);
  };

  const handleCreateWalletPress = () => {
    console.log('GroupInfo: Create wallet pressed', {
      currentUser,
      isLoading
    });

    if (!currentUser) {
      console.error('Cannot create wallet: No user found');
      return;
    }
    setWalletModalVisible(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  // Show error state if no user
  if (!currentUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found. Please try logging out and back in.</Text>
        <Button mode="contained" onPress={onClose} style={styles.button}>
          Close
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={64}
          label={chat.name.substring(0, 2).toUpperCase()}
          style={styles.avatar}
        />
        <Text style={styles.name}>{chat.name}</Text>
      </View>

      <List.Section>
        <List.Subheader>Members</List.Subheader>
        {chat.members.map(memberId => (
          <List.Item
            key={memberId}
            title={`User ${memberId}`}
            left={() => (
              <Avatar.Text
                size={40}
                label={memberId.substring(0, 2).toUpperCase()}
              />
            )}
          />
        ))}
      </List.Section>

      <View style={styles.walletSection}>
        <Text style={styles.sectionTitle}>Group Wallet</Text>
        <Button
          mode="contained"
          onPress={handleCreateWalletPress}
          style={styles.walletButton}
          icon="wallet"
        >
          Create Group Wallet
        </Button>
        <Text style={styles.walletDescription}>
          Create a multisig wallet for this group. All members will be able to manage funds together.
        </Text>
      </View>

      <Button mode="outlined" onPress={onClose} style={styles.button}>
        Close
      </Button>

      <Portal>
        <Modal
          visible={walletModalVisible}
          onDismiss={() => setWalletModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 8,
            padding: 20,
            width: '95%',
            maxWidth: 600,
            height: '95%',
            alignSelf: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <ScrollView style={{ height: '100%' }}>
            <CreateMultisigWallet
              onSuccess={handleWalletSuccess}
              onCancel={() => setWalletModalVisible(false)}
              prefillMembers={chat.members}
            />
          </ScrollView>
        </Modal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          Group wallet created!
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
  walletSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  walletButton: {
    marginBottom: 8,
  },
  walletDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
}); 