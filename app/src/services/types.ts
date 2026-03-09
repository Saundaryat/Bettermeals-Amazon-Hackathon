import { WeeklyInsightsData } from './insightsTypes';

export interface MealMedia {
    video: string;
    image_url: string;
    image_url_medium: string;
    image_url_thumbnail: string;
}

export interface MealTags {
    macro: string[];
    micronutrient: string[];
    functional: string[];
    diet_lifestyle: string[];
}

export type DishType = 'PRIMARY' | 'ACCOMPANIMENT' | 'SIDE' | 'STANDALONE';

export interface Meal {
    meal_id: string;
    name: string;
    recipe: string;
    notes: string;
    household_score: number;
    media: MealMedia;
    meal_tags: MealTags;
    meal_type?: string[];
    sides?: string[];
    dish_type?: DishType;
    slot_id?: string;
}

export interface AddonTags {
    macro: string[];
    micronutrient: string[];
    functional: string[];
    diet_lifestyle: string[];
}

export interface AddonMedia {
    image_url: string;
    image_url_medium?: string;
    image_url_thumbnail?: string;
}

export interface Addon {
    id: string; // This might be used as the key or internal ID
    addon_id: string;
    name: string;
    notes: string;
    recipe: string;
    addon_score: number;
    household_members: string[];
    addon_tags: AddonTags;
    equipment: string[];
    created_at: string;
    updated_at: string;
    meal_tags?: AddonTags;
    media: AddonMedia;
    // New fields from updated structure
    type?: string;
    reason?: string;
    score?: number;
    nutrient?: {
        kcal: number;
        protein: number;
        carbs_g: number;
        fat_g: number;
        fiber_g: number;
        glycemic_load: number;
    };
}

export interface WeeklyMealPlan {
    meals: Record<string, Record<string, Meal[]>>; // Day -> Slot (lunch/dinner) -> Meals[]
    addons: Record<string, Record<string, Record<string, Addon>>>; // UUID -> Day -> MealTime -> Addon
    daily_insights?: WeeklyInsightsData;
}

export interface WeeklyMealPlanResponse {
    status: string;
    household_id: string;
    year_week: string;
    updated_at: string;
    weekly_meal_plan: WeeklyMealPlan;
}

export interface GroceryItemDetails {
    ing_id: string;
    subcategory: string;
}

export interface MinOrderSpecs {
    qty: number;
    unit: string;
}

export interface OrderSpecs {
    num_packs: number | null;
    min_order_specs: MinOrderSpecs;
    ordered_qty: number;
    surplus: number;
    required_qty: number;
    unit: string;
}

export interface GroceryItem {
    is_staple: boolean;
    optional: boolean;
    details: GroceryItemDetails;
    perishable: boolean;
    prd_id: string;
    name: string;
    order_specs: OrderSpecs;
    category: string;
    checked?: boolean; // UI state
}

export interface GroceryListSection {
    grocery_list: GroceryItem[];
    item_counts?: any;
    period?: string;
}

export interface SplitSection {
    label: string;
    days: string[];
    grocery_list: GroceryItem[];
}

export interface DailyLists {
    [day: string]: { grocery_list: GroceryItem[] };
}

export interface WeeklyGroceryPlan {
    grocery_list?: GroceryItem[];                         // full_week
    grocery_lists?: Record<string, GroceryListSection>;   // legacy format
    splits?: SplitSection[];                              // mid_week
    daily_lists?: DailyLists;                             // per_day
}

export interface GroceryListResponse {
    success: boolean;
    status: string;
    household_id: string;
    year_week: string;
    grocery_plan: {
        date: string;
        hid_year_week: string;
        weekly_grocery_plan: WeeklyGroceryPlan;
    };
    timestamp: string;
}

export interface InventoryListResponse {
    success: boolean;
    status: string;
    household_id: string;
    year_week: string;
    inventory?: {
        inventory: {
            [key: string]: any;
        };
        household_id: string;
        updated_at: string;
    };
    timestamp: string;
}

export interface HouseholdUser {
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
    active: string;
    mealSchedule: Record<string, Record<string, boolean>>;
    createdAt: string;
    updatedAt: string;
    householdId: string;
    medicalConditions: string[];
    activityLevel: string;
    workoutFrequency: string;
    dietaryPreferences: string[];
    healthReportUrl: string;
}

export interface Household {
    id: string;
    householdId: string;
    numberOfUsers: number;
    address: string;
    isCookAvailable: boolean;
    paymentDone: boolean;
    userIds: string[];
    createdAt: string;
    updatedAt: string;
    kitchenEquipments: string[];
    primaryUserId: string;
    cookContact: string | null;
    username: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    authEmail?: string;
    authPhoneNumber?: string;
    dietPreference: string;
    selectedFeatures: string[];
    isOnboarded: boolean;
    type?: 'basic' | 'pro' | 'advanced';
}

export interface HouseholdDashboardInfo {
    success: boolean;
    household: Household | null;
    primaryUser: string | null;
    users: HouseholdUser[];
    error?: string;
}

export interface HouseholdConfig {
    [key: string]: any;
}

export interface OnboardingMealSchedule {
    monday: { breakfast: boolean; lunch: boolean; dinner: boolean };
    tuesday: { breakfast: boolean; lunch: boolean; dinner: boolean };
    wednesday: { breakfast: boolean; lunch: boolean; dinner: boolean };
    thursday: { breakfast: boolean; lunch: boolean; dinner: boolean };
    friday: { breakfast: boolean; lunch: boolean; dinner: boolean };
    saturday: { breakfast: boolean; lunch: boolean; dinner: boolean };
    sunday: { breakfast: boolean; lunch: boolean; dinner: boolean };
}

export interface OnboardingMember {
    id: string;
    name: string;
    age: number | string;
    sex: string;
    height: number | string; // in cm
    weight: number | string; // in kg
    allergies: string[];
    healthGoals: string[];
    healthReport?: File;
    fileName?: string;
    mealSchedule: OnboardingMealSchedule;
    email?: string;
    whatsappNumber?: string;
}
