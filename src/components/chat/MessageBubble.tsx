import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { Message } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onReactionPress?: (messageId: string) => void;
  onLongPress?: (messageId: string) => void;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  onReactionPress,
  onLongPress,
}: MessageBubbleProps) {
  const handleLongPress = () => {
    onLongPress?.(message.id);
  };

  const handleReactionPress = () => {
    onReactionPress?.(message.id);
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <Text style={styles.messageText}>{message.content}</Text>;
      case 'image':
        return (
          <View style={styles.imageContainer}>
            <Text style={styles.messageText}>[Image]</Text>
          </View>
        );
      case 'file':
        return (
          <View style={styles.fileContainer}>
            <Text style={styles.messageText}>[File] {message.metadata?.fileName}</Text>
          </View>
        );
      case 'system':
        return <Text style={styles.systemText}>{message.content}</Text>;
      default:
        return null;
    }
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) {
      return null;
    }

    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(message.reactions).map(([emoji, userIds]) => (
          <View key={emoji} style={styles.reactionItem}>
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            {userIds.length > 1 && (
              <Text style={styles.reactionCount}>{userIds.length}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Pressable
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
      onLongPress={handleLongPress}
    >
      {!isOwnMessage && (
        <Avatar.Text
          size={32}
          label={message.senderId.substring(0, 2).toUpperCase()}
          style={styles.avatar}
        />
      )}
      <View style={styles.messageContainer}>
        {!isOwnMessage && (
          <Text style={styles.senderName}>User {message.senderId}</Text>
        )}
        {renderMessageContent()}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </Text>
          {isOwnMessage && (
            <Text style={styles.status}>{message.status}</Text>
          )}
        </View>
        {renderReactions()}
      </View>
      <IconButton
        icon="emoticon-outline"
        size={20}
        onPress={handleReactionPress}
        style={styles.reactionButton}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    marginRight: 8,
  },
  messageContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 12,
    flex: 1,
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
    lineHeight: 20,
  },
  systemText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  status: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  reactionButton: {
    margin: 0,
    marginLeft: 4,
  },
  imageContainer: {
    width: 200,
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
  },
}); 