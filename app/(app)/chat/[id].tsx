import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useApp } from '../../../src/context/AppContext';
import { Message } from '../../../src/types';
import { messageService } from '../../../src/services/messageService';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentUser, chats, messages: allMessages, sendMessage } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const chat = chats.find(c => c.id === id);

  useEffect(() => {
    const loadMessages = async () => {
      if (!id || !currentUser) {
        setError('Chat ID or user not found');
        setLoading(false);
        return;
      }

      try {
        const chatMessages = await messageService.getMessages(id as string);
        setMessages(chatMessages);
      } catch (err: any) {
        console.error('Error loading messages:', err);
        setError(err.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [id, currentUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !chat) return;

    try {
      const message = await sendMessage({
        chatId: chat.id,
        content: newMessage.trim(),
        type: 'text'
      });
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
    }
  };

  const handleCreateWallet = () => {
    router.push({
      pathname: '/(app)/createWallet/[chatId]',
      params: { chatId: id }
    });
  };

  const handleOpenWallet = () => {
    if (chat?.walletId) {
      router.push({
        pathname: '/(app)/wallet/[id]',
        params: { id: chat.walletId }
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <Text>Loading chat...</Text>
      </View>
    );
  }

  if (error || !chat) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error || 'Chat not found'}
        </Text>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen 
        options={{ 
          title: chat.name,
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => router.back()}
            />
          ),
          headerRight: () => (
            <IconButton
              icon={chat.walletId ? "wallet" : "wallet-outline"}
              size={24}
              onPress={chat.walletId ? handleOpenWallet : handleCreateWallet}
            />
          ),
        }} 
      />

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.senderId === currentUser?.id
                ? styles.sentMessage
                : styles.receivedMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.senderId === currentUser?.id ? styles.sentMessageText : styles.receivedMessageText
            ]}>
              {message.content}
            </Text>
            <Text style={[
              styles.messageTime,
              message.senderId === currentUser?.id ? styles.sentMessageTime : styles.receivedMessageTime
            ]}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={styles.input}
          multiline
        />
        <IconButton
          icon="send"
          size={24}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 8,
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  sentMessageTime: {
    color: '#fff',
    opacity: 0.8,
  },
  receivedMessageTime: {
    color: '#000',
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  error: {
    marginBottom: 16,
  },
}); 