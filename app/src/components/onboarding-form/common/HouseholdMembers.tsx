import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { COMMON_CLASSES } from './styles';

interface HouseholdMembersProps {
  onNext: (data: { adultCount: number; hasCook: string; cookPhoneNumber?: string }) => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
  adultCount?: number;
  hasCook?: string;
  cookPhoneNumber?: string;
  onDataChange: (data: { adultCount: number; hasCook: string; cookPhoneNumber?: string }) => void;
}

export default function HouseholdMembers({
  onNext,
  onPrevious,
  showPrevious = false,
  adultCount: initialAdultCount = 1,
  hasCook: initialHasCook = 'no',
  cookPhoneNumber: initialCookPhoneNumber = '',
  onDataChange
}: HouseholdMembersProps) {
  const [adultCount, setAdultCount] = useState<number>(initialAdultCount);
  const [hasCook, setHasCook] = useState<string>(initialHasCook);
  const [cookPhoneNumber, setCookPhoneNumber] = useState<string>(initialCookPhoneNumber);

  // Initialize data on mount
  useEffect(() => {
    onDataChange({
      adultCount: initialAdultCount,
      hasCook: initialHasCook,
      cookPhoneNumber: initialHasCook === 'yes' ? initialCookPhoneNumber : undefined
    });
  }, []); // Only run on mount

  const updateData = () => {
    onDataChange({
      adultCount,
      hasCook,
      cookPhoneNumber: hasCook === 'yes' ? cookPhoneNumber : undefined
    });
  };

  const handleIncrement = () => {
    const newCount = Math.min(adultCount + 1, 10); // Max 10 adults
    setAdultCount(newCount);
    // Update data after state change
    setTimeout(() => {
      onDataChange({
        adultCount: newCount,
        hasCook,
        cookPhoneNumber: hasCook === 'yes' ? cookPhoneNumber : undefined
      });
    }, 0);
  };

  const handleDecrement = () => {
    const newCount = Math.max(adultCount - 1, 1); // Min 1 adult
    setAdultCount(newCount);
    // Update data after state change
    setTimeout(() => {
      onDataChange({
        adultCount: newCount,
        hasCook,
        cookPhoneNumber: hasCook === 'yes' ? cookPhoneNumber : undefined
      });
    }, 0);
  };

  return (
    <div className={COMMON_CLASSES.contentContainer}>
      <div className={COMMON_CLASSES.centeredContent}>

        {/* Cook Question */}
        <div className="mt-8 max-w-md">
          <Label className="text-xl font-semibold text-gray-900 mb-4 block text-left">
            Do you have a cook at home? *
          </Label>
          <RadioGroup
            value={hasCook}
            onValueChange={(value) => {
              setHasCook(value);
              updateData();
            }}
            className="mt-4 flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="text-gray-700 text-lg">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="text-gray-700 text-lg">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Cook Phone Number - Conditional */}
        <div className="mt-8 max-w-md">
          {hasCook === 'yes' ? (
            <div>
              <Label htmlFor="cookPhoneNumber" className="text-xl font-semibold text-gray-900 mb-4 block text-left">
                Cook's Phone Number *
              </Label>
              <Input
                id="cookPhoneNumber"
                type="tel"
                placeholder="+91XXXXXXXXXX"
                value={cookPhoneNumber}
                onFocus={e => {
                  if (!e.target.value.startsWith('+91')) {
                    e.target.value = '+91';
                    setCookPhoneNumber('+91');
                  }
                }}
                onChange={(e) => {
                  // Remove all non-digits, ensure only one +91 prefix
                  let digits = e.target.value.replace(/\D/g, '');
                  if (digits.startsWith('91')) digits = digits.slice(2);
                  const formattedNumber = '+91' + digits.slice(0, 10);

                  setCookPhoneNumber(formattedNumber);
                  updateData();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-3 text-left">
                We'll use this to coordinate meal preparation.
              </p>
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-left">
              {hasCook === 'no' ? 'No cook phone number needed' : 'Please select if you have a cook'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
