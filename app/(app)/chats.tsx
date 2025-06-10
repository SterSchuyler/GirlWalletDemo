import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, FAB, Card, Avatar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';

export default function ChatsScreen() {
  const router = useRouter();
  const { currentUser, chats, chatsLoading, chatsError, refreshChats } = useApp();
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    refreshChats();
  }, [currentUser]);

  const handleCreateChat = () => {
    router.push('/(app)/createChat');
  };

  const handleChatPress = (chatId: string) => {
    router.push(`/(app)/chat/${chatId}`);
  };

  if (!currentUser) {
    return null;
  }

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
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {chatsError}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Chats
          </Text>

          {chats.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.emptyText}>
                  No chats yet. Create a new chat to get started!
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
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
  error: {
    marginBottom: 16,
  },
}); 