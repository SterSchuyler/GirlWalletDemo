import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { theme } from '../theme/theme';
import { mockChats } from '../mocks/chats';
import { mockUsers } from '../mocks/users';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: "Hey everyone! Let's plan our beach trip! 🏖️",
    senderId: '1',
    timestamp: '10:30 AM',
    status: 'read',
  },
  {
    id: '2',
    text: "I'm thinking Miami! The weather will be perfect in May 🌴",
    senderId: '2',
    timestamp: '10:32 AM',
    status: 'read',
  },
  {
    id: '3',
    text: "I found this amazing Airbnb with a pool!",
    senderId: '3',
    timestamp: '10:35 AM',
    status: 'delivered',
  },
  {
    id: '4',
    text: "That sounds perfect! How much per night?",
    senderId: '4',
    timestamp: '10:36 AM',
    status: 'sent',
  },
];

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        senderId: '1', // Current user ID
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getSenderName = (senderId: string) => {
    const user = mockUsers.find(u => u.id === senderId);
    return user ? user.name : 'Unknown User';
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === '1'; // Current user ID
    const sender = mockUsers.find(u => u.id === item.senderId);

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}>
        {!isMe && (
          <Image
            source={{ uri: sender?.avatar || 'https://i.pravatar.cc/150?img=1' }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}>
          {!isMe && (
            <Text style={styles.senderName}>{getSenderName(item.senderId)}</Text>
          )}
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText,
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {isMe && (
              <Text style={styles.messageStatus}>
                {item.status === 'read' ? '✓✓' : item.status === 'delivered' ? '✓✓' : '✓'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Beach Trip 2024</Text>
        <Text style={styles.headerSubtitle}>5 members</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.placeholder}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled
          ]} 
          onPress={sendMessage}
          disabled={!newMessage.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.medium,
    paddingTop: theme.spacing.xlarge,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  messagesList: {
    padding: theme.spacing.medium,
  },
  messageContainer: {
    marginBottom: theme.spacing.small,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: theme.spacing.medium,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.primary,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.medium,
  },
  messageText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
  },
  myMessageText: {
    color: '#ffffff',
  },
  otherMessageText: {
    color: theme.colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.placeholder,
    marginRight: 4,
  },
  messageStatus: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.placeholder,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    marginRight: theme.spacing.small,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.medium,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default ChatScreen; 