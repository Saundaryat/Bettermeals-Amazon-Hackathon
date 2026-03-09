export interface MacroData {
    current: number;
    target: number;
    unit: string;
    delta?: number;
    percent_of_target?: number;
    status?: 'meets_target' | 'above_target' | 'below_target';
    physiological_role?: string;
    interpretation?: string;
}

export interface MicronutrientData {
    nutrient: string;
    daily_total: number;
    target: number;
    unit: string;
    status: 'meets_target' | 'above_target' | 'below_target';
    primary_food_sources: string[];
    mechanism_of_action: string;
    clinical_priority: 'High' | 'Medium' | 'Low';
}

export interface NutritionalIntervention {
    strategy: string;
    implementation: string;
}

export interface BiomarkerIntervention {
    marker: {
        name: string;
        status: string; // e.g. "high", "optimal"
        value?: string; // Optional as it might not be present in new data
        unit?: string;
    };
    nutritional_interventions: NutritionalIntervention[];
    expected_outcome: string;
}

export interface ClinicalMatching {
    biomarker_interventions: BiomarkerIntervention[];
}

export interface TraceabilityItem {
    goal_focus: string[];
    key_features: string[];
    clinical_rationale: string;
}

export interface DailyInsight {
    day: string;
    clinical_rationale: string;
    profile_context: {
        nutrition_profile: string;
        primary_goals: string[];
        dietary_constraints: string[];
    };
    macros: {
        calories?: MacroData;
        energy_kcal?: MacroData;
        protein: MacroData;
        carbs: MacroData;
        fiber: MacroData;
        fats: MacroData;
    };
    key_micronutrients: MicronutrientData[];
    clinical_matching: ClinicalMatching;
    meal_plan_traceability?: Record<string, TraceabilityItem>;
    next_day_adjustments?: any[];
}

// Keyed by day name (e.g., 'monday', 'tuesday')
export type WeeklyInsightsData = Record<string, DailyInsight>;
