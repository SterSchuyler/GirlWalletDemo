/**
 * Validates a phone number format
 * @param phoneNumber The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number is between 10 and 15 digits
  // This covers most international phone number formats
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Formats a phone number for display
 * @param phoneNumber The phone number to format
 * @returns formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    // US format: (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    // US format with country code: +1 (XXX) XXX-XXXX
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // For other formats, just add spaces every 3 digits
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
};

/**
 * Generates a 6-digit verification code
 * @returns 6-digit verification code as string
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validates a verification code
 * @param code The code to validate
 * @returns boolean indicating if the code is valid
 */
export const isValidVerificationCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

/**
 * Validates a PIN
 * @param pin The PIN to validate
 * @returns boolean indicating if the PIN is valid
 */
export const isValidPin = (pin: string): boolean => {
  return /^\d{6}$/.test(pin);
}; 