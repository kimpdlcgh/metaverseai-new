import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { ProfileService } from '../../services/profileService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { NotificationService } from '../../services/notificationService';

interface ImageUploaderProps {
  type: 'avatar' | 'cover';
  imageUrl?: string;
  onImageChange: (url: string) => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  type,
  imageUrl,
  onImageChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);

  const { showToast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAvatar = type === 'avatar';
  const imageTypeLabel = isAvatar ? 'profile picture' : 'cover photo';

  const handleFileSelected = useCallback(async (file: File) => {
    setError(null);
    setSuccess(false);

    // Validate user authentication and required data first
    if (!user) {
      setError('You must be logged in to upload images');
      showToast('error', 'You must be logged in to upload images');
      return;
    }

    // Validate that we have the required user information
    const userEmail = user?.email;
    const userFullName = user?.user_metadata?.full_name;
    
    if (!userEmail || !userFullName) {
      const missingFields = [];
      if (!userEmail) missingFields.push('email');
      if (!userFullName) missingFields.push('full name');
      
      const errorMessage = `Missing required user information: ${missingFields.join(', ')}. Please complete your profile setup.`;
      setError(errorMessage);
      showToast('error', errorMessage);
      return;
    }

    // Validate file with fallback validation
    let validation;
    if (ProfileService && typeof ProfileService.validateImage === 'function') {
      validation = ProfileService.validateImage(file);
    } else {
      // Fallback validation if ProfileService is undefined
      validation = validateImageFallback(file);
    }
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      showToast('error', `Failed to upload ${imageTypeLabel}: ${validation.error}`);
      return;
    }

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    showToast('info', `Preparing to upload ${imageTypeLabel}...`);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload based on type
      let imageUrl;
      
      if (ProfileService && typeof ProfileService.uploadAvatar === 'function' && typeof ProfileService.uploadCoverPhoto === 'function') {
        if (isAvatar) {
          imageUrl = await ProfileService.uploadAvatar(
            user.id, 
            file, 
            userEmail,
            userFullName,
            (progress) => setUploadProgress(progress)
          );
        } else {
          imageUrl = await ProfileService.uploadCoverPhoto(
            user.id, 
            file,
            userEmail,
            userFullName,
            (progress) => setUploadProgress(progress)
          );
        }
      } else {
        throw new Error('Profile service is not available. Please refresh the page and try again.');
      }

      onImageChange(imageUrl);
      setSuccess(true);
      showToast('success', `${isAvatar ? 'Avatar' : 'Cover photo'} uploaded successfully!`);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.message || `Failed to upload ${imageTypeLabel}`;
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [user, imageTypeLabel, isAvatar, onImageChange, showToast]);

  // Fallback validation function
  const validateImageFallback = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }
    
    return { valid: true };
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }, [handleFileSelected]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        className={`
          relative overflow-hidden border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
          ${isAvatar ? 'w-32 h-32 rounded-full' : 'w-full h-48'}
          ${error ? 'border-red-300' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <div className="relative w-full h-full group">
            <img
              src={previewUrl}
              alt={`${isAvatar ? 'Avatar' : 'Cover'} preview`}
              className={`w-full h-full object-cover ${isAvatar ? 'rounded-full' : 'rounded-lg'}`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-600 transition-colors"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Upload className={`${isAvatar ? 'w-8 h-8' : 'w-12 h-12'} text-gray-400 mb-2`} />
            <p className="text-sm text-gray-600 mb-1">
              Click or drag to upload {imageTypeLabel}
            </p>
            <p className="text-xs text-gray-500">
              Max 5MB, JPEG/PNG/WebP
            </p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600 mb-1">Uploading...</p>
            <p className="text-xs text-gray-500">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Status indicators */}
      <div className="mt-2 space-y-1">
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{isAvatar ? 'Avatar' : 'Cover photo'} uploaded successfully!</span>
          </div>
        )}

        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;