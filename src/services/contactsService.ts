import { Contact } from '../types/contact';
import * as Contacts from 'expo-contacts';

class ContactsService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'https://api.girlwallet.com';
  }

  async requestPhoneContactsPermission(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
  }

  async getPhoneContacts(): Promise<Contact[]> {
    const hasPermission = await this.requestPhoneContactsPermission();
    if (!hasPermission) {
      throw new Error('Permission to access contacts was denied');
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Name,
        Contacts.Fields.Image,
      ],
    });

    return data
      .filter(contact => {
        const hasId = Boolean(contact.id);
        const hasPhoneNumber = contact.phoneNumbers && contact.phoneNumbers.length > 0;
        const phoneNumber = contact.phoneNumbers?.[0]?.number;
        return hasId && hasPhoneNumber && phoneNumber;
      })
      .map(contact => ({
        id: contact.id!,
        name: contact.name || 'Unknown',
        phoneNumber: contact.phoneNumbers![0].number!,
        profilePicture: contact.imageAvailable ? contact.image?.uri : undefined,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
  }

  async getContacts(): Promise<Contact[]> {
    const response = await fetch(`${this.apiUrl}/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch contacts');
    }

    return response.json();
  }

  async addContact(phoneNumber: string): Promise<Contact> {
    const response = await fetch(`${this.apiUrl}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add contact');
    }

    return response.json();
  }

  async removeContact(contactId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove contact');
    }
  }

  async searchContacts(query: string): Promise<Contact[]> {
    const response = await fetch(`${this.apiUrl}/contacts/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search contacts');
    }

    return response.json();
  }
}

export const contactsService = new ContactsService(); 