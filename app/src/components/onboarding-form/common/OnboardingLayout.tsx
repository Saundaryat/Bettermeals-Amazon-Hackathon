import React from 'react';
import OnboardingNavbar from './OnboardingNavbar';
import OnboardingBottomNav from './OnboardingBottomNav';

interface OnboardingLayoutProps {
  username: string;
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  onContinue: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
  continueText?: string;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  username,
  currentStep,
  totalSteps,
  canContinue,
  onContinue,
  onPrevious,
  showPrevious = false,
  continueText = 'Continue',
  children
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingNavbar username={username} />
      <div className="flex-1">
        {children}
      </div>
      <OnboardingBottomNav
        currentStep={currentStep}
        totalSteps={totalSteps}
        canContinue={canContinue}
        onContinue={onContinue}
        onPrevious={onPrevious}
        showPrevious={showPrevious}
        continueText={continueText}
      />
    </div>
  );
}
