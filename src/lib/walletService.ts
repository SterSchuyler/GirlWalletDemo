import { Wallet, Transaction } from '../types';
import { mockWallets, mockTransactions } from './mockData';

export const walletService = {
  async getWallets(userId: string): Promise<Wallet[]> {
    return mockWallets.filter(wallet => wallet.user_id === userId);
  },

  async getWallet(id: string, userId: string): Promise<Wallet | null> {
    const wallet = mockWallets.find(w => w.id === id && w.user_id === userId);
    return wallet || null;
  },

  async createWallet(data: Omit<Wallet, 'id' | 'created_at' | 'updated_at'>): Promise<Wallet> {
    const newWallet: Wallet = {
      ...data,
      id: String(mockWallets.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockWallets.push(newWallet);
    return newWallet;
  },

  async getTransactions(walletId: string, userId: string): Promise<Transaction[]> {
    const wallet = await this.getWallet(walletId, userId);
    if (!wallet) return [];
    return mockTransactions.filter(tx => tx.wallet_id === walletId);
  },

  async createTransaction(data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...data,
      id: String(mockTransactions.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockTransactions.push(newTransaction);

    // Update wallet balance
    const wallet = mockWallets.find(w => w.id === data.wallet_id);
    if (wallet) {
      if (data.type === 'deposit') {
        wallet.balance += data.amount;
      } else if (data.type === 'withdrawal') {
        wallet.balance -= data.amount;
      }
      wallet.updated_at = new Date().toISOString();
    }

    return newTransaction;
  },
}; 