import { Wallet, Transaction } from '../types/wallet';
import { Chat, Message } from '../types';
import { User } from '../types/user';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '7a6c3a90-acb2-4c45-913b-be0c6707628d',
    email: 'sarah@example.com',
    name: 'Sarah',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Software Engineer',
    createdAt: '2025-06-08T20:04:05.317Z',
    updatedAt: '2025-06-08T20:04:05.317Z',
    isVerified: true,
    preferences: {
      notifications: {
        push: true,
        sms: false,
      },
      privacy: {
        showBalance: true,
        showTransactions: true,
        showGroups: true,
      },
      theme: 'light',
      language: 'en',
    },
  },
  {
    id: '2',
    email: 'emma@example.com',
    name: 'Emma',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Designer',
    createdAt: '2025-06-08T20:04:05.317Z',
    updatedAt: '2025-06-08T20:04:05.317Z',
    isVerified: true,
    preferences: {
      notifications: {
        push: true,
        sms: false,
      },
      privacy: {
        showBalance: true,
        showTransactions: true,
        showGroups: true,
      },
      theme: 'light',
      language: 'en',
    },
  },
  {
    id: '3',
    email: 'olivia@example.com',
    name: 'Olivia',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Product Manager',
    createdAt: '2025-06-08T20:04:05.317Z',
    updatedAt: '2025-06-08T20:04:05.317Z',
    isVerified: true,
    preferences: {
      notifications: {
        push: true,
        sms: false,
      },
      privacy: {
        showBalance: true,
        showTransactions: true,
        showGroups: true,
      },
      theme: 'light',
      language: 'en',
    },
  },
];

// Mock Wallets
export const mockWallets: Wallet[] = [
  {
    id: 'wallet_1',
    name: 'Family Savings',
    currency: 'USDC' as const,
    balance: 1000,
    requiredSignatures: 2,
    chatId: 'chat_1',
    members: mockUsers.slice(0, 3),
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: 'wallet_2',
    name: 'Vacation Fund',
    currency: 'SOL' as const,
    balance: 5,
    requiredSignatures: 2,
    chatId: 'chat_2',
    members: mockUsers.slice(1, 4),
    created_at: '2024-03-16T14:30:00Z',
    updated_at: '2024-03-16T14:30:00Z',
  },
];

// Mock Chats
export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Girls Night Out',
    type: 'group',
    members: ['7a6c3a90-acb2-4c45-913b-be0c6707628d', '2', '3'],
    lastMessage: 'See you all at 8!',
    lastMessageTime: '2025-06-09T15:30:00.000Z',
    created_at: '2025-06-08T20:04:05.317Z',
    updated_at: '2025-06-09T15:30:00.000Z',
    walletId: null,
  },
  {
    id: '2',
    name: 'Sarah',
    type: 'direct',
    members: ['7a6c3a90-acb2-4c45-913b-be0c6707628d', '2'],
    lastMessage: 'Thanks for the coffee!',
    lastMessageTime: '2025-06-09T14:00:00.000Z',
    created_at: '2025-06-08T20:04:05.317Z',
    updated_at: '2025-06-09T14:00:00.000Z',
    walletId: null,
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '2',
    content: 'Hey everyone!',
    type: 'text',
    status: 'read',
    timestamp: '2025-06-09T15:00:00.000Z',
    reactions: [],
  },
  {
    id: '2',
    chatId: '1',
    senderId: '3',
    content: 'Hi!',
    type: 'text',
    status: 'read',
    timestamp: '2025-06-09T15:05:00.000Z',
    reactions: [],
  },
  {
    id: '3',
    chatId: '1',
    senderId: '7a6c3a90-acb2-4c45-913b-be0c6707628d',
    content: 'See you all at 8!',
    type: 'text',
    status: 'delivered',
    timestamp: '2025-06-09T15:30:00.000Z',
    reactions: [],
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    wallet_id: '1',
    type: 'deposit',
    amount: 1000.00,
    description: 'Monthly salary',
    status: 'completed',
    created_at: '2025-06-01T09:00:00.000Z',
    updated_at: '2025-06-01T09:00:00.000Z',
  },
  {
    id: '2',
    wallet_id: '2',
    type: 'withdrawal',
    amount: 50.00,
    description: 'Coffee with Emma',
    status: 'completed',
    created_at: '2025-06-09T14:00:00.000Z',
    updated_at: '2025-06-09T14:00:00.000Z',
  },
]; 