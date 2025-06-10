import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Searchbar, IconButton, Avatar, List, useTheme, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { contactsService } from '../../services/contactsService';
import { Contact } from '../../types/contact';

type ContactsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Contacts'>;

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newContactPhone, setNewContactPhone] = useState('');
  const navigation = useNavigation<ContactsScreenNavigationProp>();
  const theme = useTheme();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await contactsService.getContacts();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleImportPhoneContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const phoneContacts = await contactsService.getPhoneContacts();
      if (phoneContacts.length === 0) {
        Alert.alert('No Contacts', 'No phone contacts found with valid phone numbers.');
        return;
      }

      // Show confirmation dialog with contact count
      Alert.alert(
        'Import Contacts',
        `Found ${phoneContacts.length} contacts. Would you like to import them?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            onPress: async () => {
              try {
                // Add each contact to the app
                for (const contact of phoneContacts) {
                  await contactsService.addContact(contact.phoneNumber);
                }
                // Reload contacts after import
                await loadContacts();
                Alert.alert('Success', 'Contacts imported successfully!');
              } catch (err) {
                Alert.alert('Error', err instanceof Error ? err.message : 'Failed to import contacts');
              }
            },
          },
        ]
      );
    } catch (err) {
      if (err instanceof Error && err.message.includes('Permission')) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your contacts.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Settings',
              onPress: () => {
                // Open app settings
                // Note: You might need to implement platform-specific settings navigation
              },
            },
          ]
        );
      } else {
        setError(err instanceof Error ? err.message : 'Failed to import contacts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const results = await contactsService.searchContacts(query);
        setContacts(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search contacts');
      } finally {
        setLoading(false);
      }
    } else {
      loadContacts();
    }
  };

  const handleAddContact = async () => {
    if (!newContactPhone.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      const newContact = await contactsService.addContact(newContactPhone.trim());
      setContacts(prev => [...prev, newContact]);
      setShowAddDialog(false);
      setNewContactPhone('');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await contactsService.removeContact(contactId);
              setContacts(prev => prev.filter(contact => contact.id !== contactId));
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to remove contact');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <List.Item
      title={item.name}
      description={item.phoneNumber}
      left={props => (
        <Avatar.Text
          {...props}
          size={40}
          label={item.name.slice(0, 2).toUpperCase()}
          style={styles.avatar}
        />
      )}
      right={props => (
        <IconButton
          {...props}
          icon="delete"
          onPress={() => handleRemoveContact(item.id)}
        />
      )}
      onPress={() => {
        // Navigate to chat or contact details
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Contacts</Text>
        <IconButton
          icon="plus"
          size={24}
          onPress={() => setShowAddDialog(true)}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleImportPhoneContacts}
            loading={loading}
            disabled={loading}
            icon="phone"
            style={styles.importButton}
          >
            Import Phone Contacts
          </Button>
        </View>

        <Searchbar
          placeholder="Search contacts"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />

        {error ? (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadContacts}
        />
      </View>

      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>Add Contact</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Phone Number"
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
            <Button
              onPress={handleAddContact}
              loading={loading}
              disabled={loading}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  actions: {
    marginBottom: 16,
  },
  importButton: {
    marginBottom: 8,
  },
  searchBar: {
    marginBottom: 16,
  },
  list: {
    flexGrow: 1,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  error: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
}); 