import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateVerificationCode } from '../utils/validation';

const VERIFICATION_CODES_STORAGE_KEY = '@verification_codes';

interface VerificationCode {
  code: string;
  phoneNumber: string;
  timestamp: number;
  attempts: number;
}

class VerificationService {
  private async getStoredCodes(): Promise<Record<string, VerificationCode>> {
    try {
      const stored = await AsyncStorage.getItem(VERIFICATION_CODES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading verification codes:', error);
      return {};
    }
  }

  private async saveCodes(codes: Record<string, VerificationCode>): Promise<void> {
    try {
      await AsyncStorage.setItem(VERIFICATION_CODES_STORAGE_KEY, JSON.stringify(codes));
    } catch (error) {
      console.error('Error saving verification codes:', error);
      throw new Error('Failed to save verification code');
    }
  }

  async generateAndStoreCode(phoneNumber: string): Promise<string> {
    const codes = await this.getStoredCodes();
    const code = generateVerificationCode();
    
    // Store the new code
    codes[phoneNumber] = {
      code,
      phoneNumber,
      timestamp: Date.now(),
      attempts: 0
    };

    // Clean up old codes (older than 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    Object.keys(codes).forEach(key => {
      if (codes[key].timestamp < tenMinutesAgo) {
        delete codes[key];
      }
    });

    await this.saveCodes(codes);
    return code;
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const codes = await this.getStoredCodes();
    const storedCode = codes[phoneNumber];

    if (!storedCode) {
      throw new Error('No verification code found for this phone number');
    }

    // Check if code has expired (10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    if (storedCode.timestamp < tenMinutesAgo) {
      delete codes[phoneNumber];
      await this.saveCodes(codes);
      throw new Error('Verification code has expired');
    }

    // Check if too many attempts
    if (storedCode.attempts >= 3) {
      delete codes[phoneNumber];
      await this.saveCodes(codes);
      throw new Error('Too many failed attempts. Please request a new code');
    }

    // Increment attempts
    storedCode.attempts++;

    if (storedCode.code === code) {
      // Code is correct, remove it
      delete codes[phoneNumber];
      await this.saveCodes(codes);
      return true;
    }

    // Code is incorrect, save updated attempts
    await this.saveCodes(codes);
    return false;
  }

  async canRequestNewCode(phoneNumber: string): Promise<boolean> {
    const codes = await this.getStoredCodes();
    const storedCode = codes[phoneNumber];

    if (!storedCode) {
      return true;
    }

    // Check if last code was requested more than 1 minute ago
    const oneMinuteAgo = Date.now() - 60 * 1000;
    return storedCode.timestamp < oneMinuteAgo;
  }
}

export const verificationService = new VerificationService(); 