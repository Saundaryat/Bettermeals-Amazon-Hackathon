import React, { useState, useEffect } from 'react';
import { COMMON_CLASSES } from './styles';
import CookDetailsSection from './CookDetailsSection';
import DietPreferenceSection from './DietPreferenceSection';

interface HouseholdDetailsProps {
  onNext: (data: { hasCook: string; cookPhoneNumber?: string; dietPreference?: string }) => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
  hasCook?: string;
  cookPhoneNumber?: string;
  dietPreference?: string;
  onDataChange: (data: { hasCook: string; cookPhoneNumber?: string; dietPreference?: string }) => void;
}

export default function HouseholdDetails({
  onNext,
  onPrevious,
  showPrevious = false,
  hasCook: initialHasCook = 'yes',
  cookPhoneNumber: initialCookPhoneNumber = '',
  dietPreference: initialDietPreference = '',
  onDataChange
}: HouseholdDetailsProps) {
  const [hasCook, setHasCook] = useState<string>(initialHasCook);
  const [cookPhoneNumber, setCookPhoneNumber] = useState<string>(initialCookPhoneNumber);
  const [dietPreference, setDietPreference] = useState<string>(initialDietPreference);

  // Initialize data on mount
  useEffect(() => {
    onDataChange({
      hasCook: initialHasCook,
      cookPhoneNumber: initialHasCook === 'yes' ? initialCookPhoneNumber : undefined,
      dietPreference: initialDietPreference
    });
  }, []); // Only run on mount

  const handleHasCookChange = (value: string) => {
    setHasCook(value);
    if (value === 'no') {
      setCookPhoneNumber('');
    }
    const newData = {
      hasCook: value,
      cookPhoneNumber: value === 'yes' ? cookPhoneNumber : undefined,
      dietPreference
    };
    onDataChange(newData);
  };

  const handlePhoneChange = (value: string) => {
    setCookPhoneNumber(value);
    const newData = {
      hasCook,
      cookPhoneNumber: hasCook === 'yes' ? value : undefined,
      dietPreference
    };
    onDataChange(newData);
  };

  const handleDietChange = (value: string) => {
    setDietPreference(value);
    const newData = {
      hasCook,
      cookPhoneNumber: hasCook === 'yes' ? cookPhoneNumber : undefined,
      dietPreference: value
    };
    onDataChange(newData);
  };

  return (
    <div className={COMMON_CLASSES.onboardingContainer}>
      <div className={COMMON_CLASSES.centeredContent}>

        {/* Heading */}
        <div className={COMMON_CLASSES.headingContainer}>
          <h1 className={COMMON_CLASSES.sectionTitle}>Household Details</h1>
        </div>

        <CookDetailsSection
          hasCook={hasCook}
          cookPhoneNumber={cookPhoneNumber}
          onHasCookChange={handleHasCookChange}
          onPhoneChange={handlePhoneChange}
        />

        <DietPreferenceSection
          selectedDiet={dietPreference}
          onDietChange={handleDietChange}
        />
      </div>
    </div>
  );
}

