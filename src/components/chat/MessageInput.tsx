import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';

interface MessageInputProps {
  onSend: (message: string) => void;
  onAttachmentPress?: () => void;
  onImagePress?: () => void;
}

export default function MessageInput({
  onSend,
  onAttachmentPress,
  onImagePress,
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <IconButton
          icon="image"
          size={24}
          onPress={onImagePress}
          style={styles.button}
        />
        <IconButton
          icon="attachment"
          size={24}
          onPress={onAttachmentPress}
          style={styles.button}
        />
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
          style={styles.input}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSend}
              disabled={!message.trim()}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: 'transparent',
    marginVertical: 4,
  },
  button: {
    margin: 0,
  },
}); 