import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import { chatService } from '../../services/chatService';
import { Message } from '../../types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';

type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

const ChatRoomScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const route = useRoute<ChatRoomScreenRouteProp>();
  const { chatId } = route.params;

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const message = await chatService.sendMessage(chatId, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={<Text style={styles.empty}>No messages yet.</Text>}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={styles.input}
        />
        <IconButton icon="send" onPress={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  messageText: { fontSize: 16 },
  messageTime: { fontSize: 12, color: '#888' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, marginRight: 10 },
});

export default ChatRoomScreen; 