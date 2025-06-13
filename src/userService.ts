import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'react-native-bcrypt';
import { User, UpdateUserData } from '../types/user';

const USERS_STORAGE_KEY = '@users';

type UserWithPassword = User & { password: string };

class UserService {
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private async getUsers(): Promise<UserWithPassword[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  private async saveUsers(users: UserWithPassword[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Failed to save users');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (error: Error, hash?: string) => {
        if (error) reject(error);
        else if (hash) resolve(hash);
        else reject(new Error('Failed to hash password'));
      });
    });
  }

  private async comparePasswords(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (error: Error, result?: boolean) => {
        if (error) reject(error);
        else if (typeof result === 'boolean') resolve(result);
        else reject(new Error('Failed to compare passwords'));
      });
    });
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const users = await this.getUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const hashedPassword = await this.hashPassword(password);
      const newUser: UserWithPassword = {
        id: this.generateId(),
        email,
        name,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
        preferences: {
          notifications: {
            push: true,
            sms: true
          },
          privacy: {
            showBalance: true,
            showTransactions: true,
            showGroups: true
          },
          theme: 'system',
          language: 'en'
        }
      };

      // Save user
      users.push(newUser);
      await this.saveUsers(users);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const users = await this.getUsers();
      
      // Find user
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValid = await this.comparePasswords(password, user.password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      await this.saveUsers(users);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.id === id);
      if (!user) return null;

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser = { ...users[userIndex] };

      if (data.name) updatedUser.name = data.name;
      if (data.email) updatedUser.email = data.email;
      if (data.password) {
        updatedUser.password = await this.hashPassword(data.password);
      }
      if (data.avatar) updatedUser.avatar = data.avatar;
      if (data.bio) updatedUser.bio = data.bio;
      if (data.preferences) {
        updatedUser.preferences = {
          ...updatedUser.preferences,
          ...data.preferences
        };
      }

      updatedUser.updatedAt = new Date().toISOString();
      users[userIndex] = updatedUser;
      await this.saveUsers(users);

      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const filteredUsers = users.filter(u => u.id !== id);
      await this.saveUsers(filteredUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 