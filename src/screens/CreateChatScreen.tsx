import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme/theme';
import { mockUsers } from '../mocks/users';
import { User } from '../mocks/users';
import { useNavigation } from '@react-navigation/native';

const CreateChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [step, setStep] = useState<'select' | 'name'>('select');

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleNext = () => {
    if (selectedUsers.length > 0) {
      setStep('name');
    }
  };

  const handleCreate = () => {
    if (groupName.trim()) {
      // Here you would typically create the chat
      navigation.goBack();
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        selectedUsers.includes(item.id) && styles.selectedUserItem,
      ]}
      onPress={() => toggleUserSelection(item.id)}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userPhone}>{item.phoneNumber}</Text>
      </View>
      {selectedUsers.includes(item.id) && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 'select' ? 'New Group Chat' : 'Name Group Chat'}
        </Text>
        <TouchableOpacity
          onPress={step === 'select' ? handleNext : handleCreate}
          disabled={
            (step === 'select' && selectedUsers.length === 0) ||
            (step === 'name' && !groupName.trim())
          }>
          <Text
            style={[
              styles.nextButton,
              ((step === 'select' && selectedUsers.length === 0) ||
                (step === 'name' && !groupName.trim())) &&
                styles.disabledButton,
            ]}>
            {step === 'select' ? 'Next' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>

      {step === 'select' ? (
        <FlatList
          data={mockUsers}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.userList}
        />
      ) : (
        <View style={styles.nameContainer}>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor={theme.colors.placeholder}
            autoFocus
          />
          <Text style={styles.memberCount}>
            {selectedUsers.length} members selected
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  cancelButton: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.primary,
  },
  nextButton: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  disabledButton: {
    opacity: 0.5,
  },
  userList: {
    padding: theme.spacing.medium,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: theme.spacing.small,
  },
  selectedUserItem: {
    backgroundColor: theme.colors.primary + '20',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  userPhone: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.medium,
  },
  nameContainer: {
    padding: theme.spacing.medium,
  },
  input: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
    borderRadius: 8,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  memberCount: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
});

export default CreateChatScreen; 