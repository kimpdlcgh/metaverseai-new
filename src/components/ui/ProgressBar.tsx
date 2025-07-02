import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${index + 1 <= currentStep
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
                }
              `}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-2 text-slate-600 text-center max-w-20">
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};