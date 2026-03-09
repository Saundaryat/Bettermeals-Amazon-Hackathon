import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingBottomNavProps {
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  onContinue: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
  continueText?: string;
}

export default function OnboardingBottomNav({
  currentStep,
  totalSteps,
  canContinue,
  onContinue,
  onPrevious,
  showPrevious = false,
  continueText = 'Continue'
}: OnboardingBottomNavProps) {
  const getProgressWidth = () => {
    const percentage = (currentStep / totalSteps) * 100;
    return `w-[${percentage}%]`;
  };

  const getProgressClass = () => {
    switch (currentStep) {
      case 0: return 'w-0'; // 0%
      case 1: return 'w-1/4'; // 25%
      case 2: return 'w-2/4'; // 50%
      case 3: return 'w-3/4'; // 75%
      case 4: return 'w-full'; // 100%
      default: return 'w-0';
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div className={`bg-[#51754f] rounded-full h-2 ${getProgressClass()}`}></div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {showPrevious && onPrevious && (
              <Button
                onClick={onPrevious}
                className="text-white rounded-lg py-3 px-6 font-medium flex items-center space-x-2"
                style={{ backgroundColor: '#744F75' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#634264'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#744F75'}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            )}
          </div>
          <div>
            <Button
              onClick={onContinue}
              disabled={!canContinue}
              className="text-white rounded-lg py-3 px-6 font-medium flex items-center space-x-2"
              style={{ backgroundColor: '#51754f' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a6b46'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#51754f'}
            >
              <span>{continueText}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
