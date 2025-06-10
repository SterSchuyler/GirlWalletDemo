import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Text, IconButton, Portal, Modal, Avatar, useTheme } from 'react-native-paper';
import { useApp } from '../../src/context/AppContext';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { GroupErrorBoundary } from '../../src/components/group-chat/GroupErrorBoundary';
import GroupInfo from '../../src/components/group-chat/GroupInfo';
import MessageBubble from '../../src/components/chat/MessageBubble';
import MessageInput from '../../src/components/chat/MessageInput';
import { messageService } from '../../src/services/messageService';
import { Message } from '../../src/types';
import { theme } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentUser, chats, chatsLoading, refreshChats } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const chat = chats.find(c => c.id === id);

  const loadMessages = useCallback(async () => {
    if (!id || !currentUser) {
      console.log('Cannot load messages: missing id or currentUser', { id, currentUser });
      return;
    }
    
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      console.log('Loading messages for chat:', id);
      const loadedMessages = await messageService.getMessages(id as string);
      console.log('Loaded messages:', loadedMessages);
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessagesError('Failed to load messages. Please try again.');
    } finally {
      setMessagesLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, redirecting to login');
      router.replace('/login');
      return;
    }

    const initializeChat = async () => {
      try {
        console.log('Initializing chat:', id);
        await refreshChats();
        
        if (!chat) {
          console.error('Chat not found, redirecting to chat list');
          router.replace('/chat');
          return;
        }
        
        await loadMessages();
      } catch (err: any) {
        console.error('Error initializing chat:', err);
        setError(err.message || 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [id, currentUser, loadMessages, refreshChats, chat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !chat) {
      console.log('Cannot send message:', { newMessage, currentUser, chat });
      return;
    }

    try {
      const messageData = {
        chatId: chat.id,
        senderId: currentUser.id,
        content: newMessage.trim(),
        type: 'text' as const
      };

      console.log('Sending message:', messageData);
      const message = await messageService.createMessage(messageData);
      console.log('Message sent:', message);
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
    }
  };

  const handleCreateWallet = () => {
    router.push({
      pathname: '/createWallet',
      params: { chatId: chat?.id }
    });
  };

  const handleOpenWallet = () => {
    if (!chat?.walletId) return;
    router.push({
      pathname: '/wallet/[id]',
      params: { id: chat.walletId }
    });
  };

  const handleReactionPress = (messageId: string) => {
    setSelectedMessageId(messageId);
    setReactionModalVisible(true);
  };

  const handleLongPress = (messageId: string) => {
    // TODO: Show message options (delete, edit, etc.)
    console.log('Long press on message:', messageId);
  };

  const handleAddReaction = async (emoji: string) => {
    if (!selectedMessageId || !currentUser) {
      console.log('Cannot add reaction: missing messageId or currentUser');
      return;
    }

    try {
      const updatedMessage = await messageService.addReaction(
        selectedMessageId,
        emoji,
        currentUser.id
      );
      setMessages(prev =>
        prev.map(m => (m.id === selectedMessageId ? updatedMessage : m))
      );
    } catch (error) {
      console.error('Failed to add reaction:', error);
    } finally {
      setReactionModalVisible(false);
      setSelectedMessageId(null);
    }
  };

  if (chatsLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  if (error || !chat) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error || 'Chat not found'}
        </Text>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GroupErrorBoundary>
        <Stack.Screen
          options={{
            title: chat.name,
            headerBackTitle: 'Chats',
            headerBackVisible: true,
            headerRight: () => (
              <IconButton
                icon="information"
                onPress={() => setInfoVisible(true)}
              />
            ),
          }}
        />
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
              <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                  <Text style={styles.headerTitle} numberOfLines={1}>
                    {chat?.name || 'Chat'}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {chat?.members.length || 0} members
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={chat.walletId ? handleOpenWallet : handleCreateWallet}
                  style={styles.createWalletButton}
                >
                  <Ionicons 
                    name={chat.walletId ? "wallet" : "wallet-outline"} 
                    size={24} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.senderId === currentUser?.id
                      ? styles.sentMessage
                      : styles.receivedMessage,
                  ]}
                >
                  {message.senderId !== currentUser?.id && (
                    <Avatar.Text
                      size={32}
                      label={chat.name.substring(0, 2).toUpperCase()}
                      style={styles.avatar}
                    />
                  )}
                  <MessageBubble
                    message={message}
                    isOwnMessage={message.senderId === currentUser?.id}
                    onReactionPress={() => handleReactionPress(message.id)}
                    onLongPress={() => handleLongPress(message.id)}
                  />
                </View>
              ))}
            </ScrollView>

            <MessageInput
              onSend={(message) => {
                setNewMessage(message);
                handleSendMessage();
              }}
              onAttachmentPress={() => console.log('Attachment pressed')}
              onImagePress={() => console.log('Image pressed')}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>

        <Portal>
          <Modal
            visible={infoVisible}
            onDismiss={() => setInfoVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <GroupInfo
              chat={chat}
              onClose={() => setInfoVisible(false)}
            />
          </Modal>
        </Portal>
      </GroupErrorBoundary>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 8,
  },
  input: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  createWalletButton: {
    padding: 8,
  },
}); 