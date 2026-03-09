import { ActionStatus } from './ActionCard';

export type ActionCategory = 'meal_plan' | 'groceries' | 'pantry';

export interface ActionItem {
    id: string;
    category: ActionCategory;
    title: string;
    description?: string;
    status: ActionStatus;

    // Sorting/Ordering
    orderIndex: number; // 0 for Next Up, 1...N for list
    dueDate: string; // ISO date or "Due: Mon 9:00 AM" formatted string

    // Logic
    isNextUp?: boolean; // Determines if it appears in the "Next Up" prominent card
    blockingReason?: string; // Text for "Why blocked" popover

    // UI Extras
    rightElement?: string; // e.g., "₹2,340 est."
    primaryCtaLabel?: string; // "Review & approve", "Open", "Pay now"
    secondaryCtaLabel?: string; // "Why", "View", "Start"

    // Navigation / Action
    actionType: 'NAVIGATE' | 'FUNCTION';
    targetParams?: {
        tab: 'planner' | 'groceries' | 'pantry';
        viewMode?: string; // specific view within tab
    };
}

export interface PendingActionsResponse {
    summary: {
        pending_count: number;
        total_count: number;
        progress: number;
    };
    actions: ActionItem[];
    completed_actions: ActionItem[];
}
