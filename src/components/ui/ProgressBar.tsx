import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div
              className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                w-14 h-14 rounded-full flex items-center justify-center text-base font-medium
                ${index + 1 <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
                }
                ${index + 1 === currentStep ? 'ring-4 ring-blue-100' : ''}
                min-h-[44px] min-w-[44px]
              `}
              role="button"
              tabIndex={0}
              aria-label={`Step ${index + 1}: ${step} ${index + 1 === currentStep ? '(current step)' : index + 1 < currentStep ? '(completed)' : ''}`}
            >
              {index + 1}
            </div>
            <span className="text-sm mt-3 font-medium text-center">
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`absolute top-7 left-full w-full h-[2px] ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-slate-200'}`} style={{ width: 'calc(100% - 56px)', left: '56px' }}></div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full h-1.5 bg-blue-600 transition-all duration-500 ease-in-out rounded-full mt-4"></div>
    </div>
  );
};