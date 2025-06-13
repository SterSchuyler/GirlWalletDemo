import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Wallet,
  Transaction,
  CreateWalletData,
  UpdateWalletData,
  CreateTransactionData,
  UpdateTransactionData,
} from '../types/wallet';
import { User } from '../types/user';
import { mockWallets, mockUsers } from '../lib/mockData';

const WALLETS_STORAGE_KEY = '@wallets';
const TRANSACTIONS_STORAGE_KEY = '@transactions';

const isLocalStorageAvailable = () => {
  return Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage;
};

const getStorage = () => {
  if (isLocalStorageAvailable()) {
    return window.localStorage;
  }
  return AsyncStorage;
};

class WalletService {
  private async getWallets(): Promise<Wallet[]> {
    try {
      const storage = getStorage();
      const wallets = await storage.getItem(WALLETS_STORAGE_KEY);
      console.log('Raw wallets from storage:', wallets);
      
      if (!wallets) {
        console.log('No wallets in storage, initializing with mock data');
        await this.initializeWallets();
        return mockWallets;
      }
      
      const parsedWallets = JSON.parse(wallets);
      console.log('Parsed wallets:', parsedWallets);
      return parsedWallets;
    } catch (error) {
      console.error('Error getting wallets:', error);
      throw error;
    }
  }

  private async saveWallets(wallets: Wallet[]): Promise<void> {
    try {
      console.log('Saving wallets to storage:', wallets);
      const storage = getStorage();
      await storage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));
      
      // Verify the save
      const savedWallets = await storage.getItem(WALLETS_STORAGE_KEY);
      console.log('Verified saved wallets:', savedWallets);
      
      if (!savedWallets) {
        throw new Error('Failed to save wallets');
      }
    } catch (error) {
      console.error('Error saving wallets:', error);
      throw error;
    }
  }

  private async getTransactions(): Promise<Transaction[]> {
    try {
      const storage = getStorage();
      const transactionsJson = await storage.getItem(TRANSACTIONS_STORAGE_KEY);
      return transactionsJson ? JSON.parse(transactionsJson) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  async initializeWallets(): Promise<void> {
    try {
      const storage = getStorage();
      const existingWallets = await storage.getItem(WALLETS_STORAGE_KEY);
      console.log('Existing wallets during initialization:', existingWallets);
      
      if (!existingWallets) {
        console.log('Initializing wallets with mock data:', mockWallets);
        await storage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(mockWallets));
      }

      const existingTransactions = await storage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (!existingTransactions) {
        await storage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing wallets:', error);
      throw error;
    }
  }

  async getWallet(id: string): Promise<Wallet | null> {
    try {
      console.log('Fetching wallet with ID:', id);
      const wallets = await this.getWallets();
      console.log('Available wallet IDs:', wallets.map(w => w.id));
      const wallet = wallets.find(w => w.id === id);
      console.log('Found wallet:', wallet);
      return wallet || null;
    } catch (error) {
      console.error('Error getting wallet:', error);
      throw error;
    }
  }

  async createWallet(data: CreateWalletData): Promise<Wallet> {
    try {
      console.log('Creating wallet with data:', data);
      const wallets = await this.getWallets();
      const walletId = `wallet_${Date.now()}`;
      console.log('Generated wallet ID:', walletId);
      
      const newWallet: Wallet = {
        id: walletId,
        name: data.name,
        currency: data.currency,
        balance: 0,
        requiredSignatures: data.requiredSignatures,
        chatId: data.chatId,
        members: data.members,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('New wallet object:', newWallet);
      const updatedWallets = [...wallets, newWallet];
      await this.saveWallets(updatedWallets);

      // Verify the wallet was saved correctly
      const savedWallets = await this.getWallets();
      const savedWallet = savedWallets.find(w => w.id === walletId);
      if (!savedWallet) {
        throw new Error('Failed to save wallet');
      }

      console.log('Wallet created successfully:', savedWallet);
      return savedWallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  async getWalletsByUser(userId: string): Promise<Wallet[]> {
    const wallets = await this.getWallets();
    return wallets.filter(
      wallet => wallet.members.some(member => member.id === userId)
    );
  }

  async updateWallet(id: string, data: UpdateWalletData): Promise<Wallet> {
    try {
      const wallets = await this.getWallets();
      const index = wallets.findIndex(w => w.id === id);
      
      if (index === -1) {
        throw new Error('Wallet not found');
      }

      const wallet = wallets[index];
      const updatedWallet: Wallet = {
        ...wallet,
        ...(data.name && { name: data.name }),
        ...(data.currency && { currency: data.currency }),
        ...(data.requiredSignatures && { requiredSignatures: data.requiredSignatures }),
        updated_at: new Date().toISOString(),
      };

      // Handle members update separately
      if (data.members) {
        // If members is provided as User[], use it directly
        if (Array.isArray(data.members) && data.members.length > 0 && typeof data.members[0] === 'object') {
          updatedWallet.members = data.members as User[];
        } else {
          // If members is provided as string[], find the corresponding User objects
          const memberIds = data.members as string[];
          const allUsers = mockUsers; // In a real app, this would come from a user service
          updatedWallet.members = allUsers.filter(user => memberIds.includes(user.id));
        }
      }

      wallets[index] = updatedWallet;
      await this.saveWallets(wallets);

      // Verify the wallet was updated correctly
      const savedWallets = await this.getWallets();
      const savedWallet = savedWallets.find(w => w.id === id);
      if (!savedWallet) {
        throw new Error('Failed to update wallet');
      }

      return savedWallet;
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  }

  async deleteWallet(id: string): Promise<void> {
    try {
      const wallets = await this.getWallets();
      const index = wallets.findIndex(w => w.id === id);

      if (index === -1) {
        throw new Error('Wallet not found');
      }

      const wallet = wallets[index];
      if (wallet.balance !== 0) {
        throw new Error('Cannot delete wallet with non-zero balance');
      }

      wallets.splice(index, 1);
      await this.saveWallets(wallets);

      // Verify the wallet was deleted
      const savedWallets = await this.getWallets();
      const savedWallet = savedWallets.find(w => w.id === id);
      if (savedWallet) {
        throw new Error('Failed to delete wallet');
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  }

  async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions
      .filter(transaction => transaction.walletId === walletId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    try {
      const transactions = await this.getTransactions();
      const newTransaction: Transaction = {
        id: uuidv4(),
        walletId: data.walletId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: new Date().toISOString(),
        createdBy: data.createdBy,
        status: 'pending',
        approvedBy: [],
        rejectedBy: [],
      };

      transactions.push(newTransaction);
      await this.saveTransactions(transactions);

      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  private async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      const storage = getStorage();
      await storage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
      throw new Error('Failed to save transactions');
    }
  }
}

export const walletService = new WalletService(); 