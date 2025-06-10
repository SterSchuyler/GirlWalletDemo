import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useApp } from '../../context/AppContext';

interface Props {
  children: React.ReactNode;
}

export const GroupErrorBoundary: React.FC<Props> = ({ children }) => {
  const { groupsError, refreshGroups } = useApp();

  if (groupsError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Group Error</Text>
        <Text style={styles.message}>{groupsError}</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={refreshGroups}
            style={styles.button}
          >
            Refresh Groups
          </Button>
          <Button
            mode="outlined"
            onPress={() => window.location.reload()}
            style={styles.button}
          >
            Reload App
          </Button>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    minWidth: 150,
  },
}); 