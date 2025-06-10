import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { profileService } from '../../services/profileService';
import { useApp } from '../../context/AppContext';
import * as ImagePicker from 'expo-image-picker';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, setUser } = useApp();
  const theme = useTheme();

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    } else {
      setName(user.name);
    }
  }, [user, navigation]);

  const handleUpdateName = async () => {
    if (!user) return;

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedUser = await profileService.updateProfile(user.id, {
        name: name.trim(),
      });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    if (!user) return;

    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access media library was denied');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setLoading(true);
        setError('');

        // Upload image
        const imageUrl = await profileService.uploadProfilePicture(
          user.id,
          result.assets[0].uri
        );

        // Update user profile
        const updatedUser = await profileService.updateProfile(user.id, {
          profilePicture: imageUrl,
        });
        setUser(updatedUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePicture = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await profileService.removeProfilePicture(user.id);
      const updatedUser = await profileService.updateProfile(user.id, {
        profilePicture: undefined,
      });
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove profile picture');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.profilePictureContainer}>
          {user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <Avatar.Text
              size={120}
              label={user.name.slice(0, 2).toUpperCase()}
              style={styles.avatar}
            />
          )}
          <View style={styles.profilePictureActions}>
            <Button
              mode="contained"
              onPress={handlePickImage}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {user.profilePicture ? 'Change Picture' : 'Add Picture'}
            </Button>
            {user.profilePicture && (
              <Button
                mode="outlined"
                onPress={handleRemovePicture}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Remove Picture
              </Button>
            )}
          </View>
        </View>

        <View style={styles.nameContainer}>
          {isEditing ? (
            <>
              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                error={!!error}
              />
              {error ? (
                <Text style={[styles.error, { color: theme.colors.error }]}>
                  {error}
                </Text>
              ) : null}
              <View style={styles.nameActions}>
                <Button
                  mode="contained"
                  onPress={handleUpdateName}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                >
                  Save
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setError('');
                  }}
                  disabled={loading}
                  style={styles.button}
                >
                  Cancel
                </Button>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.name}>{user.name}</Text>
              <Button
                mode="text"
                onPress={() => setIsEditing(true)}
                style={styles.editButton}
              >
                Edit Name
              </Button>
            </>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{user.phoneNumber}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  profilePictureActions: {
    marginTop: 16,
    gap: 8,
  },
  nameContainer: {
    marginBottom: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 8,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
  nameActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    minWidth: 120,
  },
}); 