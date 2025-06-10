import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Chat, Message, CreateMessageData } from '../types';
import { mockChats, mockMessages } from './mockData';

const CHATS_STORAGE_KEY = '@chats';
const MESSAGES_STORAGE_KEY = '@messages';

const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

// Cache for chats
let chatsCache: Chat[] = mockChats;

const initializeData = async (): Promise<Chat[]> => {
  try {
    if (chatsCache.length > 0) {
      return chatsCache;
    }

    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      const storedData = window.localStorage.getItem(CHATS_STORAGE_KEY);
      if (storedData) {
        chatsCache = JSON.parse(storedData);
        return chatsCache;
      }
    } else {
      const storedData = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
      if (storedData) {
        chatsCache = JSON.parse(storedData);
        return chatsCache;
      }
    }
    chatsCache = mockChats;
    return chatsCache;
  } catch (error) {
    console.error('Error initializing data:', error);
    chatsCache = mockChats;
    return chatsCache;
  }
};

const saveChats = async (chats: Chat[]) => {
  try {
    chatsCache = chats;
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      window.localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    } else {
      await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    }
  } catch (error) {
    console.error('Error saving chats:', error);
  }
};

// Initialize data when the service is imported
initializeData();

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
    console.log('Getting chat with id:', id);
    const chats = await initializeData();
    console.log('Available chats:', chats);
    const chat = chats.find((chat: Chat) => chat.id === id);
    console.log('Found chat:', chat);
    return chat || null;
  } catch (error) {
    console.error('Error getting chat:', error);
    return null;
  }
};

// Create a new chat
const createChat = async (data: Omit<Chat, 'id' | 'created_at' | 'updated_at'>): Promise<Chat> => {
  try {
    console.log('Creating chat with data:', data);
    const chats = await initializeData();
    console.log('Current chats:', chats);
    
    const newChat: Chat = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    console.log('New chat object:', newChat);

    const updatedChats = [...chats, newChat];
    console.log('Updated chats array:', updatedChats);
    
    await saveChats(updatedChats);
    console.log('Chats saved successfully');

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

    await saveChats(updatedChats);

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

    await saveChats(updatedChats);
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