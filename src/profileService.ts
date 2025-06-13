import { User } from '../types/user';

interface UpdateProfileParams {
  name?: string;
  profilePicture?: string;
}

class ProfileService {
  private apiUrl = 'https://api.girlwallet.com';

  /**
   * Updates a user's profile information
   */
  async updateProfile(userId: string, params: UpdateProfileParams): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  }

  /**
   * Uploads a profile picture
   */
  async uploadProfilePicture(userId: string, imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const response = await fetch(`${this.apiUrl}/users/${userId}/profile-picture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload profile picture');
    }

    const data = await response.json();
    return data.imageUrl;
  }

  /**
   * Removes a user's profile picture
   */
  async removeProfilePicture(userId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/users/${userId}/profile-picture`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove profile picture');
    }
  }
}

export const profileService = new ProfileService(); 