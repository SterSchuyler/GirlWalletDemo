import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Wallet, Transaction, Currency } from '../types/wallet';

const MULTISIG_WALLETS_KEY = '@multisig_wallets';
const MULTISIG_TRANSACTIONS_KEY = '@multisig_transactions';

interface MultisigWallet extends Wallet {
  type: 'multisig';
  requiredSignatures: number;
  signatures: {
    [transactionId: string]: {
      userId: string;
      signature: string;
      timestamp: string;
    }[];
  };
}

interface MultisigTransaction extends Transaction {
  signatures: {
    userId: string;
    signature: string;
    timestamp: string;
  }[];
  requiredSignatures: number;
}

export const multisigService = {
  async createMultisigWallet(
    name: string,
    currency: Currency,
    ownerId: string,
    members: string[],
    requiredSignatures: number
  ): Promise<MultisigWallet> {
    try {
      const walletsJson = await AsyncStorage.getItem(MULTISIG_WALLETS_KEY);
      const wallets: MultisigWallet[] = walletsJson ? JSON.parse(walletsJson) : [];

      const newWallet: MultisigWallet = {
        id: uuidv4(),
        name,
        balance: 0,
        currency,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId,
        members,
        isActive: true,
        type: 'multisig',
        requiredSignatures,
        signatures: {},
      };

      wallets.push(newWallet);
      await AsyncStorage.setItem(MULTISIG_WALLETS_KEY, JSON.stringify(wallets));
      return newWallet;
    } catch (error) {
      console.error('Error creating multisig wallet:', error);
      throw new Error('Failed to create multisig wallet');
    }
  },

  async getMultisigWallets(userId: string): Promise<MultisigWallet[]> {
    try {
      const walletsJson = await AsyncStorage.getItem(MULTISIG_WALLETS_KEY);
      const wallets: MultisigWallet[] = walletsJson ? JSON.parse(walletsJson) : [];
      return wallets.filter(
        wallet => wallet.ownerId === userId || wallet.members.includes(userId)
      );
    } catch (error) {
      console.error('Error getting multisig wallets:', error);
      throw new Error('Failed to get multisig wallets');
    }
  },

  async createMultisigTransaction(
    walletId: string,
    type: 'income' | 'expense',
    amount: number,
    description: string,
    createdBy: string,
    requiredSignatures: number
  ): Promise<MultisigTransaction> {
    try {
      const transactionsJson = await AsyncStorage.getItem(MULTISIG_TRANSACTIONS_KEY);
      const transactions: MultisigTransaction[] = transactionsJson ? JSON.parse(transactionsJson) : [];

      const newTransaction: MultisigTransaction = {
        id: uuidv4(),
        walletId,
        type,
        amount,
        description,
        date: new Date().toISOString(),
        createdBy,
        status: 'pending',
        approvedBy: [],
        rejectedBy: [],
        signatures: [],
        requiredSignatures,
      };

      transactions.push(newTransaction);
      await AsyncStorage.setItem(MULTISIG_TRANSACTIONS_KEY, JSON.stringify(transactions));
      return newTransaction;
    } catch (error) {
      console.error('Error creating multisig transaction:', error);
      throw new Error('Failed to create multisig transaction');
    }
  },

  async signTransaction(
    transactionId: string,
    userId: string,
    signature: string
  ): Promise<MultisigTransaction> {
    try {
      const transactionsJson = await AsyncStorage.getItem(MULTISIG_TRANSACTIONS_KEY);
      const transactions: MultisigTransaction[] = transactionsJson ? JSON.parse(transactionsJson) : [];
      const transactionIndex = transactions.findIndex(t => t.id === transactionId);

      if (transactionIndex === -1) {
        throw new Error('Transaction not found');
      }

      const transaction = transactions[transactionIndex];
      if (transaction.status !== 'pending') {
        throw new Error('Transaction is not pending');
      }

      // Check if user has already signed
      if (transaction.signatures.some(s => s.userId === userId)) {
        throw new Error('User has already signed this transaction');
      }

      // Add signature
      transaction.signatures.push({
        userId,
        signature,
        timestamp: new Date().toISOString(),
      });

      // Check if we have enough signatures
      if (transaction.signatures.length >= transaction.requiredSignatures) {
        transaction.status = 'approved';
      }

      transactions[transactionIndex] = transaction;
      await AsyncStorage.setItem(MULTISIG_TRANSACTIONS_KEY, JSON.stringify(transactions));
      return transaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error('Failed to sign transaction');
    }
  },

  async getMultisigTransactions(walletId: string): Promise<MultisigTransaction[]> {
    try {
      const transactionsJson = await AsyncStorage.getItem(MULTISIG_TRANSACTIONS_KEY);
      const transactions: MultisigTransaction[] = transactionsJson ? JSON.parse(transactionsJson) : [];
      return transactions
        .filter(transaction => transaction.walletId === walletId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting multisig transactions:', error);
      throw new Error('Failed to get multisig transactions');
    }
  },
}; 