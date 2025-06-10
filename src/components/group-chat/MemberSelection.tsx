import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, List, Checkbox, Button, Text } from 'react-native-paper';
import { useApp } from '../../context/AppContext';

interface MemberSelectionProps {
  onNext: (members: string[]) => void;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function MemberSelection({ onNext }: MemberSelectionProps) {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const mockContacts: Contact[] = [
        { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
        { id: '2', name: 'Bob Johnson', email: 'bob@example.com' },
        { id: '3', name: 'Carol White', email: 'carol@example.com' },
        { id: '4', name: 'Dave Brown', email: 'dave@example.com' },
      ];
      // Filter out the current user from contacts
      const filteredContacts = mockContacts.filter(contact => contact.id !== user?.id);
      setContacts(filteredContacts);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleNext = () => {
    if (selectedMembers.length < 2) {
      setError('Please select at least 2 members');
      return;
    }
    onNext(selectedMembers);
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <List.Item
      title={item.name}
      description={item.email}
      left={props => (
        <List.Icon
          {...props}
          icon={item.avatar ? { uri: item.avatar } : 'account'}
        />
      )}
      right={props => (
        <Checkbox
          status={selectedMembers.includes(item.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleMember(item.id)}
        />
      )}
      onPress={() => toggleMember(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search contacts"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Loading contacts...' : 'No contacts found'}
          </Text>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedMembers.length} members selected
        </Text>
        <Button
          mode="contained"
          onPress={handleNext}
          disabled={selectedMembers.length < 2}
          style={styles.nextButton}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  list: {
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedCount: {
    marginBottom: 8,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 8,
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    margin: 16,
    color: '#666',
  },
}); 