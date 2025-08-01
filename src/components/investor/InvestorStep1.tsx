import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { InvestorService } from '../../services/investorService';
import { InvestorValidationUtils } from '../../utils/investorValidation';
import { useAuth } from '../../contexts/AuthContext';

interface InvestorStep1Props {
  onSubmit: (data: any, isValid: boolean) => Promise<void>;
}

export const InvestorStep1: React.FC<InvestorStep1Props> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    email: user?.email || '',
    self_description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;

    try {
      const profile = await InvestorService.getInvestorProfile(user.id);
      if (profile.investor) {
        setFormData({
          first_name: profile.investor.first_name || '',
          middle_name: profile.investor.middle_name || '',
          last_name: profile.investor.last_name || '',
          phone_number: profile.investor.phone_number || '',
          email: profile.investor.email || user.email || '',
          self_description: profile.investor.self_description || ''
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const validateForm = () => {
    const validationErrors = InvestorValidationUtils.validateStep1Data(formData);
    let errorMap: Record<string, string> = {};
    
    validationErrors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    
    // Additional validation for required fields
    if (!formData.first_name.trim()) {
      errorMap.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errorMap.last_name = 'Last name is required';
    }
    
    if (!formData.phone_number.trim()) {
      errorMap.phone_number = 'Phone number is required';
    }

    setErrors(errorMap);
    return validationErrors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const formatPhoneNumber = (value: string) => {
    // Auto-format to E.164 if user enters without +
    if (value && !value.startsWith('+')) {
      return `+${value.replace(/\D/g, '')}`;
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isValid = validateForm();
    if (!user) {
      setErrors({ general: 'User authentication required. Please log in again.' });
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData, isValid);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 focus:outline-none" tabIndex={-1} id="step1-content">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h2>
        <p className="text-slate-600 mb-2">Tell us about yourself to get started</p>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      <form id="step1-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Input
          type="email"
          label="Email Address *"
          icon={Mail}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="Enter your email address"
          disabled
          required
          helperText="This email is from your account registration"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="First Name *"
            icon={User}
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            error={errors.first_name}
            placeholder="Enter your first name"
            required
          />

          <Input
            type="text"
            label="Last Name *"
            icon={User}
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            error={errors.last_name}
            placeholder="Enter your last name"
            required
          />
        </div>

        <Input
          type="text"
          label="Middle Name"
          icon={User}
          value={formData.middle_name}
          onChange={(e) => handleInputChange('middle_name', e.target.value)}
          error={errors.middle_name}
          placeholder="Enter your middle name (optional)"
        />

        <Input
          type="tel"
          label="Phone Number *"
          icon={Phone}
          value={formData.phone_number}
          onChange={(e) => handleInputChange('phone_number', formatPhoneNumber(e.target.value))}
          error={errors.phone_number}
          placeholder="+1234567890"
          helperText="Enter in E.164 format (e.g., +1234567890)"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Describe Yourself
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <textarea
              value={formData.self_description}
              onChange={(e) => handleInputChange('self_description', e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              rows={4}
              placeholder="Tell us a bit about yourself, your background, and your investment interests..."
              maxLength={500}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{errors.self_description || ''}</span>
            <span>{formData.self_description.length}/500</span>
          </div>
        </div>
        
        {/* Navigation controls moved to fixed footer in parent component */}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            <strong>Privacy Notice:</strong> Your personal information is encrypted and used only 
            for account verification and personalized investment recommendations. We never share 
            your personal information with third parties.
          </p>
        </div>
        
        {/* Hidden submit button that can be triggered programmatically */}
        <button type="submit" className="hidden">Submit</button>
      </form>
    </div>
  );
};