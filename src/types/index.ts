export * from './user';
export * from './wallet';
export * from './contact';

export interface Chat {
  id: string;
  name: string;
  type: 'group' | 'direct';
  members: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  walletId: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
  updatedAt: string;
} 