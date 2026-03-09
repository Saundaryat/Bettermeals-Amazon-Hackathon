import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateWeeklyMealPlan, generateWeeklyGroceryPlan } from '@/services/database';
import OnboardingLayout from '../common/OnboardingLayout';
import OnboardingWelcome from '../common/OnboardingWelcome';
import CycleSyncingAboutYou from './CycleSyncingAboutYou';
import HouseholdDetails from '../common/HouseholdDetails';
import HouseholdMembersDetails from '../common/HouseholdMembersDetails';
import CycleScienceInfo from '../info/CycleScienceInfo';
import HouseholdIntro from '../info/HouseholdIntro'; // [NEW]
import { handleNewOnboardingSubmission } from '@/services/onboardingService';
import LocalStorageManager from '@/lib/localStorageManager';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { OnboardingMember as Member, OnboardingMealSchedule as MealSchedule } from '@/services/types';



interface OnboardingData {
  // Cycle Syncing Data (Step 1)
  lastPeriodDate?: Date;
  cycleLength?: number;
  cycleGoal?: string[];
  calculatedPhase?: string;

  selectedFeatures: string[];
  householdHasCook?: string;
  householdCookPhoneNumber?: string;
  dietPreference?: string;
  members?: Member[];
  homeAddress?: string;
  hasCook?: string;
  cookPhoneNumber?: string;
  kitchenEquipment?: string[];
}

