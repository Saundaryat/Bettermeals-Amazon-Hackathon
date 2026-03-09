from .profile import (
    get_profile_dashboard, get_household_info, update_household,
    update_user_profile, get_user_profile, get_household_status,
    update_household_status, get_cycle_data
)
from .meals import (
    get_weekly_plan, generate_weekly_plan, save_weekly_plan,
    get_meal_details, get_alternative_meals, search_ingredients,
    get_addon_details, replace_meal_slot_by_id, replace_meal_slot_by_name, search_meals
)
from .grocery import (
    get_grocery_plan, generate_grocery_plan, update_inventory_from_grocery,
    save_grocery_plan, get_inventory, update_inventory,
    get_external_grocery_list
)
from .actions import (
    get_pending_actions, log_action, update_workflow_node, dashboard_link
)

# --- Aliases (for backward compatibility or convenience) ---
create_household_profile = update_household
update_household_preferences = update_household
get_onboarding_status = get_household_status
generate_meal_recommendations = generate_weekly_plan
score_meal_plan = save_weekly_plan 
get_meal_plan_details = get_weekly_plan
build_grocery_cart = generate_grocery_plan
handle_substitution = get_alternative_meals
checkout_order = update_inventory_from_grocery
get_order_status = get_pending_actions

ALL_TOOLS = [
    # Profile
    get_profile_dashboard, get_household_info, update_household,
    update_user_profile, get_user_profile, get_household_status,
    update_household_status, get_cycle_data,
    # Meals
    get_weekly_plan, generate_weekly_plan, save_weekly_plan,
    get_meal_details, get_alternative_meals, search_ingredients,
    get_addon_details, replace_meal_slot_by_id, replace_meal_slot_by_name, search_meals,
    # Grocery
    get_grocery_plan, generate_grocery_plan, update_inventory_from_grocery,
    save_grocery_plan, get_inventory, update_inventory,
    get_external_grocery_list,
    # Actions
    get_pending_actions, log_action, update_workflow_node, dashboard_link
]
