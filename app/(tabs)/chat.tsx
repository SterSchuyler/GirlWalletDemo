import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Chat } from '../../src/types';
import { useApp } from '../../src/context/AppContext';

export default function ChatTab() {
  const router = useRouter();
  const { chats, chatsLoading, chatsError } = useApp();

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleCreateChat = () => {
    router.push('/chat/new');
  };

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id)}
    >
      <Avatar.Text
        label={item.name.slice(0, 2).toUpperCase()}
        size={40}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        {item.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (chatsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (chatsError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{chatsError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No active chats yet</Text>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateChat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 