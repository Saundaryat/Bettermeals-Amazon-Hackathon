export interface GroceryItem {
    id: string;
    name: string;
    quantity: string;
    checked: boolean;
    optional: boolean;
    perishable: boolean;
    isStaple: boolean;
    subcategory: string;
    category: string;
    prd_id: string;
    order_specs: {
        num_packs: number | null;
        unit: string;
        required_qty: number;
        min_order_specs: {
            unit: string;
            qty: number;
        };
        ordered_qty: number;
        surplus: number;
    };
    details: {
        subcategory: string;
        ing_id: string;
    };
    image_url?: string;
}

export interface GroceryListSection {
    grocery_list: GroceryItem[];
    item_counts?: any;
    period?: string;
}

export interface GroceryLists {
    [key: string]: GroceryListSection;
}

export interface GroceryCategory {
    name: string;
    items: GroceryItem[];
}

export interface GroceriesProps {
    householdId?: string;
}

export type GroceryListType = 'full_week' | 'mon_wed' | 'thu_sat';

export type ActiveView = 'groceries' | 'inventory';

// Split mode type for generate API
export type SplitMode = 'full_week' | 'mid_week' | 'per_day';

// Response types for each split mode
export interface SplitSection {
    label: string;
    days: string[];
    grocery_list: GroceryItem[];
}

export interface DailyLists {
    [day: string]: { grocery_list: GroceryItem[] };
}

export interface GroceryPlanResponse {
    grocery_list?: GroceryItem[];           // full_week
    splits?: SplitSection[];                 // mid_week
    daily_lists?: DailyLists;               // per_day
    grocery_lists?: GroceryLists;           // legacy format
}
