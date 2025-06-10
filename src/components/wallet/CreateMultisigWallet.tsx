import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Chip, ActivityIndicator } from 'react-native-paper';
import { useApp } from '../../context/AppContext';
import { multisigService } from '../../services/multisigService';
import { Currency } from '../../types/wallet';
import { useRouter } from 'expo-router';

interface CreateMultisigWalletProps {
  onSuccess: (wallet: any) => void;
  onCancel: () => void;
  prefillMembers?: string[];
}

export default function CreateMultisigWallet({
  onSuccess,
  onCancel,
  prefillMembers,
}: CreateMultisigWalletProps) {
  const { currentUser, isLoading } = useApp();
  const router = useRouter();
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<Currency>('ETH');
  const [requiredSignatures, setRequiredSignatures] = useState('2');
  const [members, setMembers] = useState<string[]>(prefillMembers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CreateMultisigWallet - User Context:', {
      currentUser,
      isLoading,
      prefillMembers
    });
  }, [currentUser, isLoading, prefillMembers]);

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter a wallet name');
      return false;
    }

    const requiredSigs = parseInt(requiredSignatures, 10);
    if (isNaN(requiredSigs) || requiredSigs < 2) {
      setError('Required signatures must be at least 2');
      return false;
    }

    if (members.length < requiredSigs) {
      setError(`Number of required signatures (${requiredSigs}) cannot be greater than number of members (${members.length})`);
      return false;
    }

    return true;
  };

  const handleCreateWallet = async () => {
    console.log('handleCreateWallet - User Context:', {
      currentUser,
      isLoading,
      members
    });

    if (isLoading) {
      setError('Please wait while we load your user data...');
      return;
    }

    if (!currentUser) {
      setError('User not found. Please try logging out and back in.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requiredSigs = parseInt(requiredSignatures, 10);
      console.log('Creating wallet with params:', {
        name,
        currency,
        ownerId: currentUser.id,
        members: members.length > 0 ? members : [currentUser.id],
        requiredSigs
      });

      const wallet = await multisigService.createMultisigWallet(
        name,
        currency,
        currentUser.id,
        members.length > 0 ? members : [currentUser.id],
        requiredSigs
      );

      console.log('Wallet created successfully:', wallet);
      onSuccess(wallet);
    } catch (err) {
      console.error('Error in handleCreateWallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Multisig Wallet</Text>
      
      <TextInput
        label="Wallet Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError(null);
        }}
        style={styles.input}
        mode="outlined"
        error={!!error && !name.trim()}
      />

      <Text style={styles.sectionTitle}>Currency</Text>
      <View style={styles.currencyContainer}>
        {(['ETH', 'USDC', 'DAI'] as Currency[]).map((curr) => (
          <Chip
            key={curr}
            selected={currency === curr}
            onPress={() => {
              setCurrency(curr);
              setError(null);
            }}
            style={styles.currencyChip}
          >
            {curr}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Required Signatures"
        value={requiredSignatures}
        onChangeText={(text) => {
          setRequiredSignatures(text);
          setError(null);
        }}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        error={!!error && (isNaN(parseInt(requiredSignatures, 10)) || parseInt(requiredSignatures, 10) < 2)}
      />
      <HelperText type="info">
        Minimum 2 signatures required for transactions
      </HelperText>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleCreateWallet}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Create Wallet
        </Button>
      </View>
    </ScrollView>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  currencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  currencyChip: {
    marginRight: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 