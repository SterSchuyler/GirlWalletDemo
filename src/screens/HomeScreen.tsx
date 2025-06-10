import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon="account-group"
            size={24}
            onPress={() => router.push('/createChat')}
          />
          <IconButton
            icon="account"
            size={24}
            onPress={() => router.push('/(tabs)/explore')}
          />
          <IconButton
            icon="cog"
            size={24}
            onPress={() => router.push('/(tabs)/explore')}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="wallet"
              onPress={() => router.push('/(tabs)/wallet')}
              style={styles.actionButton}
            >
              View Wallets
            </Button>
            <Button
              mode="contained"
              icon="chat"
              onPress={() => router.push('/(tabs)/chat')}
              style={styles.actionButton}
            >
              View Chats
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
}); 