import { api } from '@/lib/httpClient';
import { toast } from '@/components/ui/use-toast';
import type { RegistrationFormData } from '@/components/registration/types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LocalStorageManager from '@/lib/localStorageManager';

export interface RegistrationResponse {
  success: boolean;
  message: string;
  user_id?: string;
  household_id?: string;
  timestamp: string;
}

const REGISTER_ENDPOINT = '/auth/register';

/**
 * Registers a new user
 */
export const registerUser = async (userData: RegistrationFormData, flowType: string = 'standard'): Promise<RegistrationResponse> => {
  try {
    const response = await api.post(REGISTER_ENDPOINT, {
      email: userData.email,
      phone_number: userData.whatsappNumber,
      location: userData.location,
      place_id: userData.place_id,
      city: userData.city,
      password: userData.password,
      onboarding_flow: flowType,
    });

    if (!response.success) {
      throw new Error(response.error || 'Registration failed');
    }

    return response.data as RegistrationResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred during registration');
  }
}

/**
 * Handles user registration with UI feedback
 */
export const handleRegistration = async (
  userData: RegistrationFormData,
  onSuccess: (response: RegistrationResponse) => void,
  onError?: (error: string) => void,
  flowType: string = 'standard'
): Promise<void> => {
  try {
    // Step 1: Register with backend
    const response = await registerUser(userData, flowType);

    // Step 2: Authenticate with Firebase using the same credentials
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
      const token = await userCredential.user.getIdToken();

      // Step 3: Call backend login to get user data
      const loginResponse = await api.post('/auth/login', {
        id_token: token
      }, {
        requireAuth: false
      });

      if (loginResponse.success && loginResponse.data) {
        const backendData = loginResponse.data;

        // Store user data using centralized manager
        LocalStorageManager.setUserData({
          email: userData.email,
          user_id: backendData.user_id || response.user_id || 'temp-user-id',
          household_id: backendData.household_id || response.household_id || 'temp-household-id',
          is_onboarded: backendData.is_onboarded || false,
          onboarding_flow: flowType,
          phone_number: backendData.phone_number || userData.whatsappNumber
        });

        toast({
          title: 'Account Created!',
          description: 'Your account has been created successfully. Let\'s set up your household!',
        });

        onSuccess(response);
      } else {
        throw new Error('Failed to authenticate with backend after registration');
      }
    } catch (firebaseError) {
      console.error('Firebase authentication error:', firebaseError);
      throw new Error('Registration successful but authentication failed. Please try logging in.');
    }
  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.';

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Provide more specific error messages
      if (message.includes('email') && message.includes('already')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (message.includes('password')) {
        errorMessage = 'Password does not meet requirements. Please use at least 8 characters with uppercase, lowercase, and numbers.';
      } else if (message.includes('whatsapp') || message.includes('phone')) {
        errorMessage = 'Please enter a valid WhatsApp number in the format +91XXXXXXXXXX.';
      } else if (message.includes('network') || message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (message.includes('check your information')) {
        errorMessage = 'Please check all your information and try again.';
      } else {
        errorMessage = error.message;
      }
    }

    if (onError) {
      onError(errorMessage);
    }

    toast({
      title: 'Registration Failed',
      description: errorMessage,
      variant: 'destructive',
    });
  }
}
