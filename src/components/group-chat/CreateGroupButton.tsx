import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

export const CreateGroupButton = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/createChat');
  };

  return (
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={handlePress}
      color="#FFFFFF"
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80, // Increased bottom margin to avoid navigation buttons
    backgroundColor: '#6200EE',
  },
});

export default CreateGroupButton; 