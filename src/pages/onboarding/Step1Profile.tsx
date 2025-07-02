import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Phone, Upload } from 'lucide-react';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export const Step1Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phone: '',
    investmentExperience: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      // First, get the current profile data to preserve existing address info
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('address')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching current profile:', fetchError);
        setErrors({ general: 'Failed to load profile. Please try again.' });
        return;
      }

      // Merge the new profile data with existing address data
      const existingAddress = currentProfile?.address || {};
      const updatedAddress = {
        ...existingAddress,
        date_of_birth: formData.dateOfBirth,
        investment_experience: formData.investmentExperience
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          address: updatedAddress,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving profile:', error);
        setErrors({ general: 'Failed to save profile. Please try again.' });
      } else {
        navigate('/onboarding/step2');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="+1 (555) 123-4567"
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