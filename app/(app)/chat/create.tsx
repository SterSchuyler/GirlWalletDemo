import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { chatService } from '@services/chatService';
import { useAuth } from '@context/AuthContext';
import { User } from '@types';
import { groupService, walletService } from '@services';

interface Member {
  id: string;
  name: string;
  email: string;
}

const ChatCreate: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGroup = async () => {
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    try {
      setLoading(true);
      console.log('Starting group creation with data:', {
        name: groupName,
        description: groupDescription,
        selectedMembers: selectedMembers.map(m => m.id),
        currentUser: currentUser.id
      });

      // Create the group chat first
      const newGroup = await groupService.createGroup({
        name: groupName,
        description: groupDescription,
        members: [...selectedMembers.map(m => m.id), currentUser.id],
        created_by: currentUser.id,
        type: 'group',
        walletId: null // Will be updated after wallet creation
      });

      console.log('Group chat created:', newGroup);

      // Create the wallet
      const walletData = {
        name: `${groupName} Wallet`,
        currency: 'USD',
        requiredSignatures: Math.ceil((selectedMembers.length + 1) / 2),
        chatId: newGroup.id,
        members: [...selectedMembers.map(m => m.id), currentUser.id]
      };

      console.log('Creating wallet with data:', walletData);
      const newWallet = await walletService.createWallet(walletData);
      console.log('Wallet created:', newWallet);

      // Update the group with the wallet ID
      console.log('Updating group with wallet ID:', newWallet.id);
      const updatedGroup = await groupService.updateGroup(newGroup.id, {
        walletId: newWallet.id
      });
      console.log('Group updated with wallet:', updatedGroup);

      // Verify the update
      const finalGroup = await groupService.getGroup(newGroup.id);
      console.log('Final group state:', finalGroup);

      if (!finalGroup.walletId) {
        throw new Error('Failed to update group with wallet ID');
      }

      router.replace(`/chat/${newGroup.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error instanceof Error ? error.message : 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Create New Group</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        placeholder="Group Description"
        value={groupDescription}
        onChangeText={setGroupDescription}
        multiline
      />

      {error ? (
        <Text className="text-red-500 mb-4">{error}</Text>
      ) : null}

      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 items-center"
        onPress={handleCreateGroup}
        disabled={loading || !groupName.trim()}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Create Group</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChatCreate; 