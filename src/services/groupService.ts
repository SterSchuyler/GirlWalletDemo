import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat } from '../types';
import { mockChats } from '../lib/mockData';

const GROUPS_STORAGE_KEY = '@groups';

const isLocalStorageAvailable = () => {
  return Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage;
};

const getStorage = () => {
  if (isLocalStorageAvailable()) {
    return window.localStorage;
  }
  return AsyncStorage;
};

class GroupService {
  private async getGroups(): Promise<Chat[]> {
    try {
      const storage = getStorage();
      const groups = await storage.getItem(GROUPS_STORAGE_KEY);
      console.log('Raw groups from storage:', groups);
      
      if (!groups) {
        console.log('No groups in storage, initializing with mock data');
        await this.initializeGroups();
        return mockChats;
      }
      
      const parsedGroups = JSON.parse(groups);
      console.log('Parsed groups:', parsedGroups);
      return parsedGroups;
    } catch (error) {
      console.error('Error getting groups:', error);
      throw error;
    }
  }

  private async saveGroups(groups: Chat[]): Promise<void> {
    try {
      console.log('Saving groups to storage:', groups);
      const storage = getStorage();
      await storage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      
      // Verify the save
      const savedGroups = await storage.getItem(GROUPS_STORAGE_KEY);
      console.log('Verified saved groups:', savedGroups);
      
      if (!savedGroups) {
        throw new Error('Failed to save groups');
      }
    } catch (error) {
      console.error('Error saving groups:', error);
      throw error;
    }
  }

  async initializeGroups(): Promise<void> {
    try {
      const storage = getStorage();
      const existingGroups = await storage.getItem(GROUPS_STORAGE_KEY);
      console.log('Existing groups during initialization:', existingGroups);
      
      if (!existingGroups) {
        console.log('Initializing groups with mock data:', mockChats);
        await storage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(mockChats));
      }
    } catch (error) {
      console.error('Error initializing groups:', error);
      throw error;
    }
  }

  async getGroup(id: string): Promise<Chat | null> {
    try {
      console.log('Fetching group:', id);
      const groups = await this.getGroups();
      const group = groups.find(g => g.id === id);
      console.log('Found group:', group);
      return group || null;
    } catch (error) {
      console.error('Error getting group:', error);
      throw error;
    }
  }

  async updateGroup(id: string, data: Partial<Chat>): Promise<Chat> {
    try {
      console.log('Updating group:', { id, data });
      const groups = await this.getGroups();
      const groupIndex = groups.findIndex(g => g.id === id);
      
      if (groupIndex === -1) {
        console.error('Group not found:', id);
        throw new Error('Group not found');
      }

      const updatedGroup = {
        ...groups[groupIndex],
        ...data,
        updated_at: new Date().toISOString()
      };

      console.log('Updated group data:', updatedGroup);
      groups[groupIndex] = updatedGroup;
      await this.saveGroups(groups);

      // Verify the update
      const savedGroups = await this.getGroups();
      const savedGroup = savedGroups.find(g => g.id === id);
      console.log('Saved group state:', savedGroup);

      if (!savedGroup) {
        throw new Error('Failed to save group update');
      }

      return savedGroup;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }
}

export const groupService = new GroupService(); 