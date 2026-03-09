# Lambda Functions Transformation Plan: Cook Assistant → User Agent

## Overview
Transform Lambda functions from cook-focused actions to user-focused actions based on BetterMeals user workflows.

## Current Lambda Functions Analysis

### Keep (User-Focused) ✅
1. **`get_meal.py`** - Users need meal details, recipes, ingredients
   - **Action**: Update SSM path only
   - **Keep as-is**: Functionality is user-relevant

2. **`get_weekly_plan.py`** - Users need to view their meal plans
   - **Action**: Update SSM path only
   - **Keep as-is**: Functionality is user-relevant

3. **`get_inventory.py`** - Users need to check household inventory
   - **Action**: Update SSM path only
   - **Keep as-is**: Functionality is user-relevant

4. **`add_to_grocery_wishlist.py`** - Users add items to wishlist
   - **Action**: Update SSM path + change description (remove "when a cook reports")
   - **Update description**: "Add grocery items to wishlist for a household" (user-focused)

### Transform (Cook-Focused → User-Focused) 🔄
1. **`get_cook.py`** → **`get_cook_schedule.py`**
   - **Original**: Cook profile retrieval
   - **New**: Get cook schedule and leave information (users need to know when cook is unavailable)
   - **Action**: Transform to user-focused function
   - **User need**: "When is my cook taking leave?" / "Is cook available today?"

2. **`get_current_meal.py`** → **`get_todays_meals.py`**
   - **Original**: Cook asking "what should I cook now?"
   - **New**: User asking "what's for breakfast/lunch/dinner today?"
   - **Action**: Transform to user-focused function
   - **User need**: "What's for breakfast?" / "What's cooking today?"

3. **`get_next_meal.py`** → **`get_upcoming_meals.py`**
   - **Original**: Cook asking "what's next?"
   - **New**: User asking "what meals are coming up?"
   - **Action**: Transform to user-focused function
   - **User need**: "What's planned for tomorrow?" / "Show me next week's meals"

4. **`mark_cook_leave.py`** → **`get_cook_leave_schedule.py`**
   - **Original**: Cook marking their own leave
   - **New**: User viewing cook leave schedule
   - **Action**: Transform to read-only user function
   - **User need**: "When is cook on leave?" / "Show cook's schedule"

## Lambda Functions: Complete User Interaction Set

Based on BetterMeals context and comprehensive user/resident kitchen interactions:

### 1. **`get_household_profile.py`**
**Purpose**: Get household/resident profiles, preferences, allergies, constraints
**Input**: `household_id`
**Output**: Household profile JSON with residents, preferences, allergies, constraints
**SSM Path**: `/app/useragent/dynamodb/household_profiles_table_name`

### 2. **`update_household_preferences.py`**
**Purpose**: Update dietary preferences, allergies, or constraints
**Input**: `household_id`, `preferences` (dict), `allergies` (list), `constraints` (dict)
**Output**: Updated profile confirmation
**SSM Path**: `/app/useragent/dynamodb/household_profiles_table_name`

### 3. **`submit_meal_feedback.py`**
**Purpose**: Submit meal ratings, plate photos, feedback
**Input**: `household_id`, `meal_id`, `rating` (1-5), `feedback_text` (optional), `photo_url` (optional)
**Output**: Feedback submission confirmation
**SSM Path**: `/app/useragent/dynamodb/meal_feedback_table_name`

### 4. **`upload_lab_results.py`**
**Purpose**: Upload/parse lab results (images or text)
**Input**: `household_id`, `resident_id`, `lab_data` (text or image URL), `lab_type`
**Output**: Parsed lab results JSON
**SSM Path**: `/app/useragent/dynamodb/lab_results_table_name`
**Note**: May need integration with vision API for image parsing

### 5. **`get_grocery_cart.py`**
**Purpose**: Get current grocery cart status for a household
**Input**: `household_id`, `cart_id` (optional)
**Output**: Cart details with items, quantities, prices, substitutions needed
**SSM Path**: `/app/useragent/dynamodb/grocery_carts_table_name`

### 6. **`get_order_status.py`**
**Purpose**: Track grocery order delivery status
**Input**: `order_id` or `household_id`
**Output**: Order status, ETA, tracking information
**SSM Path**: `/app/useragent/dynamodb/orders_table_name`

### 7. **`place_grocery_order.py`**
**Purpose**: Place grocery order from cart
**Input**: `household_id`, `cart_id`, `delivery_address` (optional), `delivery_date` (optional)
**Output**: Order confirmation with order_id, ETA, total amount
**SSM Path**: `/app/useragent/dynamodb/orders_table_name`
**Note**: Integrates with checkout workflow

