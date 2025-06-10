import { User } from '../types';
import { mockUsers } from './mockData';

export const userService = {
  async getCurrentUser(): Promise<User | null> {
    // For demo purposes, always return the first user
    return mockUsers[0];
  },

  async getUser(id: string): Promise<User | null> {
    return mockUsers.find(user => user.id === id) || null;
  },

  async getUsers(): Promise<User[]> {
    return mockUsers;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = mockUsers.find(u => u.id === id);
    if (!user) return null;

    Object.assign(user, {
      ...data,
      updated_at: new Date().toISOString(),
    });

    return user;
  },
}; 