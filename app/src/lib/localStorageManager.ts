/**
 * Centralized localStorage management system
 * Provides consistent data storage and retrieval across the application
 */

export interface UserData {
  email: string;
  user_id: string;  // Standardized to use user_id everywhere
  household_id: string;
  is_onboarded: boolean;
  onboarding_flow?: string;
  phone_number?: string;
}


class LocalStorageManager {
  private static readonly KEYS = {
    USER_DATA: 'userData',
    ID_TOKEN: 'idToken',
    HOUSEHOLD_ID: 'householdId',
  } as const;

  /**
   * User Data Management
   */
  static setUserData(userData: UserData): void {
    try {
      localStorage.setItem(this.KEYS.USER_DATA, JSON.stringify(userData));
      // Also store household_id separately for backward compatibility
      localStorage.setItem(this.KEYS.HOUSEHOLD_ID, userData.household_id);
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  }

  static getUserData(): UserData | null {
    try {
      const userData = localStorage.getItem(this.KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static getHouseholdId(): string | null {
    try {
      // First try to get from userData
      const userData = this.getUserData();
      if (userData?.household_id) {
        return userData.household_id;
      }

      // Fallback to separate householdId key
      const householdId = localStorage.getItem(this.KEYS.HOUSEHOLD_ID);
      return householdId ? householdId.replace(/^"|"$/g, '') : null;
    } catch (error) {
      console.error('Error getting household ID:', error);
      return null;
    }
  }

  static getUserId(): string | null {
    try {
      const userData = this.getUserData();
      return userData?.user_id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  static getIsOnboarded(): boolean | null {
    try {
      const userData = this.getUserData();
      return userData?.is_onboarded ?? null;
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return null;
    }
  }

  /**
   * Token Management
   */
  static setIdToken(token: string): void {
    try {
      localStorage.setItem(this.KEYS.ID_TOKEN, token);
    } catch (error) {
      console.error('Error setting ID token:', error);
    }
  }

  static getIdToken(): string | null {
    try {
      return localStorage.getItem(this.KEYS.ID_TOKEN);
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  /**
   * Clear Methods
   */
  static clearUserData(): void {
    try {
      localStorage.removeItem(this.KEYS.USER_DATA);
      localStorage.removeItem(this.KEYS.ID_TOKEN);
      localStorage.removeItem(this.KEYS.HOUSEHOLD_ID);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  static clearAll(): void {
    try {
      this.clearUserData();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  /**
   * Validation Methods
   */
  static isUserAuthenticated(): boolean {
    const userData = this.getUserData();
    const idToken = this.getIdToken();
    return !!(userData && idToken);
  }

  static hasValidHouseholdId(): boolean {
    const householdId = this.getHouseholdId();
    return !!(householdId && householdId.trim() !== '');
  }

  /**
   * Debug Methods
   */
  static getAllData(): Record<string, any> {
    const data: Record<string, any> = {};
    Object.values(this.KEYS).forEach(key => {
      try {
        const value = localStorage.getItem(key);
        data[key] = value ? JSON.parse(value) : value;
      } catch (error) {
        data[key] = localStorage.getItem(key);
      }
    });
    return data;
  }

  static logAllData(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('LocalStorage Data:', this.getAllData());
    }
  }

  /**
   * Generic Storage Methods
   */
  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }
}

export default LocalStorageManager;