### 8. **`modify_meal.py`**
**Purpose**: Modify a meal in the plan (swap, replace, change)
**Input**: `household_id`, `meal_id` or `date` + `meal_type` (breakfast/lunch/dinner), `action` (swap/replace/modify), `new_meal_id` (optional), `modifications` (dict)
**Output**: Updated meal plan confirmation
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "Swap today's lunch with tomorrow's" / "Replace dinner with pasta"

### 9. **`update_meal_quantity.py`**
**Purpose**: Update meal quantity when more/fewer people are eating
**Input**: `household_id`, `meal_id` or `date` + `meal_type`, `servings` (number of people), `resident_ids` (list of who's eating)
**Output**: Updated meal plan with adjusted quantities
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "3 more people coming for dinner" / "Update lunch for 5 people"

### 10. **`skip_meal.py`**
**Purpose**: Skip a meal when user won't be eating
**Input**: `household_id`, `resident_id`, `date`, `meal_type` (breakfast/lunch/dinner/all), `reason` (optional)
**Output**: Confirmation of skipped meal, updated plan
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "I won't be eating dinner today" / "Skip breakfast tomorrow"

### 11. **`get_todays_meals.py`** (Transformed from get_current_meal.py)
**Purpose**: Get today's meals (breakfast, lunch, dinner) for a household
**Input**: `household_id`, `date` (optional, defaults to today), `meal_type` (optional: breakfast/lunch/dinner/all)
**Output**: Meal details for requested meal(s) with timing, ingredients, prep status
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "What's for breakfast?" / "Show me today's meals" / "What's for dinner?"

### 12. **`get_upcoming_meals.py`** (Transformed from get_next_meal.py)
**Purpose**: Get upcoming meals for the next few days
**Input**: `household_id`, `days_ahead` (optional, default 7), `meal_type` (optional)
**Output**: List of upcoming meals with dates and details
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "What's planned for tomorrow?" / "Show me next week's meals"

### 13. **`get_cook_schedule.py`** (Transformed from get_cook.py + mark_cook_leave.py)
**Purpose**: Get cook schedule including leave dates and availability
**Input**: `household_id`, `start_date` (optional), `end_date` (optional)
**Output**: Cook schedule with availability, leave dates, time slots
**SSM Path**: `/app/useragent/dynamodb/cook_schedules_table_name` or reuse `cook_leaves_table_name`
**Use cases**: "When is cook taking leave?" / "Is cook available this week?"

### 14. **`swap_meals.py`**
**Purpose**: Swap meals between different days
**Input**: `household_id`, `meal1_date` + `meal1_type`, `meal2_date` + `meal2_type`
**Output**: Updated meal plan with swapped meals
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "Swap Monday's dinner with Friday's"

### 15. **`request_specific_meal.py`**
**Purpose**: Request a specific meal or recipe to be added to the plan
**Input**: `household_id`, `meal_name` or `recipe_url`, `preferred_date`, `meal_type`, `servings`
**Output**: Confirmation if meal can be added, or alternative suggestions
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "Add pasta for dinner tomorrow" / "I want to try this recipe from Instagram"

### 16. **`get_meal_prep_instructions.py`**
**Purpose**: Get detailed cooking/prep instructions for a meal
**Input**: `meal_id` or `household_id` + `date` + `meal_type`
**Output**: Step-by-step prep instructions, cooking time, serving instructions
**SSM Path**: `/app/useragent/dynamodb/meals_table_name`
**Use cases**: "How do I prepare today's dinner?" / "Show me cooking steps"

### 17. **`check_pantry_status.py`**
**Purpose**: Check if ingredients for upcoming meals are available in pantry
**Input**: `household_id`, `date` (optional), `meal_id` (optional)
**Output**: List of missing ingredients, available ingredients, shopping needed
**SSM Path**: `/app/useragent/dynamodb/inventory_table_name`
**Use cases**: "Do we have everything for dinner?" / "What's missing for this week?"

### 18. **`add_to_shopping_list.py`**
**Purpose**: Add items to shopping list (enhanced version of add_to_grocery_wishlist)
**Input**: `household_id`, `items` (list with name, quantity, priority), `category` (optional)
**Output**: Updated shopping list confirmation
**SSM Path**: `/app/useragent/dynamodb/grocery_wishlist_table_name`
**Use cases**: "Add milk to shopping list" / "I need tomatoes"

### 19. **`get_order_history.py`**
**Purpose**: Get past grocery order history
**Input**: `household_id`, `limit` (optional, default 10), `start_date` (optional), `end_date` (optional)
**Output**: List of past orders with dates, items, amounts
**SSM Path**: `/app/useragent/dynamodb/orders_table_name`
**Use cases**: "Show my past orders" / "What did I order last week?"

### 20. **`cancel_order.py`**
**Purpose**: Cancel or modify a pending grocery order
**Input**: `order_id`, `action` (cancel/modify), `modifications` (optional: remove_items, add_items)
**Output**: Order cancellation/modification confirmation
**SSM Path**: `/app/useragent/dynamodb/orders_table_name`
**Use cases**: "Cancel my order" / "Remove eggs from my order"

### 21. **`set_meal_preferences.py`**
**Purpose**: Set meal preferences for specific days (e.g., no onion/garlic on certain days)
**Input**: `household_id`, `date` or `day_of_week`, `preferences` (dict: no_onion, no_garlic, etc.)
**Output**: Updated preferences confirmation
**SSM Path**: `/app/useragent/dynamodb/household_profiles_table_name`
**Use cases**: "No onion on Mondays" / "Vegetarian on weekends"

### 22. **`get_nutritional_info.py`**
**Purpose**: Get nutritional information for meals
**Input**: `meal_id` or `household_id` + `date` + `meal_type`, `nutrition_type` (calories/protein/carbs/all)
**Output**: Nutritional breakdown (calories, protein, carbs, fats, vitamins, etc.)
**SSM Path**: `/app/useragent/dynamodb/meals_table_name`
**Use cases**: "How many calories in today's lunch?" / "Show me protein content"

### 23. **`get_meal_schedule.py`**
**Purpose**: Get meal schedule/calendar view
**Input**: `household_id`, `start_date`, `end_date`, `view_type` (calendar/list)
**Output**: Meal schedule with dates, meal types, meal names, timing
**SSM Path**: `/app/useragent/dynamodb/weekly_meal_plan_table_name`
**Use cases**: "Show me this week's meal schedule" / "What's the meal calendar?"

### 24. **`report_meal_issue.py`**
**Purpose**: Report issues with a meal (wrong item, quality issue, missing item)
**Input**: `household_id`, `meal_id` or `date` + `meal_type`, `issue_type`, `description`, `severity`
**Output**: Issue report confirmation, follow-up actions
**SSM Path**: `/app/useragent/dynamodb/meal_issues_table_name`
**Use cases**: "Wrong item delivered" / "Meal was too spicy" / "Missing ingredients"

## Files to Update

### `prerequisite/lambda/python/lambda_function.py`
**Changes:**
- Transform imports: `get_current_meal` → `get_todays_meals`, `get_next_meal` → `get_upcoming_meals`, `get_cook` → `get_cook_schedule`, `mark_cook_leave` → `get_cook_leave_schedule`
- Add imports for all new user-focused functions (24 total functions)
- Update routing logic for transformed functions
- Add routing logic for all new functions
- Update resource extraction logic if needed

### `prerequisite/lambda/api_spec.json`
**Changes:**
- Transform tool definitions:
  - `get_cook_profile` → `get_cook_schedule` (user-focused: view cook availability)
  - `get_current_meal` → `get_todays_meals` (user-focused: what's for breakfast/lunch/dinner)
  - `get_next_meal` → `get_upcoming_meals` (user-focused: upcoming meals)
  - `mark_cook_leave` → `get_cook_leave_schedule` (user-focused: view cook leave)
  
- Add tool definitions for all new user-focused functions (24 total):
  - Onboarding: `get_household_profile`, `update_household_preferences`, `upload_lab_results`
  - Meal Planning: `get_todays_meals`, `get_upcoming_meals`, `modify_meal`, `swap_meals`, `update_meal_quantity`, `skip_meal`, `request_specific_meal`, `set_meal_preferences`, `get_meal_schedule`
  - Meal Details: `get_meal_prep_instructions`, `get_nutritional_info`
  - Grocery: `get_grocery_cart`, `place_grocery_order`, `get_order_status`, `get_order_history`, `cancel_order`, `check_pantry_status`, `add_to_shopping_list`
  - Feedback: `submit_meal_feedback`, `report_meal_issue`
  - Cook Management: `get_cook_schedule`, `get_cook_leave_schedule`

- Update descriptions for existing tools:
  - `add_to_grocery_wishlist`: Change from "when a cook reports" to "add items to shopping list"
  - `fetch_inventory`: Update to emphasize user checking pantry status

## Implementation Steps

1. **Update existing Lambda functions** (SSM paths + descriptions)
   - `get_meal.py`
   - `get_weekly_plan.py`
   - `get_inventory.py`
   - `add_to_grocery_wishlist.py`

2. **Transform cook-focused Lambda functions to user-focused**
   - `get_cook.py` → `get_cook_schedule.py` (view cook availability)
   - `get_current_meal.py` → `get_todays_meals.py` (what's for breakfast/lunch/dinner)
   - `get_next_meal.py` → `get_upcoming_meals.py` (upcoming meals)
   - `mark_cook_leave.py` → `get_cook_leave_schedule.py` (view cook leave)

3. **Create new user-focused Lambda functions** (24 functions total)
   - **Onboarding & Profile:**
     - `get_household_profile.py`
     - `update_household_preferences.py`
     - `upload_lab_results.py`
     - `set_meal_preferences.py`
   
   - **Meal Planning & Management:**
     - `modify_meal.py`
     - `swap_meals.py`
     - `update_meal_quantity.py`
     - `skip_meal.py`
     - `request_specific_meal.py`
     - `get_meal_schedule.py`
   
   - **Meal Details & Instructions:**
     - `get_meal_prep_instructions.py`
     - `get_nutritional_info.py`
   
   - **Grocery & Orders:**
     - `get_grocery_cart.py`
     - `place_grocery_order.py`
     - `get_order_status.py`
     - `get_order_history.py`
     - `cancel_order.py`
     - `check_pantry_status.py`
     - `add_to_shopping_list.py` (enhanced from add_to_grocery_wishlist)
   
   - **Feedback & Issues:**
     - `submit_meal_feedback.py`
     - `report_meal_issue.py`
   
   - **Cook Management:**
     - `get_cook_schedule.py` (transformed)
     - `get_cook_leave_schedule.py` (transformed)

4. **Update lambda_function.py**
   - Remove old routes
   - Add new routes

5. **Update api_spec.json**
   - Remove old tool definitions
   - Add new tool definitions

6. **Update DynamoDB table configs** (if new tables needed)
   - `household_profiles.json` (for profiles, preferences)
   - `meal_feedback.json` (for ratings, photos)
   - `lab_results.json` (for lab uploads)
   - `grocery_carts.json` (for cart management)
   - `orders.json` (for order history)
   - `cook_schedules.json` (for cook availability/leave)
   - `meal_issues.json` (for issue reporting)
   - `meal_modifications.json` (optional: track meal changes)

## User Interaction Categories

### 1. **Meal Discovery & Planning**
- "What's for breakfast/lunch/dinner today?"
- "Show me upcoming meals"
- "What's planned for this week?"
- "Show me meal schedule"

### 2. **Meal Modifications**
- "Swap today's lunch with tomorrow's"
- "Replace dinner with pasta"
- "Update lunch for 5 people"
- "Skip breakfast tomorrow"
- "I won't be eating dinner today"
- "Add this recipe from Instagram"

### 3. **Grocery & Shopping**
- "Show my grocery cart"
- "Place grocery order"
- "What's my order status?"
- "Show order history"
- "Cancel my order"
- "Do we have everything for dinner?"
- "Add milk to shopping list"

### 4. **Cook Management**
- "When is cook taking leave?"
- "Is cook available this week?"
- "Show cook's schedule"

### 5. **Meal Details & Instructions**
- "How do I prepare today's dinner?"
- "Show me cooking steps"
- "How many calories in today's lunch?"
- "Show nutritional info"

### 6. **Feedback & Preferences**
- "Rate this meal"
- "Report issue with meal"
- "Update my preferences"
- "No onion on Mondays"
- "Upload lab results"

### 7. **Inventory & Pantry**
- "Check pantry status"
- "What's missing for this week?"
- "Show inventory"

## Notes

- New Lambda functions follow the same pattern as existing ones
- Use DynamoDB for data storage (consistent with existing pattern)
- SSM parameters for table names follow pattern: `/app/useragent/dynamodb/{table_name}_table_name`
- Tool descriptions should be user-focused and clear about when to use them
- Consider error handling and validation for new functions
- Some functions may need integration with external services (vision API for lab parsing, payment gateway for orders)
- Meal modification functions should update weekly meal plan table
- Order functions should integrate with grocery ordering workflow
- Cook schedule functions should read from cook_leaves table (read-only for users)

