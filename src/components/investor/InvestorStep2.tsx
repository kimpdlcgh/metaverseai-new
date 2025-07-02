import React, { useState, useEffect } from 'react';
import { MapPin, Home, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { InvestorService } from '../../services/investorService';
import { InvestorValidationUtils } from '../../utils/investorValidation';
import { useAuth } from '../../contexts/AuthContext';
import { COUNTRIES } from '../../types/investor';

interface InvestorStep2Props {
  onNext: () => void;
  onPrevious: () => void;
}

export const InvestorStep2: React.FC<InvestorStep2Props> = ({ onNext, onPrevious }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    house_number: '',
    street_name: '',
    village: '',
    town: '',
    city: '',
    postal_code: '',
    country: 'United States'
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
      if (profile.address) {
        setFormData({
          house_number: profile.address.house_number || '',
          street_name: profile.address.street_name || '',
          village: profile.address.village || '',
          town: profile.address.town || '',
          city: profile.address.city || '',
          postal_code: profile.address.postal_code || '',
          country: profile.address.country || 'United States'
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const validateForm = () => {
    const validationErrors = InvestorValidationUtils.validateStep2Data(formData);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      await InvestorService.saveStep2Data(user.id, formData);
      onNext();
    } catch (error: any) {
      console.error('Error saving step 2:', error);
      setErrors({ general: error.message || 'Failed to save address information. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Residential Address</h2>
        <p className="text-slate-600">We need your address for regulatory compliance</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="House/Building Number *"
            icon={Home}
            value={formData.house_number}
            onChange={(e) => handleInputChange('house_number', e.target.value)}
            error={errors.house_number}
            placeholder="123"
            required
          />

          <Input
            type="text"
            label="Street Name *"
            icon={MapPin}
            value={formData.street_name}
            onChange={(e) => handleInputChange('street_name', e.target.value)}
            error={errors.street_name}
            placeholder="Main Street"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="Village/Subdivision"
            value={formData.village}
            onChange={(e) => handleInputChange('village', e.target.value)}
            error={errors.village}
            placeholder="Village or subdivision name"
          />

          <Input
            type="text"
            label="Town/District"
            value={formData.town}
            onChange={(e) => handleInputChange('town', e.target.value)}
            error={errors.town}
            placeholder="Town or district name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="City *"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            placeholder="New York"
            required
          />

          <Input
            type="text"
            label="Postal Code *"
            value={formData.postal_code}
            onChange={(e) => handleInputChange('postal_code', e.target.value)}
            error={errors.postal_code}
            placeholder="10001"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Country *
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            required
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            <strong>Regulatory Compliance:</strong> Your address information is required for 
            Know Your Customer (KYC) regulations and is securely encrypted. This helps us 
            ensure compliance with financial regulations in your jurisdiction.
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