export default function MultiStepOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedFeatures: []
  });
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 5; // Steps 1(Science), 2(AboutYou), 3(Intro), 4(Household), 5(Members)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    // Get username using centralized manager
    const userData = LocalStorageManager.getUserData();
    if (userData) {
      setUsername(userData.email?.split('@')[0] || 'user');
    }

    // Check if household ID exists
    const householdId = LocalStorageManager.getHouseholdId();
    if (!householdId) {
      setError('Household ID not found. Please log in again.');
    }
  }, []);

  const handleCycleScienceInfoNext = () => {
    setCurrentStep(2);
  };

  const handleCycleData = (data: { lastPeriodDate?: Date; cycleLength: number; cycleGoal: string[]; calculatedPhase: string }) => {
    setOnboardingData(prev => ({
      ...prev,
      lastPeriodDate: data.lastPeriodDate,
      cycleLength: data.cycleLength,
      cycleGoal: data.cycleGoal,
      calculatedPhase: data.calculatedPhase
    }));
    setCurrentStep(3);
  };

  const handleHouseholdDetails = (data: { hasCook: string; cookPhoneNumber?: string; dietPreference?: string }) => {
    setOnboardingData(prev => ({
      ...prev,
      householdHasCook: data.hasCook,
      householdCookPhoneNumber: data.cookPhoneNumber,
      dietPreference: data.dietPreference
    }));
    setCurrentStep(5);
  };

  const handleHouseholdMembersDetails = (members: Member[]) => {
    setOnboardingData(prev => ({
      ...prev,
      members
    }));

    setIsSubmitting(true);

    // Collect health report files
    const healthReports: File[] = [];
    members.forEach(member => {
      if (member.healthReport) {
        healthReports.push(member.healthReport);
      }
    });

    // Call the API to save onboarding data
    handleNewOnboardingSubmission(
      onboardingData.selectedFeatures,
      onboardingData.householdHasCook || 'no',
      onboardingData.householdCookPhoneNumber,
      undefined, // householdAddress removed
      onboardingData.dietPreference,
      members,
      healthReports,
      {
        lastPeriodDate: onboardingData.lastPeriodDate,
        cycleLength: onboardingData.cycleLength,
        cycleGoal: onboardingData.cycleGoal,
        calculatedPhase: onboardingData.calculatedPhase
      },
      async (response) => {
        const householdId = LocalStorageManager.getHouseholdId();
        if (householdId) {
          try {
            // Generate meal plan first
            // Generate meal plan first
            await generateWeeklyMealPlan(householdId, false);

            // Then generate grocery list
            await generateWeeklyGroceryPlan(householdId, false);

            navigate(`/dashboard/${householdId}?tab=planner`);
          } catch (error) {
            console.error('Error generating initial plans:', error);
            // Navigate anyway so user isn't stuck
            navigate(`/dashboard/${householdId}?tab=planner`);
          }
        } else {
          navigate('/post-registration');
        }
      },
      (error) => {
        setIsSubmitting(false);
        console.error('Failed to save onboarding data:', error);
        const householdId = LocalStorageManager.getHouseholdId();
        if (householdId) {
          navigate(`/dashboard/${householdId}?tab=planner`);
        } else {
          navigate('/post-registration');
        }
      }
    );
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return true; // CycleScienceInfo
      case 2:
        return !!(onboardingData.lastPeriodDate && onboardingData.cycleLength && onboardingData.cycleGoal && onboardingData.cycleGoal.length > 0);
      case 3: return true; // HouseholdIntro
      case 4: {
        const hasCookValid = !!onboardingData.householdHasCook;
        const cookPhoneValid = onboardingData.householdHasCook === 'no' ||
          (onboardingData.householdHasCook === 'yes' &&
            onboardingData.householdCookPhoneNumber &&
            onboardingData.householdCookPhoneNumber.trim() !== '');
        return !!(hasCookValid && cookPhoneValid);
      }
      case 5: return !!(onboardingData.members && onboardingData.members.length > 0 &&
        onboardingData.members.every(member => {
          const hasAtLeastOneMeal = Object.values(member.mealSchedule).some(day =>
            day.breakfast || day.lunch || day.dinner
          );

          return member.name.trim() !== '' &&
            Number(member.age) > 0 &&
            member.sex !== '' &&
            Number(member.height) > 0 &&
            Number(member.weight) > 0 &&
            member.allergies.length > 0 &&
            member.healthGoals.length > 0 &&
            hasAtLeastOneMeal;
        }));
      default: return false;
    }
  };

  const handleContinue = () => {
    if (currentStep < 5) {
      switch (currentStep) {
        case 0:
          setCurrentStep(1);
          break;
        case 1:
          handleCycleScienceInfoNext(); // Move from Science to AboutYou
          break;
        case 2:
          if (onboardingData.cycleLength && onboardingData.cycleGoal && onboardingData.cycleGoal.length > 0) {
            handleCycleData({
              lastPeriodDate: onboardingData.lastPeriodDate,
              cycleLength: onboardingData.cycleLength,
              cycleGoal: onboardingData.cycleGoal,
              calculatedPhase: onboardingData.calculatedPhase || ''
            });
          }
          break;
        case 3:
          setCurrentStep(4); // Move from Intro to HouseholdDetails
          break;
        case 4:
          if (onboardingData.householdHasCook) {
            handleHouseholdDetails({
              hasCook: onboardingData.householdHasCook,
              cookPhoneNumber: onboardingData.householdCookPhoneNumber,
              dietPreference: onboardingData.dietPreference
            });
          }
          break;
        default:
          setCurrentStep(prev => prev + 1);
      }
    } else {
      if (onboardingData.members) {
        handleHouseholdMembersDetails(onboardingData.members);
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <OnboardingWelcome onNext={() => setCurrentStep(1)} />;
      case 1:
        return <CycleScienceInfo />;
      case 2:
        return (
          <CycleSyncingAboutYou
            onNext={handleCycleData}
            onPrevious={handlePrevious}
            showPrevious={currentStep > 0}
            data={{
              lastPeriodDate: onboardingData.lastPeriodDate,
              cycleLength: onboardingData.cycleLength,
              cycleGoal: onboardingData.cycleGoal,
              calculatedPhase: onboardingData.calculatedPhase
            }}
            onDataChange={(data) => setOnboardingData(prev => ({ ...prev, ...data }))}
          />
        );
      case 3:
        return <HouseholdIntro />;
      case 4:
        return (
          <HouseholdDetails
            onNext={handleHouseholdDetails}
            onPrevious={handlePrevious}
            showPrevious={currentStep > 0}
            hasCook={onboardingData.householdHasCook}
            cookPhoneNumber={onboardingData.householdCookPhoneNumber}
            dietPreference={onboardingData.dietPreference}
            onDataChange={(data) => setOnboardingData(prev => ({
              ...prev,
              householdHasCook: data.hasCook,
              householdCookPhoneNumber: data.cookPhoneNumber,
              dietPreference: data.dietPreference
            }))}
          />
        );
      case 5:
        return (
          <HouseholdMembersDetails
            onNext={handleHouseholdMembersDetails}
            onPrevious={handlePrevious}
            showPrevious={currentStep > 0}
            members={onboardingData.members}
            onDataChange={(members) => setOnboardingData(prev => ({ ...prev, members }))}
          />
        );
      default:
        return <OnboardingWelcome onNext={() => setCurrentStep(1)} />;
    }
  };

  // Show error if household ID is missing
  if (error) {
    return (
      <OnboardingLayout
        username={username}
        currentStep={currentStep}
        totalSteps={totalSteps}
        canContinue={false}
        onContinue={() => { }}
        showPrevious={false}
        continueText="Continue"
      >
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#51754f] animate-spin mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Setting up your profile</h2>
          <p className="text-gray-600">Sit tight, we are setting up everything for you...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout
      username={username}
      currentStep={currentStep}
      totalSteps={totalSteps}
      canContinue={canContinue()}
      onContinue={handleContinue}
      onPrevious={currentStep > 0 ? handlePrevious : undefined}
      showPrevious={currentStep > 0}
      continueText={currentStep === 0 ? 'Get Started' : currentStep === 5 ? 'Finish' : (currentStep === 1 || currentStep === 3) ? 'Got it' : 'Continue'}
    >
      {renderCurrentStep()}
    </OnboardingLayout>
  );
}
