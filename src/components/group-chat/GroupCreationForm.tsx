import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface GroupCreationFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    photo: string | null;
  }) => void;
}

export default function GroupCreationForm({ onSubmit }: GroupCreationFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Group name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Group name must be at least 3 characters';
    }

    if (description && description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ name, description, photo });
    }
  };

  const pickImage = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder} />
        )}
        <Button
          mode="outlined"
          onPress={pickImage}
          loading={loading}
          disabled={loading}
          style={styles.photoButton}
        >
          {photo ? 'Change Photo' : 'Add Photo'}
        </Button>
      </View>

      <TextInput
        label="Group Name"
        value={name}
        onChangeText={setName}
        error={!!errors.name}
        style={styles.input}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name}</Text>
      )}

      <TextInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        error={!!errors.description}
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={loading}
        style={styles.submitButton}
      >
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  photoButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 12,
  },
  submitButton: {
    marginTop: 24,
  },
}); 