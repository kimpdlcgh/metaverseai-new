import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { OnboardingService } from '../../services/onboardingService';

export const Step2Address: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
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
      if (profile?.location) {
        setFormData({
          streetAddress: profile.location.street_address || '',
          city: profile.location.city || '',
          state: profile.location.state || '',
          postalCode: profile.location.postal_code || '',
          country: profile.location.country || 'United States'
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
      showToast('error', 'Failed to load address data');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
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
      await OnboardingService.saveStep2Data(user.id, {
        street_address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country
      });
      
      // Save progress in onboarding service
      await OnboardingService.updateOnboardingProgress(user.id, 2, formData);

      setSaveStatus('saved');
      showToast('success', 'Address information saved');
      navigate('/user-onboarding/step3');
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({ general: 'An unexpected error occurred' });
      setSaveStatus('error');
      showToast('error', 'Failed to save address information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-save progress
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
      await OnboardingService.updateOnboardingProgress(user.id, 2, data);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error auto-saving progress:', error);
      setSaveStatus('error');
    }
  };

  return (
    <OnboardingLayout
      currentStep={2}
      title="Address Information"
      subtitle="We need your address for regulatory compliance"
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
          label="Street Address"
          icon={MapPin}
          value={formData.streetAddress}
          onChange={(e) => handleInputChange('streetAddress', e.target.value)}
          error={errors.streetAddress}
          placeholder="123 Main Street"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            placeholder="New York"
          />

          <Input
            type="text"
            label="State/Province"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            error={errors.state}
            placeholder="NY"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="Postal Code"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            error={errors.postalCode}
            placeholder="10001"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            <strong>Privacy Notice:</strong> Your address information is encrypted and used only for regulatory compliance and account verification. We never share your personal information with third parties.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="ghost" onClick={() => navigate('/user-onboarding/step1')}>
            Back
          </Button>
          <Button type="submit" loading={loading}>
            Continue
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};