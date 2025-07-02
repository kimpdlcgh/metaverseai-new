import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { NotificationService } from './notificationService';

// Static constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  onProgress?: (progress: number) => void;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export class ProfileService {
  /**
   * Validates an image file for upload.
   * @param file - The file to validate.
   * @returns An object with `valid` flag and an `error` message if invalid.
   */
  static validateImage(file: File): ImageValidationResult {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPG, PNG, and GIF formats are supported' };
    }

    // Check file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 5MB limit' };
    }

    return { valid: true };
  }

  /**
   * Compresses an image file before upload.
   * @param file - The image file to compress.
   * @param options - Optional compression settings.
   * @returns A promise that resolves to the compressed File.
   */
  static async compressImage(file: File, options?: ImageUploadOptions): Promise<File> {
    const defaultOptions: ImageUploadOptions = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      onProgress: undefined
    };
    const compressionOptions = { ...defaultOptions, ...options };

    try {
      return await imageCompression(file, compressionOptions);
    } catch (error: any) {
      console.error('Error compressing image:', error.message || error);
      throw new Error(`Failed to compress image: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Creates a thumbnail version of an image.
   * @param file - The original image file.
   * @param maxWidth - Maximum width of the thumbnail (default 200px).
   * @returns A promise that resolves to the thumbnail File.
   */
  static async createThumbnail(file: File, maxWidth: number = 200): Promise<File> {
    try {
      const options: ImageUploadOptions = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true
      };
      return await imageCompression(file, options);
    } catch (error: any) {
      console.error('Error creating thumbnail:', error.message || error);
      throw new Error(`Failed to create thumbnail: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Uploads an avatar image to storage and updates the user profile.
   * @param userId - User ID.
   * @param file - Image file to upload.
   * @param userEmail - User email for profile creation if needed.
   * @param userFullName - User full name for profile creation if needed.
   * @param onProgress - Optional progress callback.
   * @returns The public URL of the uploaded avatar image.
   */
  static async uploadAvatar(
    userId: string, 
    file: File, 
    userEmail?: string,
    userFullName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Validate the image file
      const validation = this.validateImage(file);
      if (!validation.valid) {
        console.error(`Avatar validation failed: ${validation.error}`);
        throw new Error(validation.error);
      }

      // Compress the image (optimize for avatar dimensions)
      const compressedFile = await this.compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 400, // Recommended max size for avatars
        useWebWorker: true,
        onProgress
      });

      // Create a unique file path: use user ID as a folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${userId}/${fileName}`;
      console.log(`Uploading avatar for user ${userId} to path: ${filePath}`);

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, compressedFile as File, {
          cacheControl: '3600',
          upsert: true
        });
      if (uploadError) {
        console.error('Supabase storage upload error (avatar):', uploadError);
        throw uploadError;
      }

      // Get the public URL of the uploaded avatar
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      console.log(`Avatar uploaded successfully: ${data.publicUrl}`);

      // Update the user profile with the new avatar URL
      await this.updateProfileImages(userId, { avatar_url: data.publicUrl }, userEmail, userFullName);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Uploads a cover photo to storage and updates the user profile.
   * @param userId - User ID.
   * @param file - Image file to upload.
   * @param userEmail - User email for profile creation if needed.
   * @param userFullName - User full name for profile creation if needed.
   * @param onProgress - Optional progress callback.
   * @returns The public URL of the uploaded cover photo.
   */
  static async uploadCoverPhoto(
    userId: string, 
    file: File, 
    userEmail?: string,
    userFullName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Validate the image file
      const validation = this.validateImage(file);
      if (!validation.valid) {
        console.error(`Cover photo validation failed: ${validation.error}`);
        throw new Error(validation.error);
      }

      // Compress the image (optimize for cover photo dimensions)
      const compressedFile = await this.compressImage(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1200, // Recommended max width for cover photos
        useWebWorker: true,
        onProgress
      });

      // Create a unique file path: use user ID as a folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `covers/${userId}/${fileName}`;
      console.log(`Uploading cover photo for user ${userId} to path: ${filePath}`);

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, compressedFile as File, {
          cacheControl: '3600',
          upsert: true
        });
      if (uploadError) {
        console.error('Supabase storage upload error (cover):', uploadError);
        throw uploadError;
      }

      // Get the public URL of the uploaded cover photo
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      console.log(`Cover photo uploaded successfully: ${data.publicUrl}`);

      // Update the user profile with the new cover photo URL
      await this.updateProfileImages(userId, { cover_image_url: data.publicUrl }, userEmail, userFullName);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading cover photo:', error);
      throw error;
    }
  }

  /**
   * Updates the user's profile record with new avatar and/or cover image URLs.
   * @param userId - User ID.
   * @param updates - An object containing `avatar_url` and/or `cover_image_url` to update.
   * @param userEmail - Optional user email, required for creating new profiles.
   * @param userFullName - Optional user full name, required for creating new profiles.
   * @returns The updated profile data.
   */
  static async updateProfileImages(
    userId: string, 
    updates: { avatar_url?: string; cover_image_url?: string; },
    userEmail?: string,
    userFullName?: string
  ): Promise<any> {
    try {
      // Validate the URLs if provided
      if (updates.avatar_url && !this.isValidUrl(updates.avatar_url)) {
        throw new Error('Invalid avatar URL');
      }
      if (updates.cover_image_url && !this.isValidUrl(updates.cover_image_url)) {
        throw new Error('Invalid cover image URL');
      }

      // First check if a profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id, email, full_name')
        .eq('user_id', userId)
        .maybeSingle();

      // Prepare the upsert data
      const upsertData = {
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      };

      // If profile doesn't exist, we need email and full_name for creation
      if (!existingProfile) {
        if (!userEmail || !userFullName || userEmail.trim() === '' || userFullName.trim() === '') {
          throw new Error('Email and full name are required to create a new profile');
        }
        
        // Add required fields for new profile creation
        Object.assign(upsertData, {
          email: userEmail.trim(),
          full_name: userFullName.trim(),
          email_verified: false,
          phone_verified: false,
          onboarding_completed: false,
          created_at: new Date().toISOString()
        });
      } else {
        // If profile exists, ensure we don't accidentally nullify required fields
        if (existingProfile.email) {
          upsertData.email = existingProfile.email;
        }
        if (existingProfile.full_name) {
          upsertData.full_name = existingProfile.full_name;
        }
      }

      // Upsert the user_profiles table in the database
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id'
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error updating profile images:', error);
        throw error;
      }

      // Trigger notifications for successful image uploads
      if (updates.avatar_url) {
        NotificationService.notifyImageUploaded(userId, 'avatar');
      }
      if (updates.cover_image_url) {
        NotificationService.notifyImageUploaded(userId, 'cover');
      }

      return data;
    } catch (error: any) {
      console.error('Error updating profile images:', error);
      throw error;
    }
  }

  /**
   * Checks if a string is a valid URL.
   * @param url - The URL to validate.
   * @returns `true` if the URL is valid, `false` otherwise.
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deletes an image from storage.
   * @param url - The public URL of the image to delete.
   * @returns A promise that resolves when the image is deleted.
   */
  static async deleteImage(url: string): Promise<void> {
    try {
      // Extract bucket and file path from the URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucketName = pathParts[1];
      const filePath = pathParts.slice(2).join('/');

      // Remove the file from the storage bucket
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      if (error) {
        console.error(`Error deleting image (${url}):`, error);
        throw error;
      }

      console.log(`Image deleted successfully: ${url}`);
    } catch (error: any) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Validates file data before saving (e.g., when updating profile images).
   * @param data - The data object to validate.
   * @returns An object with `valid` flag and an `error` message if invalid.
   */
  static validateFileData(data: any): { valid: boolean; error?: string } {
    if (!data) {
      return { valid: false, error: 'No data provided' };
    }

    // Example rule: At least one image URL must be provided
    if (data.avatar_url === undefined && data.cover_image_url === undefined) {
      return { valid: false, error: 'No image URLs provided' };
    }

    return { valid: true };
  }
}
