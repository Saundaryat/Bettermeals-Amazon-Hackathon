import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import LocalStorageManager from '@/lib/localStorageManager';
import { api } from '@/lib/httpClient';

export interface OnboardingResponse {
  success: boolean;
  message: string;
  householdId: string;
  userIds: string[];
  timestamp: string;
  service: string;
}

export interface UserSignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserSignupResponse {
  success: boolean;
  user: {
    email: string | null;
    user_id: string;  // Standardized to use user_id
  };
  idToken: string;
}

const SAVE_NEW_ONBOARDING_ENDPOINT = '/onboarding/save-new-onboarding-data';

/**
 * Validates password confirmation
 */
const validatePasswordConfirmation = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }
  return { isValid: true };
}

/**
 * Handles user signup with Firebase
 */
export const signupUser = async (signupData: UserSignupData): Promise<UserSignupResponse> => {
  // Validate password confirmation
  const validation = validatePasswordConfirmation(signupData.password, signupData.confirmPassword);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    const auth = getAuth(firebaseApp);
    const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);

    // Get the ID token
    const idToken = await userCredential.user.getIdToken();

    // Store user info and token using centralized manager
    LocalStorageManager.setIdToken(idToken);

    return {
      success: true,
      user: {
        email: userCredential.user.email,
        user_id: userCredential.user.uid  // Use Firebase uid as user_id
      },
      idToken
    };
  } catch (error: any) {
    throw new Error(error.message || 'Signup failed');
  }
}

/**
 * Handles user signup with UI feedback
 */
export const handleUserSignup = async (
  signupData: UserSignupData,
  onSuccess: (response: UserSignupResponse) => void,
  onError?: (error: string) => void
): Promise<void> => {
  try {
    const response = await signupUser(signupData);

    onSuccess(response);

    toast({
      title: 'Account Created!',
      description: 'Your account has been created successfully. Please continue with the onboarding.',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Signup failed';

    if (onError) {
      onError(errorMessage);
    }

    toast({
      title: 'Signup Failed',
      description: errorMessage,
      variant: 'destructive',
    });
  }
}


/**
 * Navigates to the dashboard
 */
export const navigateToDashboard = (delay: number = 1500): void => {
  setTimeout(() => {
    const householdId = LocalStorageManager.getHouseholdId();
    if (householdId) {
      window.location.href = `/app/dashboard/${householdId}`;
    } else {
      console.error('No household ID found, redirecting to post-registration');
      window.location.href = `/app/post-registration`;
    }
  }, delay);
}

/**
 * Gets stored user data from localStorage
 */
export const getStoredUserData = (): { email: string; user_id: string } | null => {
  const userData = LocalStorageManager.getUserData();
  return userData ? { email: userData.email, user_id: userData.user_id } : null;
}


/**
 * Saves new onboarding data to backend with file uploads
 */
export const saveNewOnboardingData = async (
  householdId: string,
  selectedFeatures: string[],
  householdHasCook: string,
  householdCookPhoneNumber?: string,
  householdAddress?: string,
  dietPreference?: string,
  members: any[] = [],
  healthReports: File[] = [],
  cycleData?: {
    lastPeriodDate?: Date;
    cycleLength?: number;
    cycleGoal?: string[];
    calculatedPhase?: string;
  }
): Promise<OnboardingResponse> => {
  // Note: Authentication is handled by cookie-based session in httpClient

  // Prepare the data object
  const data = {
    householdId,
    selectedFeatures,
    householdHasCook,
    householdCookPhoneNumber,
    householdAddress,
    dietPreference,
    cycleData: cycleData ? {
      lastPeriodDate: cycleData.lastPeriodDate,
      cycleLength: cycleData.cycleLength,
      cycleGoal: cycleData.cycleGoal,
      calculatedPhase: cycleData.calculatedPhase
    } : undefined,
    members: members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email || '',
      whatsappNumber: member.whatsappNumber || '',
      age: Number(member.age),
      sex: member.sex,
      height: Number(member.height),
      weight: Number(member.weight),
      allergies: member.allergies || [],
      healthGoals: member.healthGoals || [],
      healthReport: member.fileName || null,
      fileName: member.fileName || `${member.name.toLowerCase().replace(/\s+/g, '_')}_health_report.pdf`,
      mealSchedule: member.mealSchedule || {
        monday: { breakfast: true, lunch: true, dinner: true },
        tuesday: { breakfast: true, lunch: true, dinner: true },
        wednesday: { breakfast: true, lunch: true, dinner: true },
        thursday: { breakfast: true, lunch: true, dinner: true },
        friday: { breakfast: true, lunch: true, dinner: true },
        saturday: { breakfast: true, lunch: true, dinner: true },
        sunday: { breakfast: true, lunch: true, dinner: true }
      }
    }))
  };

  // Create FormData for multipart/form-data request
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));

  // Add health report files
  healthReports.forEach((file, index) => {
    formData.append('healthReport', file);
  });

  try {
    // Use the central api client which handles cookies and authentication
    const response = await api.post(SAVE_NEW_ONBOARDING_ENDPOINT, formData, {
      requireAuth: true
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to save onboarding data');
    }

    return response.data as OnboardingResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred during onboarding data submission');
  }
}

/**
 * Handles new onboarding data submission with UI feedback
 */
export const handleNewOnboardingSubmission = async (
  selectedFeatures: string[],
  householdHasCook: string,
  householdCookPhoneNumber: string | undefined,
  householdAddress: string | undefined,
  dietPreference: string | undefined,
  members: any[],
  healthReports: File[],
  cycleData: {
    lastPeriodDate?: Date;
    cycleLength?: number;
    cycleGoal?: string[];
    calculatedPhase?: string;
  } | undefined,
  onSuccess: (response: OnboardingResponse) => void,
  onError?: (error: string) => void
): Promise<void> => {
  try {
    // Get household ID using centralized manager
    const householdId = LocalStorageManager.getHouseholdId();
    if (!householdId) {
      throw new Error('Household ID not found. Please log in again.');
    }

    // Save to backend
    const response = await saveNewOnboardingData(
      householdId,
      selectedFeatures,
      householdHasCook,
      householdCookPhoneNumber,
      householdAddress,
      dietPreference,
      members,
      healthReports,
      cycleData
    );

    // Update household ID and user IDs using centralized manager if response contains them
    if (response.householdId) {
      // Update userData with household ID if it exists
      const userData = LocalStorageManager.getUserData();
      if (userData) {
        LocalStorageManager.setUserData({
          ...userData,
          household_id: response.householdId
        });
      }
    }

    toast({
      title: 'Success!',
      description: 'Your onboarding data has been saved successfully. Redirecting to dashboard...',
    });

    onSuccess(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';

    if (onError) {
      onError(errorMessage);
    }

    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  }
}

/**
 * Clears all stored onboarding data
 */
export const clearStoredData = (): void => {
  LocalStorageManager.clearUserData();
}
