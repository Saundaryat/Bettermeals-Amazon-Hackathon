export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Household {
  id: string;
  numberOfUsers: number;
  address: string;
  isCookAvailable: boolean;
  paymentDone: boolean;
  userIds: string[];
  householdId: string;
  createdAt: Timestamp;
  kitchenEquipments: string[];
  updatedAt: Timestamp;
  primaryUserId: string;
  cookContact: string;
  whatsappNumber?: string;
  authEmail?: string;
  authPhoneNumber?: string;
}

export interface MealSchedule {
  [day: string]: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
}

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  whatsappNumber: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  goals: string[];
  allergies: string[];
  majorDislikes: string[];
  activityLevel: string;
  workoutFrequency?: string;
  dietaryPreferences?: string[];
  medicalConditions?: string[];
  healthReportUrl?: string;
  healthReportSummary?: any;
  healthReport?: File;
  mealSchedule: MealSchedule;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HouseholdDashboardInfo {
  success: boolean;
  household: Household;
  primaryUser: string;
  users: User[];
} 