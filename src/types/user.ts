export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isVerified: boolean;
  preferences: UserPreferences;
  profilePicture?: string;
}

export interface UserPreferences {
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
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface RequestPasswordResetData {
  email: string;
} 