/**
 * Utility functions for form handling and data comparison
 */

/**
 * Deep comparison for arrays using JSON.stringify
 */
export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

/**
 * Generic function to get only changed fields between two objects
 */
export const getChangedFields = <T extends Record<string, any>>(
  newData: Partial<T>,
  originalData: T,
  fieldConfigs: Array<{ key: keyof T; type: 'string' | 'number' | 'boolean' | 'array' | 'object' }>
): Partial<T> => {
  const changes: Partial<T> = {};

  fieldConfigs.forEach(({ key, type }) => {
    const newValue = newData[key];
    const oldValue = originalData[key];

    if (newValue !== undefined) {
      let hasChanged = false;

      switch (type) {
        case 'array':
          hasChanged = !arraysEqual(newValue as any[], oldValue as any[]);
          break;
        case 'object':
          hasChanged = JSON.stringify(newValue) !== JSON.stringify(oldValue);
          break;
        default:
          hasChanged = newValue !== oldValue;
      }

      if (hasChanged) {
        changes[key] = newValue;
      }
    }
  });

  return changes;
};

/**
 * Specific configuration for user profile fields
 */
export const USER_PROFILE_FIELD_CONFIGS = [
  { key: 'name' as const, type: 'string' as const },
  { key: 'email' as const, type: 'string' as const },
  { key: 'age' as const, type: 'number' as const },
  { key: 'height' as const, type: 'number' as const },
  { key: 'weight' as const, type: 'number' as const },
  { key: 'gender' as const, type: 'string' as const },
  { key: 'activityLevel' as const, type: 'string' as const },
  { key: 'goals' as const, type: 'array' as const },
  { key: 'allergies' as const, type: 'array' as const },
  { key: 'majorDislikes' as const, type: 'array' as const },
  { key: 'whatsappNumber' as const, type: 'string' as const },
  { key: 'workoutFrequency' as const, type: 'string' as const },
  { key: 'dietaryPreferences' as const, type: 'array' as const },
  { key: 'medicalConditions' as const, type: 'array' as const },
  { key: 'mealSchedule' as const, type: 'object' as const },
];

/**
 * Specific configuration for household fields
 */
export const HOUSEHOLD_FIELD_CONFIGS = [
  { key: 'address' as const, type: 'string' as const },
  { key: 'numberOfUsers' as const, type: 'number' as const },
  { key: 'isCookAvailable' as const, type: 'boolean' as const },
  { key: 'whatsappNumber' as const, type: 'string' as const },
  { key: 'kitchenEquipments' as const, type: 'array' as const },
  { key: 'cookContact' as const, type: 'string' as const },
];
