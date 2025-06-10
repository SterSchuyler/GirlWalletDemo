import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user, logout } = useApp();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Profile"
            description="View and edit your profile"
            left={props => <List.Icon {...props} icon="account" />}
            onPress={() => navigation.navigate('Profile')}
          />
          <List.Item
            title="Change PIN"
            description="Update your security PIN"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => navigation.navigate('ChangePin')}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Notifications"
            description="Manage notification settings"
            left={props => <List.Icon {...props} icon="bell" />}
            onPress={() => {}}
          />
          <List.Item
            title="Privacy"
            description="Manage privacy settings"
            left={props => <List.Icon {...props} icon="shield" />}
            onPress={() => {}}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help Center"
            description="Get help and support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => {}}
          />
          <List.Item
            title="About"
            description="App information and version"
            left={props => <List.Icon {...props} icon="information" />}
            onPress={() => {}}
          />
        </List.Section>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  logoutButton: {
    marginTop: 32,
    borderColor: 'red',
  },
}); 