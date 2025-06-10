import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Switch, List, Button, Text } from 'react-native-paper';

interface GroupSettingsProps {
  onComplete: (settings: {
    isPrivate: boolean;
    notifications: boolean;
  }) => void;
}

export default function GroupSettings({ onComplete }: GroupSettingsProps) {
  const [isPrivate, setIsPrivate] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    try {
      setLoading(true);
      setError(null);
      await onComplete({ isPrivate, notifications });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Privacy Settings</List.Subheader>
        <List.Item
          title="Private Group"
          description="Only members can see group content"
          right={() => (
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              disabled={loading}
            />
          )}
        />
        {isPrivate && (
          <List.Item
            title="Invite Link"
            description="Generate a link to invite new members"
            right={() => (
              <Button
                mode="outlined"
                onPress={() => {/* TODO: Implement invite link generation */}}
                disabled={loading}
              >
                Generate
              </Button>
            )}
          />
        )}
      </List.Section>

      <List.Section>
        <List.Subheader>Notification Settings</List.Subheader>
        <List.Item
          title="Group Notifications"
          description="Receive notifications for new messages"
          right={() => (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              disabled={loading}
            />
          )}
        />
      </List.Section>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleComplete}
          loading={loading}
          disabled={loading}
          style={styles.createButton}
        >
          Create Group
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  createButton: {
    marginTop: 8,
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    margin: 16,
  },
}); 