import React, { useState, useEffect } from 'react';
import { User, Phone, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OnboardingService } from '../../services/onboardingService';
import { ValidationUtils } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingStep1Props {
  onNext: () => void;
  onSaveProgress: (data: any) => void;
}

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, onSaveProgress }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    // Load existing data if available
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;

    try {
      const profile = await OnboardingService.getUserProfile(user.id);
      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          phone_number: profile.phone_number || '',
          date_of_birth: profile.date_of_birth || '',
          email: profile.email || user.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const validateForm = () => {
    const validationErrors = ValidationUtils.validateStep1Data(formData);
    const errorMap: Record<string, string> = {};
    
    validationErrors.forEach(error => {
      errorMap[error.field] = error.message;
    });

    setErrors(errorMap);
    return validationErrors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-save progress after a delay
    setSaveStatus('idle');
    setTimeout(() => {
      saveProgress({ ...formData, [field]: value });
    }, 1000);
  };

  const saveProgress = async (data: any) => {
    if (!user) return;

    try {
      setSaveStatus('saving');
      const progress = await OnboardingService.getOnboardingProgress(user.id);
      
      if (progress) {
        const updatedStepData = {
          ...progress.step_data,
          step1: data
        };

        await OnboardingService.updateOnboardingProgress(user.id, 1, data);
      }

      onSaveProgress(data);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving progress:', error);
      setSaveStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      await OnboardingService.saveStep1Data(user.id, formData);
      onNext();
    } catch (error: any) {
      console.error('Error saving step 1:', error);
      setErrors({ general: error.message || 'Failed to save information. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Auto-format to E.164 if user enters without +
    if (value && !value.startsWith('+')) {
      return `+${value.replace(/\D/g, '')}`;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h2>
        <p className="text-slate-600">Tell us about yourself to get started</p>
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
        {saveStatus === 'error' && (
          <>
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-600">Save failed</span>
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
        <Input
          type="email"
          label="Email Address"
          icon={User}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="Enter your email address"
          disabled={true} // Email comes from auth
          helperText="This email is from your account registration"
        />

        <Input
          type="text"
          label="Full Name"
          icon={User}
          value={formData.full_name}
          onChange={(e) => handleInputChange('full_name', e.target.value)}
          error={errors.full_name}
          placeholder="Enter your full legal name"
          required
        />

        <Input
          type="tel"
          label="Phone Number"
          icon={Phone}
          value={formData.phone_number}
          onChange={(e) => handleInputChange('phone_number', formatPhoneNumber(e.target.value))}
          error={errors.phone_number}
          placeholder="+1234567890"
          helperText="Enter in E.164 format (e.g., +1234567890)"
        />

        <Input
          type="date"
          label="Date of Birth"
          icon={Calendar}
          value={formData.date_of_birth}
          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
          error={errors.date_of_birth}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          required
          helperText="You must be at least 18 years old"
        />

        <div className="flex justify-between pt-6">
          <Button variant="ghost" type="button" disabled>
            Previous
          </Button>
          <Button type="submit" loading={loading}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};