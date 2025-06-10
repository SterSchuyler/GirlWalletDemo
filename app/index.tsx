import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, FAB, Card, Avatar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { chatService } from '../src/lib/chatService';
import { Chat } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const fetchChats = async () => {
      try {
        const data = await chatService.getChats(currentUser.id);
        setChats(data);
      } catch (err: any) {
        console.error('Error fetching chats:', err);
        setError(err.message || 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentUser]);

  const handleCreateChat = () => {
    router.push('/createChat');
  };

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Group Chats
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {chats.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.emptyText}>
                  No group chats yet. Create a new group chat to get started!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            chats.map((chat) => (
              <Pressable
                key={chat.id}
                onPress={() => handleChatPress(chat.id)}
                style={({ pressed }) => [
                  styles.chatCard,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Card>
                  <Card.Content style={styles.chatContent}>
                    <Avatar.Text
                      size={50}
                      label={chat.name.substring(0, 2).toUpperCase()}
                      style={styles.avatar}
                    />
                    <View style={styles.chatInfo}>
                      <Text variant="titleMedium">{chat.name}</Text>
                      <Text variant="bodySmall" style={styles.lastMessage}>
                        {chat.lastMessage || 'No messages yet'}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateChat}
      />
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
  emptyCard: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
  },
  chatCard: {
    marginBottom: 8,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  lastMessage: {
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 