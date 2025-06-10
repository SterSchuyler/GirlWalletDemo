import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import WalletScreen from './src/screens/WalletScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import CreateWalletScreen from './src/screens/CreateWalletScreen';
import GroupInfoScreen from './src/screens/GroupInfoScreen';
import WalletInfoScreen from './src/screens/WalletInfoScreen';
import { useApp } from './src/context/AppContext';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Chat: { groupId: string; groupName: string };
  Wallet: { walletId: string; walletName: string };
  CreateGroup: undefined;
  CreateWallet: undefined;
  GroupInfo: { groupId: string };
  WalletInfo: { walletId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const { currentUser, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!currentUser ? (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Girl Wallet' }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen}
              options={({ route }) => ({ 
                title: route.params.groupName || 'Chat'
              })}
            />
            <Stack.Screen 
              name="Wallet" 
              component={WalletScreen}
              options={({ route }) => ({ 
                title: route.params.walletName || 'Wallet'
              })}
            />
            <Stack.Screen 
              name="CreateGroup" 
              component={CreateGroupScreen}
              options={{ title: 'Create Group' }}
            />
            <Stack.Screen 
              name="CreateWallet" 
              component={CreateWalletScreen}
              options={{ title: 'Create Wallet' }}
            />
            <Stack.Screen 
              name="GroupInfo" 
              component={GroupInfoScreen}
              options={{ title: 'Group Info' }}
            />
            <Stack.Screen 
              name="WalletInfo" 
              component={WalletInfoScreen}
              options={{ title: 'Wallet Info' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 