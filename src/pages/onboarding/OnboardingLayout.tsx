import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  title: string;
  subtitle: string;
}

const steps = ['Profile', 'Address', 'Goals'];

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  title,
  subtitle
}) => {
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
          <ProgressBar currentStep={currentStep} totalSteps={3} steps={steps} />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-600">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};