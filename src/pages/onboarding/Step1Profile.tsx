import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Phone, Upload } from 'lucide-react';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext'; 
import { useToast } from '../../contexts/ToastContext';
import { OnboardingService } from '../../services/onboardingService';

export const Step1Profile: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phone_number: '',
    investmentExperience: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load existing data when component mounts
  React.useEffect(() => {
    if (user) {
      loadExistingData();
    }
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;

    try {
      const profile = await OnboardingService.getUserProfile(user.id);
      if (profile) {
        setFormData({
          fullName: profile.full_name || '',
          dateOfBirth: profile.date_of_birth || '',
          phone_number: profile.phone_number || '',
          investmentExperience: 'beginner' // Default value
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
      showToast('error', 'Failed to load profile data');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be in E.164 format (e.g., +1234567890)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);
    setSaveStatus('saving');

    try {
      await OnboardingService.saveStep1Data(user.id, {
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        phone_number: formData.phone_number
      });
      
      // Save progress in onboarding service
      await OnboardingService.updateOnboardingProgress(user.id, 1, {
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        phone_number: formData.phone_number,
        investment_experience: formData.investmentExperience
      });

      setSaveStatus('saved');
      showToast('success', 'Profile information saved');
      navigate('/user-onboarding/step2');
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({ general: 'An unexpected error occurred' });
      setSaveStatus('error');
      showToast('error', 'Failed to save profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-save progress after delay
    if (user) {
      setSaveStatus('idle');
      const timer = setTimeout(() => {
        saveProgress({ ...formData, [field]: value });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  };

  const saveProgress = async (data: any) => {
    if (!user) return;
    
    try {
      setSaveStatus('saving');
      await OnboardingService.updateOnboardingProgress(user.id, 1, data);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error auto-saving progress:', error);
      setSaveStatus('error');
    }
  };

  // Format phone number to E.164
  const formatPhoneNumber = (value: string) => {
    // Auto-format to E.164 if user enters without +
    if (value && !value.startsWith('+')) {
      return `+${value.replace(/\D/g, '')}`;
    }
    return value;
  };

  return (
    <OnboardingLayout
      currentStep={1}
      title="Basic Profile Information"
      subtitle="Tell us about yourself to get started"
    >
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}
    
    {/* Save Status Indicator */}
    <div className="flex items-center justify-center space-x-2 text-sm mb-4">
      {saveStatus === 'saving' && (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-600">Saving...</span>
        </>
      )}
      {saveStatus === 'saved' && (
        <>
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="text-green-600">Progress saved</span>
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-red-600">Save failed</span>
        </>
      )}
    </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          label="Full Name"
          icon={User}
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          error={errors.fullName}
          placeholder="Enter your full legal name"
        />

        <Input
          type="date"
          label="Date of Birth"
          icon={Calendar}
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
        />

        <Input
          type="tel"
          label="Phone Number"
          icon={Phone}
          value={formData.phone_number}
          onChange={(e) => handleInputChange('phone_number', formatPhoneNumber(e.target.value))}
          error={errors.phone_number}
          placeholder="+1 (555) 123-4567"
          helperText="Enter in E.164 format (e.g., +1234567890)"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Investment Experience Level
          </label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'beginner', label: 'Beginner', desc: 'New to investing' },
              { value: 'intermediate', label: 'Intermediate', desc: '1-5 years experience' },
              { value: 'advanced', label: 'Advanced', desc: '5+ years experience' },
              { value: 'expert', label: 'Expert', desc: 'Professional investor' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="investmentExperience"
                  value={option.value}
                  checked={formData.investmentExperience === option.value}
                  onChange={(e) => handleInputChange('investmentExperience', e.target.value)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-sm text-slate-500">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
          <Button type="submit" loading={loading}>
            Continue
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};