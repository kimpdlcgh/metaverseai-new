import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProfileService } from '../services/profileService';
import { NotificationService } from '../services/notificationService';
import ImageUploader from '../components/profile/ImageUploader';

interface UserProfileData {
  id?: string;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  avatar_url: string;
  cover_image_url: string;
  bio: string;
  location: {
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  first_name: string;
  last_name: string;
  professional_bio: string;
  degree: string;
  college: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const EditProfile: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [initialProfile, setInitialProfile] = useState<UserProfileData | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      showToast('info', 'Editing profile. Remember to save your changes!');
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      showToast('info', 'Loading profile data...');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      const newProfile = data || {
        user_id: user?.id,
        full_name: '',
        email: user?.email || '',
        phone_number: '',
        date_of_birth: '',
        avatar_url: '',
        cover_image_url: '',
        bio: '',
        location: {
          street_address: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        }
      };

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      const combinedData = {
        ...newProfile,
        location: data?.location || {
          street_address: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        },
        first_name: profileData?.first_name || '',
        last_name: profileData?.last_name || '',
        professional_bio: profileData?.professional_bio || '',
        degree: profileData?.degree || '',
        college: profileData?.college || ''
      };

      setProfile(combinedData);
      setInitialProfile(combinedData);
    } catch (error: any) {
      setErrorMessage(error.message);
      showToast('error', `Error loading profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!profile) return;

    if (field === 'phone_number') {
      value = value.replace(/[^\d+]/g, '').replace(/^([^+])/, '+$1').slice(0, 15);
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    if (field.startsWith('location.')) {
      const loc = field.split('.')[1];
      setProfile({
        ...profile,
        location: {
          ...profile.location,
          [loc]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  const validateForm = (): boolean => {
    if (!profile) return false;
    const newErrors: ValidationErrors = {};

    if (!profile.first_name) newErrors.first_name = 'First name is required';
    if (!profile.last_name) newErrors.last_name = 'Last name is required';
    if (!profile.full_name || profile.full_name.length < 2) newErrors.full_name = 'Full name must be at least 2 characters';
    if (profile.phone_number && !profile.phone_number.match(/^\+[1-9]\d{1,14}$/)) newErrors.phone_number = 'Invalid phone number';
    if (profile.date_of_birth) {
      const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
      if (age < 18) newErrors.date_of_birth = 'You must be at least 18 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('error', 'Please fix validation errors');
      return;
    }

    try {
      setSaving(true);
      showToast('info', 'Saving profile changes...');

      const { error: userProfileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
         email: profile.email,
          full_name: profile.full_name,
          phone_number: profile.phone_number || null,
          date_of_birth: profile.date_of_birth || null,
          avatar_url: profile.avatar_url || null,
          cover_image_url: profile.cover_image_url || null,
          bio: profile.bio || null,
          location: profile.location || null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (userProfileError) throw userProfileError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
         email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          professional_bio: profile.professional_bio || null,
          degree: profile.degree || null,
          college: profile.college || null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      await NotificationService.createNotification(user.id, {
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
        type: 'success'
      });

      setSuccessMessage('Profile updated successfully!');
      showToast('success', 'Profile updated successfully!');
      
      // Update initial profile to reflect saved changes
      setInitialProfile(profile);
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message);
      showToast('error', `Error updating profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialProfile) {
      setProfile(initialProfile);
      setErrors({});
      setSuccessMessage(null);
      setErrorMessage(null);
    }
    navigate('/profile');
  };

  const hasChanges = () => {
    if (!profile || !initialProfile) return false;
    return JSON.stringify(profile) !== JSON.stringify(initialProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile data</p>
          <Button onClick={() => navigate('/profile')} className="mt-4">
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-1">Update your personal information and preferences</p>
          </div>

          {/* Status Messages */}
          {successMessage && (
            <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Profile Images */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Images</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <ImageUploader
                    imageUrl={profile.avatar_url}
                    onImageChange={(url) => handleInputChange('avatar_url', url)}
                    type="avatar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <ImageUploader
                    imageUrl={profile.cover_image_url}
                    onImageChange={(url) => handleInputChange('cover_image_url', url)}
                    type="cover"
                  />
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name *
                  </label>
                  <Input
                    value={profile.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    error={errors.first_name}
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name *
                  </label>
                  <Input
                    value={profile.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    error={errors.last_name}
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    error={errors.full_name}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email (Cannot be changed)
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled={true}
                    placeholder="Enter your email"
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email changes must be made through your account settings
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <Input
                    value={profile.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    error={errors.phone_number}
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    error={errors.date_of_birth}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree
                  </label>
                  <Input
                    value={profile.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    placeholder="e.g., Bachelor's in Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/University
                  </label>
                  <Input
                    value={profile.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    placeholder="e.g., University of California"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  value={profile.professional_bio}
                  onChange={(e) => handleInputChange('professional_bio', e.target.value)}
                  placeholder="Tell us about your professional background..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Bio
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <MapPin className="w-5 h-5 inline mr-2" />
                Address Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <Input
                    value={profile.location.street_address}
                    onChange={(e) => handleInputChange('location.street_address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    value={profile.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <Input
                    value={profile.location.state}
                    onChange={(e) => handleInputChange('location.state', e.target.value)}
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <Input
                    value={profile.location.postal_code}
                    onChange={(e) => handleInputChange('location.postal_code', e.target.value)}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Input
                    value={profile.location.country}
                    onChange={(e) => handleInputChange('location.country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={saving || !hasChanges()}
                className="flex-1 sm:flex-none"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
