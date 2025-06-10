import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, Button, Card, Avatar, useTheme, IconButton, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { User } from '../../src/types';

export default function CreateChatScreen() {
  const router = useRouter();
  const { currentUser, createChat } = useApp();
  const theme = useTheme();

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<User[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Load contacts from a service
    // For now, using mock data
    setContacts([
      { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
      { id: '2', name: 'Bob Johnson', email: 'bob@example.com' },
      { id: '3', name: 'Carol White', email: 'carol@example.com' },
    ]);
  }, []);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact: User) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleCreateChat = async () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    if (selectedContacts.length < 2) {
      setError('Please select at least 2 members');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newChat = await createChat({
        name: groupName.trim(),
        members: [currentUser!, ...selectedContacts],
        createdBy: currentUser!.id,
        lastMessage: null,
        lastMessageTime: null,
      });

      router.replace(`/(app)/chat/${newChat.id}`);
    } catch (err: any) {
      console.error('Error creating chat:', err);
      setError(err.message || 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Create New Group Chat
          </Text>

          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                style={styles.input}
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

              <View style={styles.contactsList}>
                {filteredContacts.map((contact) => (
                  <Pressable
                    key={contact.id}
                    onPress={() => handleContactSelect(contact)}
                    style={({ pressed }) => [
                      styles.contactItem,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Card>
                      <Card.Content style={styles.contactContent}>
                        <Avatar.Text
                          size={40}
                          label={contact.name.substring(0, 2).toUpperCase()}
                          style={styles.avatar}
                        />
                        <View style={styles.contactInfo}>
                          <Text variant="titleMedium">{contact.name}</Text>
                          <Text variant="bodySmall">{contact.email}</Text>
                        </View>
                        <IconButton
                          icon={selectedContacts.find(c => c.id === contact.id) ? 'check-circle' : 'circle-outline'}
                          size={24}
                          onPress={() => handleContactSelect(contact)}
                        />
                      </Card.Content>
                    </Card>
                  </Pressable>
                ))}
              </View>
            </Card.Content>
          </Card>

          {error && (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleCreateChat}
            loading={loading}
            disabled={loading || !groupName.trim() || selectedContacts.length < 2}
            style={styles.createButton}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  formCard: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  contactsList: {
    gap: 8,
  },
  contactItem: {
    marginBottom: 8,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  createButton: {
    marginTop: 16,
  },
  error: {
    marginBottom: 16,
  },
}); 