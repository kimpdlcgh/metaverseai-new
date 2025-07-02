import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { InvestorStep1 } from './InvestorStep1';
import { InvestorStep2 } from './InvestorStep2';
import { InvestorStep3 } from './InvestorStep3';
import { InvestorService } from '../../services/investorService';
import { useAuth } from '../../contexts/AuthContext';

const INVESTOR_STEPS = ['Personal Info', 'Address', 'Investment Profile'];

export const InvestorOnboardingFlow: React.FC = () => {
  const { user, checkOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;

    try {
      const profile = await InvestorService.getInvestorProfile(user.id);
      
      // Determine which step to start on based on existing data
      if (profile.investmentProfile) {
        setCurrentStep(3); // All steps completed, show final step
      } else if (profile.address) {
        setCurrentStep(3); // Address completed, go to investment profile
      } else if (profile.investor) {
        setCurrentStep(2); // Personal info completed, go to address
      } else {
        setCurrentStep(1); // Start from beginning
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
      setCurrentStep(1); // Default to step 1 on error
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Refresh onboarding status in auth context
    await checkOnboardingStatus();
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <InvestorStep1
            onNext={handleNext}
            onSkip={handleSkip}
          />
        );
      case 2:
        return (
          <InvestorStep2
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <InvestorStep3
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Investor Profile Setup</h1>
          <p className="text-slate-300">Complete your investor profile to get personalized investment recommendations</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={3} 
            steps={INVESTOR_STEPS} 
          />
          
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};