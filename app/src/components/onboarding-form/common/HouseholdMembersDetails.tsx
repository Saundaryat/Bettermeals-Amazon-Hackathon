import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { COMMON_CLASSES } from './styles';
import LocalStorageManager from '@/lib/localStorageManager';
import { OnboardingMember as Member } from '@/services/types';
import MemberCard from './MemberCard';

interface HouseholdMembersDetailsProps {
  onNext: (members: Member[]) => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
  members?: Member[];
  onDataChange: (members: Member[]) => void;
}

const defaultMember: Member = {
  id: '',
  name: '',
  age: 0,
  sex: '',
  height: 0, // Default 0
  weight: 0, // Default 0
  allergies: [],
  healthGoals: [],
  mealSchedule: {
    monday: { breakfast: true, lunch: true, dinner: true },
    tuesday: { breakfast: true, lunch: true, dinner: true },
    wednesday: { breakfast: true, lunch: true, dinner: true },
    thursday: { breakfast: true, lunch: true, dinner: true },
    friday: { breakfast: true, lunch: true, dinner: true },
    saturday: { breakfast: true, lunch: true, dinner: true },
    sunday: { breakfast: true, lunch: true, dinner: true }
  },
  email: '',
  whatsappNumber: ''
};

export default function HouseholdMembersDetails({
  onNext,
  onPrevious,
  showPrevious = false,
  members: initialMembers = [],
  onDataChange
}: HouseholdMembersDetailsProps) {
  const [members, setMembers] = useState<Member[]>(() => {
    if (initialMembers.length > 0) return initialMembers;

    // Auto-populate first member with user data
    const userData = LocalStorageManager.getUserData();
    const populatedMember = { ...defaultMember };

    if (userData) {
      if (userData.email) populatedMember.email = userData.email;
      if (userData.phone_number) populatedMember.whatsappNumber = userData.phone_number;
    }

    return [populatedMember];
  });

  const updateMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    onDataChange(newMembers);
  };

  const addMember = () => {
    const newMember: Member = {
      ...defaultMember,
      id: `member-${Date.now()}`
    };
    const newMembers = [...members, newMember];
    updateMembers(newMembers);
  };

  const removeMember = (memberId: string) => {
    if (members.length > 1) {
      const newMembers = members.filter(member => member.id !== memberId);
      updateMembers(newMembers);
    }
  };

  const updateMember = (memberId: string, updates: Partial<Member>) => {
    const newMembers = members.map(member =>
      member.id === memberId ? { ...member, ...updates } : member
    );
    updateMembers(newMembers);
  };

  const canContinue = () => {
    return members.every(member => {
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
    });
  };

  return (
    <div className={COMMON_CLASSES.onboardingContainer}>
      <div className={COMMON_CLASSES.centeredContent}>
        <div className={COMMON_CLASSES.headingContainer}>
          <h1 className={COMMON_CLASSES.sectionTitle}>
            Household Members
          </h1>
          <p className={COMMON_CLASSES.description}>
            Tell us about each member — their likes, dislikes, allergies, and health goals. This helps us plan meals that suit everyone at home.
          </p>
        </div>

        <div className="space-y-8">
          {members.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              onUpdate={(updates) => updateMember(member.id, updates)}
              onRemove={() => removeMember(member.id)}
              canRemove={members.length > 1}
            />
          ))}
        </div>

        {/* Add Member Button */}
        <div className="mt-6">
          <Button
            onClick={addMember}
            className="w-full text-white rounded-lg py-3 px-6 font-medium flex items-center justify-center space-x-2"
            style={{ backgroundColor: '#51754f' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a6b46'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#51754f'}
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Member</span>
          </Button>
        </div>

        {/* Helpful Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Don't worry about getting everything perfect!</strong> You can fully configure your goals, allergies, and dietary restrictions later in your profile settings.
          </p>
        </div>

        {/* Validation Message */}
        {!canContinue() && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please fill in all required fields (Name, Age, Sex, Height, Weight, Allergies, Health Goals, and Meal Schedule) for each member.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
