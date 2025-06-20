import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Polyfill for crypto.getRandomValues()
  if (typeof window !== 'undefined' && !window.crypto) {
    window.crypto = window.crypto || {};
  }
  if (typeof window !== 'undefined' && !window.crypto.getRandomValues) {
    window.crypto.getRandomValues = function getRandomValues<T extends ArrayBufferView | null>(array: T): T {
      if (array instanceof Uint8Array) {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }
      return array;
    };
  }
} 