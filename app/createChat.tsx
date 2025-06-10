import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, List, Checkbox, Searchbar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { userService } from '../src/lib/userService';
import { User } from '../src/types';

export default function CreateChatScreen() {
  const router = useRouter();
  const { currentUser, createChat } = useApp();
  const [chatName, setChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const fetchContacts = async () => {
      try {
        const users = await userService.getUsers();
        // Filter out current user from contacts
        setContacts(users.filter(user => user.id !== currentUser.id));
      } catch (err: any) {
        console.error('Error fetching contacts:', err);
        setError(err.message || 'Failed to load contacts');
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleCreateChat = async () => {
    if (!chatName.trim() || !currentUser || selectedContacts.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Creating new chat...');
      const chat = await createChat({
        name: chatName.trim(),
        type: 'group',
        members: [currentUser.id, ...selectedContacts],
      });
      console.log('Chat created successfully:', chat);

      // Navigate to the chat screen
      router.push({
        pathname: '/chat/[id]',
        params: { id: chat.id }
      });
    } catch (err: any) {
      console.error('Error creating chat:', err);
      setError(err.message || 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Group Chat
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TextInput
            label="Group Name"
            value={chatName}
            onChangeText={setChatName}
            style={styles.input}
            maxLength={50}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Add Members
          </Text>

          <Searchbar
            placeholder="Search contacts"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          {filteredContacts.map((contact) => (
            <List.Item
              key={contact.id}
              title={contact.name}
              description={contact.email}
              left={props => (
                <List.Image
                  {...props}
                  source={{ uri: contact.avatar }}
                />
              )}
              right={props => (
                <Checkbox
                  status={selectedContacts.includes(contact.id) ? 'checked' : 'unchecked'}
                  onPress={() => handleContactSelect(contact.id)}
                />
              )}
            />
          ))}

          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleCreateChat}
            loading={loading}
            disabled={!chatName.trim() || selectedContacts.length === 0 || loading}
            style={styles.button}
          >
            Create Group Chat
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
}); 