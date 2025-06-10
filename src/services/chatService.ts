import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Chat, Message, CreateMessageData } from '../types';
import { ChatParticipant } from '../types/chat';

const CHATS_STORAGE_KEY = '@chats';
const MESSAGES_STORAGE_KEY = '@messages';

// Initialize mock data
const initializeData = async () => {
  try {
    if (Platform.OS === 'web') {
      // For web, use localStorage as fallback
      const storedData = localStorage.getItem(CHATS_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } else {
      const storedData = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    }
    return [];
  } catch (error) {
    console.error('Error initializing data:', error);
    return [];
  }
};

// Get all chats
const getChats = async (): Promise<Chat[]> => {
  try {
    return await initializeData();
  } catch (error) {
    console.error('Error getting chats:', error);
    return [];
  }
};

// Get a single chat
const getChat = async (id: string): Promise<Chat | null> => {
  try {
    const chats = await initializeData();
    return chats.find((chat: Chat) => chat.id === id) || null;
  } catch (error) {
    console.error('Error getting chat:', error);
    return null;
  }
};

// Create a new chat
const createChat = async (data: Omit<Chat, 'id' | 'created_at' | 'updated_at'>): Promise<Chat> => {
  try {
    const chats = await initializeData();
    const newChat: Chat = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedChats = [...chats, newChat];
    
    if (Platform.OS === 'web') {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    } else {
      await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    }

    return newChat;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Update a chat
const updateChat = async (id: string, data: Partial<Chat>): Promise<Chat> => {
  try {
    const chats = await initializeData();
    const chatIndex = chats.findIndex((chat: Chat) => chat.id === id);

    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }

    const updatedChat: Chat = {
      ...chats[chatIndex],
      ...data,
      updated_at: new Date().toISOString()
    };

    const updatedChats = [
      ...chats.slice(0, chatIndex),
      updatedChat,
      ...chats.slice(chatIndex + 1)
    ];

    if (Platform.OS === 'web') {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    } else {
      await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    }

    return updatedChat;
  } catch (error) {
    console.error('Error updating chat:', error);
    throw error;
  }
};

// Delete a chat
const deleteChat = async (id: string): Promise<void> => {
  try {
    const chats = await initializeData();
    const updatedChats = chats.filter((chat: Chat) => chat.id !== id);

    if (Platform.OS === 'web') {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    } else {
      await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};

export const chatService = {
  getChats,
  getChat,
  createChat,
  updateChat,
  deleteChat
}; 