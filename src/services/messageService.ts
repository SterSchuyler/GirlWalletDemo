import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Message, CreateMessageData, UpdateMessageData } from '../types';
import { mockMessages } from '../lib/mockData';

const MESSAGES_STORAGE_KEY = '@messages';

const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

// Initialize messages
const initializeMessages = async () => {
  try {
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      const storedData = window.localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } else {
      const storedData = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    }
    return mockMessages;
  } catch (error) {
    console.error('Error initializing messages:', error);
    return mockMessages;
  }
};

// Initialize messages when the service is imported
initializeMessages();

// Get messages for a chat
const getMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const messages = await initializeMessages();
    return messages.filter((msg: Message) => msg.chatId === chatId);
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Create a new message
const createMessage = async (data: CreateMessageData): Promise<Message> => {
  try {
    const messages = await initializeMessages();
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: data.chatId,
      senderId: data.senderId,
      type: data.type,
      content: data.content,
      timestamp: new Date().toISOString(),
      status: 'sending',
      reactions: [],
      metadata: data.metadata
    };

    const updatedMessages = [...messages, newMessage];
    
    await saveMessages(updatedMessages);

    return newMessage;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

// Update message status
const updateMessageStatus = async (id: string, status: Message['status']): Promise<Message> => {
  try {
    const messages = await initializeMessages();
    const messageIndex = messages.findIndex((m: Message) => m.id === id);

    if (messageIndex === -1) {
      throw new Error('Message not found');
    }

    const updatedMessage: Message = {
      ...messages[messageIndex],
      status,
      updated_at: new Date().toISOString()
    };

    const updatedMessages = [
      ...messages.slice(0, messageIndex),
      updatedMessage,
      ...messages.slice(messageIndex + 1)
    ];

    await saveMessages(updatedMessages);

    return updatedMessage;
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

const saveMessages = async (messages: Message[]) => {
  try {
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } else {
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export const messageService = {
  getMessages,
  createMessage,
  updateMessageStatus,

  async updateMessage(id: string, data: UpdateMessageData): Promise<Message> {
    try {
      const messages = await initializeMessages();
      const messageIndex = messages.findIndex((m: Message) => m.id === id);

      if (messageIndex === -1) {
        throw new Error('Message not found');
      }

      const updatedMessage: Message = {
        ...messages[messageIndex],
        ...data,
      };

      const updatedMessages = [
        ...messages.slice(0, messageIndex),
        updatedMessage,
        ...messages.slice(messageIndex + 1)
      ];

      await saveMessages(updatedMessages);

      return updatedMessage;
    } catch (error) {
      console.error('Error updating message:', error);
      throw new Error('Failed to update message');
    }
  },

  async deleteMessage(id: string): Promise<void> {
    try {
      const messages = await initializeMessages();
      const updatedMessages = messages.filter((m: Message) => m.id !== id);
      await saveMessages(updatedMessages);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  async addReaction(messageId: string, emoji: string, userId: string): Promise<Message> {
    try {
      const messages = await initializeMessages();
      const messageIndex = messages.findIndex((m: Message) => m.id === messageId);

      if (messageIndex === -1) {
        throw new Error('Message not found');
      }

      const message = messages[messageIndex];
      const reactions = message.reactions || {};
      const userReactions = reactions[emoji] || [];

      if (!userReactions.includes(userId)) {
        reactions[emoji] = [...userReactions, userId];
      }

      const updatedMessage: Message = {
        ...message,
        reactions,
      };

      const updatedMessages = [
        ...messages.slice(0, messageIndex),
        updatedMessage,
        ...messages.slice(messageIndex + 1)
      ];

      await saveMessages(updatedMessages);

      return updatedMessage;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw new Error('Failed to add reaction');
    }
  },

  async removeReaction(messageId: string, emoji: string, userId: string): Promise<Message> {
    try {
      const messages = await initializeMessages();
      const messageIndex = messages.findIndex((m: Message) => m.id === messageId);

      if (messageIndex === -1) {
        throw new Error('Message not found');
      }

      const message = messages[messageIndex];
      const reactions = message.reactions || {};
      const userReactions = reactions[emoji] || [];

      if (userReactions.includes(userId)) {
        reactions[emoji] = userReactions.filter((id: string) => id !== userId);
      }

      const updatedMessage: Message = {
        ...message,
        reactions,
      };

      const updatedMessages = [
        ...messages.slice(0, messageIndex),
        updatedMessage,
        ...messages.slice(messageIndex + 1)
      ];

      await saveMessages(updatedMessages);

      return updatedMessage;
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw new Error('Failed to remove reaction');
    }
  }
}; 