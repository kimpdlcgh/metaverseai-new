import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { InvestorService } from '../../services/investorService';
import { InvestorValidationUtils } from '../../utils/investorValidation';
import { useAuth } from '../../contexts/AuthContext';
import { 
  INCOME_RANGES, 
  NET_WORTH_RANGES, 
  INVESTMENT_GOALS, 
  INVESTMENT_SECTORS, 
  INVESTMENT_AMOUNT_RANGES,
  PREVIOUS_INVESTMENTS 
} from '../../types/investor';

interface InvestorStep3Props {
  onComplete: () => void;
  onPrevious: () => void;
}

export const InvestorStep3: React.FC<InvestorStep3Props> = ({ onComplete, onPrevious }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    investment_experience: 'beginner',
    risk_tolerance: 'moderate',
    investment_timeline: '5-10 years',
    annual_income_range: '',
    net_worth_range: '',
    investment_goals: [] as string[],
    preferred_sectors: [] as string[],
    investment_amount_range: '',
    has_investment_advisor: false,
    previous_investments: [] as string[]
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
      if (profile.investmentProfile) {
        setFormData({
          investment_experience: profile.investmentProfile.investment_experience || 'beginner',
          risk_tolerance: profile.investmentProfile.risk_tolerance || 'moderate',
          investment_timeline: profile.investmentProfile.investment_timeline || '5-10 years',
          annual_income_range: profile.investmentProfile.annual_income_range || '',
          net_worth_range: profile.investmentProfile.net_worth_range || '',
          investment_goals: profile.investmentProfile.investment_goals || [],
          preferred_sectors: profile.investmentProfile.preferred_sectors || [],
          investment_amount_range: profile.investmentProfile.investment_amount_range || '',
          has_investment_advisor: profile.investmentProfile.has_investment_advisor || false,
          previous_investments: profile.investmentProfile.previous_investments || []
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const validateForm = () => {
    const validationErrors = InvestorValidationUtils.validateStep3Data(formData);
    const errorMap: Record<string, string> = {};
    
    validationErrors.forEach(error => {
      errorMap[error.field] = error.message;
    });

    setErrors(errorMap);
    return validationErrors.length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field: 'investment_goals' | 'preferred_sectors' | 'previous_investments', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      await InvestorService.saveStep3Data(user.id, formData);
      onComplete();
    } catch (error: any) {
      console.error('Error saving step 3:', error);
      setErrors({ general: error.message || 'Failed to save investment profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Investment Profile</h2>
        <p className="text-slate-600">Help us understand your investment preferences and goals</p>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Investment Experience */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Investment Experience Level *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: 'beginner', label: 'Beginner', desc: 'New to investing' },
              { value: 'intermediate', label: 'Intermediate', desc: '1-5 years experience' },
              { value: 'advanced', label: 'Advanced', desc: '5+ years experience' },
              { value: 'expert', label: 'Expert', desc: 'Professional investor' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="investment_experience"
                  value={option.value}
                  checked={formData.investment_experience === option.value}
                  onChange={(e) => handleInputChange('investment_experience', e.target.value)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-sm text-slate-500">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.investment_experience && (
            <p className="text-sm text-red-600">{errors.investment_experience}</p>
          )}
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Risk Tolerance *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'conservative', label: 'Conservative', desc: 'Lower risk, steady returns' },
              { value: 'moderate', label: 'Moderate', desc: 'Balanced risk and return' },
              { value: 'aggressive', label: 'Aggressive', desc: 'Higher risk, higher potential returns' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="risk_tolerance"
                  value={option.value}
                  checked={formData.risk_tolerance === option.value}
                  onChange={(e) => handleInputChange('risk_tolerance', e.target.value)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-sm text-slate-500">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.risk_tolerance && (
            <p className="text-sm text-red-600">{errors.risk_tolerance}</p>
          )}
        </div>

        {/* Investment Timeline */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Investment Timeline *
          </label>
          <select
            value={formData.investment_timeline}
            onChange={(e) => handleInputChange('investment_timeline', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
          {errors.investment_timeline && (
            <p className="text-sm text-red-600">{errors.investment_timeline}</p>
          )}
        </div>

        {/* Financial Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Annual Income Range
            </label>
            <select
              value={formData.annual_income_range}
              onChange={(e) => handleInputChange('annual_income_range', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select income range</option>
              {INCOME_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Net Worth Range
            </label>
            <select
              value={formData.net_worth_range}
              onChange={(e) => handleInputChange('net_worth_range', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select net worth range</option>
              {NET_WORTH_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Investment Amount Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Expected Investment Amount Range
          </label>
          <select
            value={formData.investment_amount_range}
            onChange={(e) => handleInputChange('investment_amount_range', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select investment amount range</option>
            {INVESTMENT_AMOUNT_RANGES.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Investment Goals */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Investment Goals * (Select all that apply)
          </label>
          {errors.investment_goals && (
            <p className="text-sm text-red-600">{errors.investment_goals}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INVESTMENT_GOALS.map((goal) => (
              <label key={goal} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.investment_goals.includes(goal)}
                  onChange={() => handleCheckboxChange('investment_goals', goal)}
                  className="text-emerald-600 focus:ring-emerald-500 rounded"
                />
                <span className="ml-3 text-sm font-medium text-slate-900">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Sectors */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Preferred Investment Sectors * (Select all that apply)
          </label>
          {errors.preferred_sectors && (
            <p className="text-sm text-red-600">{errors.preferred_sectors}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INVESTMENT_SECTORS.map((sector) => (
              <label key={sector} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.preferred_sectors.includes(sector)}
                  onChange={() => handleCheckboxChange('preferred_sectors', sector)}
                  className="text-emerald-600 focus:ring-emerald-500 rounded"
                />
                <span className="ml-3 text-sm font-medium text-slate-900">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Previous Investments */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Previous Investment Experience (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PREVIOUS_INVESTMENTS.map((investment) => (
              <label key={investment} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.previous_investments.includes(investment)}
                  onChange={() => handleCheckboxChange('previous_investments', investment)}
                  className="text-emerald-600 focus:ring-emerald-500 rounded"
                />
                <span className="ml-3 text-sm font-medium text-slate-900">{investment}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Investment Advisor */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Do you currently have an investment advisor?
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="has_investment_advisor"
                value="true"
                checked={formData.has_investment_advisor === true}
                onChange={() => handleInputChange('has_investment_advisor', true)}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-900">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="has_investment_advisor"
                value="false"
                checked={formData.has_investment_advisor === false}
                onChange={() => handleInputChange('has_investment_advisor', false)}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-900">No</span>
            </label>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm">
            <strong>Almost done!</strong> This information helps us provide personalized 
            investment recommendations and ensure regulatory compliance. All data is 
            securely encrypted and never shared with third parties.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="ghost" type="button" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit" loading={loading}>
            Complete Profile
          </Button>
        </div>
      </form>
    </div>
  );
};