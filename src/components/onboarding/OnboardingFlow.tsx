import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { OnboardingStep1 } from './OnboardingStep1';
import { OnboardingStep2 } from './OnboardingStep2';
import { OnboardingStep3 } from './OnboardingStep3';
import { OnboardingService } from '../../services/onboardingService';
import { useAuth } from '../../contexts/AuthContext';
import { ONBOARDING_STEPS } from '../../types/onboarding';

export const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [progressData, setProgressData] = useState<any>({});

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      const progress = await OnboardingService.getOnboardingProgress(user.id);
      if (progress) {
        setCurrentStep(progress.current_step);
        setProgressData(progress.step_data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
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

  const handleSaveProgress = (data: any) => {
    setProgressData(prev => ({
      ...prev,
      [`step${currentStep}`]: data
    }));
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            onNext={handleNext}
            onSaveProgress={handleSaveProgress}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveProgress={handleSaveProgress}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            onSaveProgress={handleSaveProgress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-slate-300">Help us personalize your investment experience</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={3} 
            steps={ONBOARDING_STEPS.map(step => step.title)} 
          />
          
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};