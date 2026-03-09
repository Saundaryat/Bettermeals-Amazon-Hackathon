import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api, httpClient } from "@/lib/httpClient";
import LocalStorageManager from "@/lib/localStorageManager";

// Extended user interface that includes backend data
interface ExtendedUser extends User {
  household_id?: string;
  user_id?: string;  // Standardized to use user_id
  is_onboarded?: boolean;
  onboarding_flow?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  idToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, newPassword: string) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  setUser: (user: ExtendedUser | null) => void;
  setIdToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the current user's token
  const refreshToken = async (): Promise<string | null> => {
    // Use auth.currentUser directly to avoid stale closure issues
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.debug('refreshToken: No current Firebase user found.');
      return null;
    }

    try {
      // Get fresh Firebase token
      const token = await currentUser.getIdToken(true); // Force refresh

      // Call backend refresh endpoint to update HttpOnly cookie
      // Note: Only auth endpoints need the Firebase ID token
      const response = await api.post('/auth/refresh', {
        id_token: token
      }, {
        requireAuth: false
      });

      if (response.success) {
        setIdToken(token);
        return 'refreshed'; // Token is now in HttpOnly cookie
      } else {
        console.error('refreshToken: Backend login failed:', response.error);
        throw new Error('Backend token refresh failed');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If token refresh fails, clear user data and sign out
      setIdToken(null);
      setUser(null);
      LocalStorageManager.clearUserData();
      await signOut(auth);
      return null;
    }
  };

  // Function to get current token (refresh if needed)
  const getCurrentToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      const token = await user.getIdToken();
      setIdToken(token);
      // Note: We no longer store tokens in localStorage for security
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      // If getting token fails, clear user data and sign out
      setIdToken(null);
      setUser(null);
      LocalStorageManager.clearUserData();
      await signOut(auth);
      return null;
    }
  };

  useEffect(() => {
    // Register the refresh token callback with the HTTP client
    // This allows the HTTP client to automatically refresh the session on 401 errors
    httpClient.setRefreshCallback(refreshToken);

    // Note: We no longer restore tokens from localStorage for security
    // Tokens are now stored in HttpOnly cookies and managed by the backend

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get fresh token when user signs in
        const token = await getCurrentToken();
        setIdToken(token);

        // Check for stored backend data and extend the user
        const storedUserData = LocalStorageManager.getUserData();
        if (storedUserData) {
          const extendedUser = {
            ...firebaseUser,
            household_id: storedUserData.household_id,
            user_id: storedUserData.user_id,
            is_onboarded: storedUserData.is_onboarded,
            onboarding_flow: storedUserData.onboarding_flow
          } as ExtendedUser;
          setUser(extendedUser);
        } else {
          setUser(firebaseUser as ExtendedUser);
        }
      } else {
        // Clear token and user data when user signs out
        setIdToken(null);
        setUser(null);
        LocalStorageManager.clearUserData();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Step 1: Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    setIdToken(token);

    // Step 2: Call backend API to set HttpOnly cookie
    // Note: Only auth endpoints need the Firebase ID token
    try {
      const backendResponse = await api.post('/auth/login', {
        id_token: token
      }, {
        requireAuth: false
      });

      if (backendResponse.success && backendResponse.data) {
        const backendData = backendResponse.data;

        // Create extended user with backend data
        const extendedUser = {
          ...userCredential.user,
          household_id: backendData.household_id,
          user_id: backendData.user_id,
          is_onboarded: backendData.is_onboarded,
          onboarding_flow: backendData.onboarding_flow
        } as ExtendedUser;

        setUser(extendedUser);

        // Store user data (but NOT the token - it's now in HttpOnly cookie)
        LocalStorageManager.setUserData({
          email: userCredential.user.email || '',
          user_id: backendData.user_id,
          household_id: backendData.household_id,
          is_onboarded: backendData.is_onboarded,
          onboarding_flow: backendData.onboarding_flow,
          phone_number: backendData.phone_number
        });

        return { userCredential, extendedUser };
      } else {
        // If backend login fails, sign out from Firebase
        await signOut(auth);
        throw new Error(backendResponse.error || 'Backend authentication failed');
      }
    } catch (error) {
      // If backend call fails, sign out from Firebase
      await signOut(auth);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear HttpOnly cookie
      await api.post('/auth/logout', {}, {
        requireAuth: false
      });
    } catch (error) {
      console.error('Error calling logout endpoint:', error);
      // Continue with logout even if backend call fails
    }

    // Sign out from Firebase
    await signOut(auth);
    setIdToken(null);
    setUser(null);
    LocalStorageManager.clearUserData();
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const confirmReset = async (code: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      idToken,
      login,
      logout,
      resetPassword,
      confirmReset,
      loading,
      refreshToken,
      setUser,
      setIdToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};