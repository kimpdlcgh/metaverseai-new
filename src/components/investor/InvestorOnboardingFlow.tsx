import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../ui/ProgressBar';
import { InvestorStep1 } from './InvestorStep1';
import { InvestorStep2 } from './InvestorStep2';
import { InvestorStep3 } from './InvestorStep3';
import { InvestorService } from '../../services/investorService';
import { useAuth } from '../../contexts/AuthContext';

const INVESTOR_STEPS = ['Details', 'Address', 'Interest Areas'];

export const InvestorOnboardingFlow: React.FC = () => {
  const { user, checkOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [activeForm, setActiveForm] = useState<HTMLFormElement | null>(null);

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

  // Function to validate the current step before proceeding
  const validateCurrentStep = (): boolean => {
    // Get the form element for the current step
    const currentForm = document.getElementById(`step${currentStep}-form`) as HTMLFormElement;
    
    if (!currentForm) {
      console.error(`Form for step ${currentStep} not found`);
      return false;
    }
    
    setActiveForm(currentForm);
    
    // Check HTML5 validation
    const isValid = currentForm.checkValidity();
    
    // If not valid, trigger form validation UI
    if (!isValid) {
      // Create and dispatch submit event to show validation messages
      const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
      currentForm.dispatchEvent(submitEvent);
      
      // Track which form has errors
      setFormErrors(prev => ({...prev, [currentStep]: true}));
      
      return false;
    }
    
    // Clear error state for this step
    setFormErrors(prev => ({...prev, [currentStep]: false}));
    return true;
  };

  const handleStepSubmit = async (data: any, isValid: boolean) => {
    // If validation failed at component level, don't proceed
    if (!isValid) return;
    
    // Also check form-level validation
    if (!validateCurrentStep()) return;
    
    setFormSubmitting(true);
    
    try {
      // Save data based on current step
      if (currentStep === 1) {
        await InvestorService.saveStep1Data(user!.id, data);
      } else if (currentStep === 2) {
        await InvestorService.saveStep2Data(user!.id, data);
      } else if (currentStep === 3) {
        await InvestorService.saveStep3Data(user!.id, data);
        // Don't auto-advance after step 3 - wait for explicit completion
        await checkOnboardingStatus();
        setFormSubmitting(false);
        return;
      }
      
      // Advance to next step
      handleNext();
    } catch (error: any) {
      console.error(`Error saving step ${currentStep} data:`, error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (formSubmitting) return;
    
    // Validate current step before proceeding
    if (!validateCurrentStep()) return;
    
    // Try to submit the current form
    if (activeForm) {
      activeForm.requestSubmit();
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = async () => {
    if (formSubmitting) return;
    
    // Validate final step before completing
    if (!validateCurrentStep()) return;
    
    setFormSubmitting(true);
    // Refresh onboarding status in auth context
    await checkOnboardingStatus();
    setFormSubmitting(false);
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  const handleSkip = () => {
    setShowConfirmModal(true);
  };

  const confirmSkip = () => {
    // Save user preference to skip onboarding
    localStorage.setItem('onboardingSkipped', 'true');
    
    setShowConfirmModal(false);
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <InvestorStep1
            onSubmit={(data, isValid) => handleStepSubmit(data, isValid)}
          />
        );
      case 2:
        return (
          <InvestorStep2
            onSubmit={(data, isValid) => handleStepSubmit(data, isValid)}
          />
        );
      case 3:
        return (
          <InvestorStep3
            onSubmit={(data, isValid) => handleStepSubmit(data, isValid)}
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
    <div className="min-h-screen bg-gray-100 py-8 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg')] bg-cover bg-center opacity-10 pointer-events-none"></div>

      {/* Skip button in top-right */}
      <div className="absolute top-5 right-5 z-50">
        <button 
          onClick={handleSkip}
          type="button"
          aria-label="Skip onboarding"
          className="bg-white text-gray-500 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          Skip <span aria-hidden="true" className="ml-1">→</span>
        </button>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-8">
            <div className="mr-4">
              <h1 className="text-3xl font-bold text-gray-800 font-lexend">Getting started is easy & quick!</h1>
              <p className="text-gray-600 mt-2">Provide your information to quick start appointment bookings.</p>
            </div>
            <div className="flex-shrink-0">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <img src="/assets/metaverseailogo.svg" alt="Investment Logo" className="w-16 h-16 object-contain" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm mb-20">
          <div className="p-6">
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={3} 
              steps={INVESTOR_STEPS} 
            />
            
            {/* Form content area with proper scrolling */}
            <div className="py-6 overflow-y-auto max-h-[calc(100vh-280px)]" style={{ scrollbarWidth: 'thin' }}>
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed navigation footer with styled buttons matching screenshot */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <div className="max-w-3xl mx-auto flex justify-between md:justify-end space-x-3">
          <button
            type="button"
            disabled={formSubmitting}
            onClick={currentStep === 1 ? handleSkip : handlePrevious}
            className="px-6 py-3 min-h-[44px] min-w-[100px] text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 1 ? 'Skip' : 'Previous'}
          </button>
          
          <button
            type="button"
            disabled={formSubmitting}
            onClick={currentStep === 3 ? handleComplete : handleNext}
            className="flex items-center justify-center px-6 py-3 min-h-[44px] min-w-[100px] text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
            )}
            {currentStep === 3 ? 'Complete' : 'Continue'}
          </button>
        </div>
      </div>
      
      {/* Skip confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold mb-2">Skip Onboarding?</h3>
            <p className="text-gray-600 mb-6">
              If you skip the onboarding process, you'll have limited features until you complete your profile from settings.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                type="button"
                className="px-4 py-2 min-h-[44px] min-w-[44px] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
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