import '../src/utils/cryptoPolyfill';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from '../src/context/AppContext';
import { useColorScheme } from '../hooks/useColorScheme';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      index: undefined;
      login: undefined;
      register: undefined;
      createChat: undefined;
      chat: { id: string };
      wallet: { id: string };
      wallets: undefined;
    }
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <AppProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <StatusBar style="auto" />
        </AppProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

export function AppLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.outline,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallets"
        options={{
          title: 'Wallets',
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
