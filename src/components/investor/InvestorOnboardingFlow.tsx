import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../ui/ProgressBar';
import { InvestorStep1 } from './InvestorStep1';
import { InvestorStep2 } from './InvestorStep2';
import { InvestorStep3 } from './InvestorStep3';
import { InvestorService } from '../../services/investorService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const INVESTOR_STEPS = ['Personal Info', 'Address', 'Investment Profile'];

export const InvestorOnboardingFlow: React.FC = () => {
  const { user, checkOnboardingStatus } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [skipModalOpen, setSkipModalOpen] = useState(false);

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
    showToast('success', 'Profile setup completed successfully!');
    // Refresh onboarding status in auth context
    await checkOnboardingStatus();
    navigate('/dashboard');
  };

  const handleSkip = () => {
    setSkipModalOpen(true);
  };

  const confirmSkip = () => {
    // Save user preference to skip onboarding
    localStorage.setItem('onboardingSkipped', 'true');
    showToast('info', 'Onboarding skipped. You can complete your profile later in settings.');
    navigate('/dashboard');
    setSkipModalOpen(false);
  };

  const cancelSkip = () => {
    setSkipModalOpen(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg')] bg-cover bg-center opacity-10 pointer-events-none"></div>

      {/* Skip button in top-right */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={handleSkip}
          aria-label="Skip onboarding"
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors shadow-md min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          Skip <span aria-hidden="true" className="ml-1">→</span>
        </button>
      </div>

      <div className="relative max-w-4xl mx-auto pt-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6">
            <img src="/assets/metaverseailogo.svg" alt="MetaverseAI Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 font-lexend">Investor Profile Setup</h1>
          <p className="text-slate-300">Complete your investor profile to get personalized investment recommendations</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl mb-20">
          <div className="p-6 sm:p-8">
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={3} 
              steps={INVESTOR_STEPS} 
            />
          </div>
          
          {/* Scrollable content area */}
          <div className="px-6 sm:px-8 pb-24 overflow-y-auto max-h-[calc(100vh-300px)]">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
      
      {/* Fixed navigation footer - now fixed to viewport */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button
            onClick={currentStep === 1 ? handleSkip : handlePrevious}
            className="px-6 py-3 min-h-[44px] min-w-[100px] text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition-colors shadow-sm"
          >
            {currentStep === 1 ? 'Skip' : 'Previous'}
          </button>
          
          <button
            onClick={currentStep === 3 ? handleComplete : handleNext}
            className="px-6 py-3 min-h-[44px] min-w-[100px] text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:outline-none transition-colors shadow-sm"
          >
            {currentStep === 3 ? 'Complete' : 'Continue'}
          </button>
        </div>
      </div>
      
      {/* Skip confirmation modal */}
      {skipModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold mb-2">Skip Onboarding?</h3>
            <p className="text-gray-600 mb-6">
              If you skip the onboarding process, you can always complete your profile later from your account settings.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelSkip}
                className="px-4 py-2 min-h-[44px] min-w-[44px] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSkip}
                className="px-4 py-2 min-h-[44px] min-w-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Skip Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};