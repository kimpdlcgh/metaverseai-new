import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { OnboardingService } from '../../services/onboardingService';

export const Step3Goals: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    riskTolerance: 'moderate',
    investmentTimeline: '5-10 years',
    targetInvestmentAmount: '',
    preferredCategories: [] as string[],
    financialObjectives: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const investmentCategories = [
    'Stocks', 'Bonds', 'ETFs', 'Mutual Funds', 'Real Estate', 'Commodities', 'Cryptocurrency', 'International Markets'
  ];

  const objectives = [
    'Retirement Planning', 'Wealth Building', 'Income Generation', 'Capital Preservation', 'Education Funding', 'Emergency Fund', 'Major Purchase', 'Tax Optimization'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetInvestmentAmount) {
      newErrors.targetInvestmentAmount = 'Target investment amount is required';
    } else if (parseFloat(formData.targetInvestmentAmount) < 100) {
      newErrors.targetInvestmentAmount = 'Minimum investment amount is $100';
    }

    if (formData.preferredCategories.length === 0) {
      newErrors.preferredCategories = 'Please select at least one investment category';
    }

    if (formData.financialObjectives.length === 0) {
      newErrors.financialObjectives = 'Please select at least one financial objective';
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
      await OnboardingService.saveStep3Data(user.id, {
        bio: JSON.stringify({
          risk_tolerance: formData.riskTolerance,
          investment_timeline: formData.investmentTimeline,
          target_investment_amount: formData.targetInvestmentAmount,
          preferred_categories: formData.preferredCategories,
          financial_objectives: formData.financialObjectives
        })
      });
      
      // Save progress and mark onboarding as complete
      await OnboardingService.updateOnboardingProgress(user.id, 3, formData);
      
      setSaveStatus('saved');
      showToast('success', 'Investment goals saved. Onboarding complete!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({ general: 'An unexpected error occurred' });
      setSaveStatus('error');
      showToast('error', 'Failed to save investment goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field: 'preferredCategories' | 'financialObjectives', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
    
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
      await OnboardingService.updateOnboardingProgress(user.id, 3, data);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error auto-saving progress:', error);
      setSaveStatus('error');
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      title="Investment Goals & Preferences"
      subtitle="Help us create a personalized investment strategy for you"
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Risk Tolerance
          </label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'conservative', label: 'Conservative', desc: 'Lower risk, steady returns' },
              { value: 'moderate', label: 'Moderate', desc: 'Balanced risk and return' },
              { value: 'aggressive', label: 'Aggressive', desc: 'Higher risk, higher potential returns' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="riskTolerance"
                  value={option.value}
                  checked={formData.riskTolerance === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, riskTolerance: e.target.value }))}
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

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Investment Timeline
          </label>
          <select
            value={formData.investmentTimeline}
            onChange={(e) => setFormData(prev => ({ ...prev, investmentTimeline: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>

        <Input
          type="number"
          label="Target Investment Amount (USD)"
          icon={DollarSign}
          value={formData.targetInvestmentAmount}
          onChange={(e) => setFormData(prev => ({ ...prev, targetInvestmentAmount: e.target.value }))}
          error={errors.targetInvestmentAmount}
          placeholder="10000"
          min="100"
          step="100"
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Preferred Investment Categories
          </label>
          {errors.preferredCategories && (
            <p className="text-sm text-red-600">{errors.preferredCategories}</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {investmentCategories.map((category) => (
              <label key={category} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.preferredCategories.includes(category)}
                  onChange={() => handleCheckboxChange('preferredCategories', category)}
                  className="text-emerald-600 focus:ring-emerald-500 rounded"
                />
                <span className="ml-3 text-sm font-medium text-slate-900">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Financial Objectives
          </label>
          {errors.financialObjectives && (
            <p className="text-sm text-red-600">{errors.financialObjectives}</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {objectives.map((objective) => (
              <label key={objective} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.financialObjectives.includes(objective)}
                  onChange={() => handleCheckboxChange('financialObjectives', objective)}
                  className="text-emerald-600 focus:ring-emerald-500 rounded"
                />
                <span className="ml-3 text-sm font-medium text-slate-900">{objective}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="ghost" onClick={() => navigate('/user-onboarding/step2')}>
            Back
          </Button>
          <Button type="submit" loading={loading}>
            Complete Setup
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};