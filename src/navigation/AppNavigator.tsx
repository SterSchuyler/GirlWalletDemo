import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerifyPhoneScreen from '../screens/auth/VerifyPhoneScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ChangePinScreen from '../screens/settings/ChangePinScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ContactsScreen from '../screens/contacts/ContactsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import CreateChatScreen from '../screens/chat/CreateChatScreen';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ChangePin" component={ChangePinScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Contacts" component={ContactsScreen} />
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    <Stack.Screen name="NewChat" component={CreateChatScreen} />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const { user } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 