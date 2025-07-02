import React, { useState, useEffect } from 'react';
import { User, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OnboardingService } from '../../services/onboardingService';
import { ValidationUtils } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingStep3Props {
  onComplete: () => void;
  onPrevious: () => void;
  onSaveProgress: (data: any) => void;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ 
  onComplete, 
  onPrevious, 
  onSaveProgress 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bio: '',
    avatar_url: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;

    try {
      const profile = await OnboardingService.getUserProfile(user.id);
      if (profile) {
        setFormData({
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const validateForm = () => {
    const validationErrors = ValidationUtils.validateStep3Data(formData);
    const errorMap: Record<string, string> = {};
    
    validationErrors.forEach(error => {
      errorMap[error.field] = error.message;
    });

    setErrors(errorMap);
    return validationErrors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-save progress
    setSaveStatus('idle');
    setTimeout(() => {
      saveProgress({ ...formData, [field]: value });
    }, 1000);
  };

  const saveProgress = async (data: any) => {
    if (!user) return;

    try {
      setSaveStatus('saving');
      onSaveProgress(data);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);

    try {
      const avatarUrl = await OnboardingService.uploadAvatar(user.id, file);
      handleInputChange('avatar_url', avatarUrl);
    } catch (error: any) {
      setErrors({ avatar_url: error.message || 'Failed to upload avatar' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      await OnboardingService.saveStep3Data(user.id, formData);
      onComplete();
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      setErrors({ general: error.message || 'Failed to complete onboarding. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await OnboardingService.saveStep3Data(user.id, { bio: '', avatar_url: '' });
      onComplete();
    } catch (error: any) {
      console.error('Error skipping step 3:', error);
      setErrors({ general: error.message || 'Failed to complete onboarding. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Optional Information</h2>
        <p className="text-slate-600">Help us personalize your experience (optional)</p>
      </div>

      {/* Save Status Indicator */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        {saveStatus === 'saving' && (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-600">Saving...</span>
          </>
        )}
        {saveStatus === 'saved' && (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-600">Progress saved</span>
          </>
        )}
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            {formData.avatar_url && (
              <img
                src={formData.avatar_url}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
              />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={uploadingAvatar}
              />
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
              </label>
              <p className="text-xs text-slate-500 mt-1">
                JPEG, PNG, or WebP. Max 5MB.
              </p>
            </div>
          </div>
          {errors.avatar_url && (
            <p className="text-sm text-red-600">{errors.avatar_url}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            rows={4}
            placeholder="Tell us a bit about yourself..."
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{errors.bio || ''}</span>
            <span>{formData.bio.length}/500</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm">
            <strong>Almost done!</strong> This is the final step. You can skip this section 
            and complete it later in your profile settings.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="ghost" type="button" onClick={onPrevious}>
            Previous
          </Button>
          <div className="space-x-3">
            <Button variant="outline" type="button" onClick={handleSkip} disabled={loading}>
              Skip
            </Button>
            <Button type="submit" loading={loading}>
              Complete Setup
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};