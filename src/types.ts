export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  preferences: {
    notifications: {
      push: boolean;
      sms: boolean;
    };
    privacy: {
      showBalance: boolean;
      showTransactions: boolean;
      showGroups: boolean;
    };
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  lastLoginAt?: string;
}

export type Currency = 'USDC' | 'SOL' | 'BTC';

export interface Wallet {
  id: string;
  name: string;
  currency: Currency;
  balance: number;
  requiredSignatures: number;
  chatId: string;
  members: User[];
  created_at: string;
  updated_at: string;
}

export interface CreateWalletData {
  name: string;
  currency: Currency;
  requiredSignatures: number;
  chatId: string;
  members: User[];
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  members: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  walletId?: string | null;
  created_at: string;
  updated_at: string;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';
export type MessageType = 'text' | 'image' | 'file' | 'system';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  timestamp: string;
  status: MessageStatus;
  reactions: Array<{ emoji: string; userId: string }>;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
  };
}

export interface CreateMessageData {
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
  };
}

export interface UpdateMessageData {
  status?: MessageStatus;
  content?: string;
  reactions?: Array<{ emoji: string; userId: string }>;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
  };
}

export interface Transaction {
  id: string;
  wallet_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
} 