import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OnboardingService } from '../../services/onboardingService';
import { ValidationUtils } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingStep2Props {
  onNext: () => void;
  onPrevious: () => void;
  onSaveProgress: (data: any) => void;
}

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ 
  onNext, 
  onPrevious, 
  onSaveProgress 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;

    try {
      const profile = await OnboardingService.getUserProfile(user.id);
      if (profile?.location) {
        setFormData({
          street_address: profile.location.street_address || '',
          city: profile.location.city || '',
          state: profile.location.state || '',
          postal_code: profile.location.postal_code || '',
          country: profile.location.country || 'United States'
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const validateForm = () => {
    const validationErrors = ValidationUtils.validateStep2Data(formData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      await OnboardingService.saveStep2Data(user.id, formData);
      onNext();
    } catch (error: any) {
      console.error('Error saving step 2:', error);
      setErrors({ general: error.message || 'Failed to save address information. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'France', 'Japan', 'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact Details</h2>
        <p className="text-slate-600">Where can we reach you?</p>
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
        <Input
          type="text"
          label="Street Address"
          icon={MapPin}
          value={formData.street_address}
          onChange={(e) => handleInputChange('street_address', e.target.value)}
          error={errors.street_address}
          placeholder="123 Main Street"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            placeholder="New York"
            required
          />

          <Input
            type="text"
            label="State/Province"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            error={errors.state}
            placeholder="NY"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="Postal Code"
            value={formData.postal_code}
            onChange={(e) => handleInputChange('postal_code', e.target.value)}
            error={errors.postal_code}
            placeholder="10001"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              required
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            <strong>Privacy Notice:</strong> Your address information is encrypted and used only 
            for regulatory compliance and account verification. We never share your personal 
            information with third parties.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="ghost" type="button" onClick={onPrevious}>
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