import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { chatService } from '../../services/chatService';

const CreateChatScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [participantIds, setParticipantIds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const handleCreateChat = async () => {
    if (!name.trim() || !participantIds.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const chat = await chatService.createGroupChat(name, participantIds.split(',').map(id => id.trim()));
      navigation.navigate('ChatRoom', { chatId: chat.id });
    } catch (err: any) {
      setError(err.message || 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Create New Chat
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Enter chat details below
          </Text>

          <TextInput
            label="Chat Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Participant IDs (comma-separated)"
            value={participantIds}
            onChangeText={setParticipantIds}
            style={styles.input}
            error={!!error}
          />

          {error ? (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleCreateChat}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Chat
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  content: { padding: 16 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 24, color: '#666' },
  input: { marginBottom: 16 },
  error: { marginBottom: 16 },
  button: { marginTop: 8 },
});

export default CreateChatScreen; 