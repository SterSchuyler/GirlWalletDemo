import { isValidPin } from '../utils/validation';

class PinService {
  /**
   * Validates a new PIN against basic requirements
   */
  async validateNewPin(newPin: string): Promise<void> {
    if (!isValidPin(newPin)) {
      throw new Error('PIN must be 6 digits');
    }
  }

  /**
   * Updates a user's PIN
   */
  async updatePin(userId: string, currentPin: string, newPin: string): Promise<void> {
    // Validate new PIN
    await this.validateNewPin(newPin);
  }
}

export const pinService = new PinService(); 