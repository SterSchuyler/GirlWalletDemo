import { User } from './user';

export type WalletStatus = 'pending' | 'active' | 'frozen' | 'closed';

export type WalletType = 'multisig' | 'personal';

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

export interface MultisigWallet extends Wallet {
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

export interface Transaction {
  id: string;
  walletId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  createdBy: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string[];
  rejectedBy?: string[];
  signatures?: {
    userId: string;
    signature: string;
    timestamp: string;
  }[];
}

export interface MultisigTransaction extends Transaction {
  signatures: {
    userId: string;
    signature: string;
    timestamp: string;
  }[];
  requiredSignatures: number;
}

export interface CreateWalletData {
  name: string;
  currency: Currency;
  requiredSignatures: number;
  chatId: string;
  members: User[];
}

export interface UpdateWalletData {
  name?: string;
  currency?: Currency;
  members?: User[];
  isActive?: boolean;
  requiredSignatures?: number; // For multisig wallets
}

export interface CreateTransactionData {
  walletId: string;
  type: Transaction['type'];
  amount: number;
  description?: string;
  createdBy: string;
  requiredSignatures?: number; // For multisig transactions
}

export interface UpdateTransactionData {
  status?: Transaction['status'];
  signatures?: MultisigTransaction['signatures'];
} 