import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: Move these to environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Mock data service for wallets
const mockWallets = [
  {
    id: '1',
    name: 'Savings',
    currency: 'USDC',
    balance: 1000.00,
    requiredSignatures: 2,
    chatId: 'chat_1',
    members: [
      {
        id: '7a6c3a90-acb2-4c45-913b-be0c6707628d',
        name: 'User 1',
        email: 'user1@example.com',
        created_at: '2025-06-08T20:04:05.317Z',
        updated_at: '2025-06-08T20:04:05.317Z',
      }
    ],
    created_at: '2025-06-08T20:04:05.317Z',
    updated_at: '2025-06-08T20:04:05.317Z',
  },
  {
    id: '2',
    name: 'Spending',
    currency: 'USDC',
    balance: 500.00,
    requiredSignatures: 2,
    chatId: 'chat_2',
    members: [
      {
        id: '7a6c3a90-acb2-4c45-913b-be0c6707628d',
        name: 'User 1',
        email: 'user1@example.com',
        created_at: '2025-06-08T20:04:05.317Z',
        updated_at: '2025-06-08T20:04:05.317Z',
      }
    ],
    created_at: '2025-06-08T20:04:05.317Z',
    updated_at: '2025-06-08T20:04:05.317Z',
  },
];

export const walletService = {
  async getWallets(userId: string) {
    return mockWallets.filter(wallet => 
      wallet.members.some(member => member.id === userId)
    );
  },

  async getWallet(id: string, userId: string) {
    return mockWallets.find(wallet => 
      wallet.id === id && wallet.members.some(member => member.id === userId)
    );
  },

  async createWallet(data: {
    name: string;
    currency: string;
    requiredSignatures: number;
    chatId: string;
    members: any[];
  }) {
    const newWallet = {
      id: String(mockWallets.length + 1),
      name: data.name,
      currency: data.currency,
      balance: 0,
      requiredSignatures: data.requiredSignatures,
      chatId: data.chatId,
      members: data.members,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockWallets.push(newWallet);
    return newWallet;
  },
}; 