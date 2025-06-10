import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, List, Avatar, FAB, ActivityIndicator } from 'react-native-paper';
import { chatService } from '../../services/chatService';
import { Chat } from '../../types';
import { useNavigation } from '@react-navigation/native';

const ChatListScreen: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getChats();
      setChats(data);
      console.log('Loaded chats:', data); // Log loaded chats for testing
    } catch (err: any) {
      setError(err.message || 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat: Chat) => {
    navigation.navigate('ChatRoom', { chatId: chat.id });
  };

  const renderItem = ({ item }: { item: Chat }) => {
    let title = '';
    if (item.type === 'group') {
      title = item.name || 'Group Chat';
    } else {
      // For direct chats, show participant IDs (excluding self, if available in future)
      title = 'Direct Chat: ' + item.participants.join(', ');
    }
    return (
      <TouchableOpacity onPress={() => handleChatPress(item)}>
        <List.Item
          title={title}
          description={item.lastMessage ? item.lastMessage.content : 'No messages yet'}
          left={() => (
            <Avatar.Text
              label={title[0] || '?'}
              size={40}
            />
          )}
          right={() => (
            item.unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            ) : null
          )}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={<Text style={styles.empty}>No chats yet.</Text>}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('NewChat')}
        label="New Chat"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', margin: 16 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  unreadBadge: {
    backgroundColor: '#e53935',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  unreadText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatListScreen; 