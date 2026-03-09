from typing import Dict, Any, Optional, List
import logging
from agent_config.api_client import api_client
from strands import tool

logger = logging.getLogger(__name__)

"""
Tools for managing meal plans and recommendations via Athena API.
"""

@tool(name="get_weekly_plan", description="Get the weekly meal plan for a household.")
def get_weekly_plan(household_id: str, year_week: Optional[str] = None) -> Dict[str, Any]:
    """
    Get the weekly meal plan for a specific household.
    
    Use this tool to retrieve the Current Week's meal plan structure, including what meals are scheduled for each day/slot.
    This is useful for checking what is already planned before making changes or generating grocery lists.
    
    Args:
        household_id: The ID of the household.
        year_week: Optional year-week string (e.g., '2023-45'). If omitted, defaults to the current week.
    """
    params = {}
    if year_week:
        params['year_week'] = year_week
    return api_client.get(f"/api/v1/household/household-weekly-meal-plan/{household_id}", params=params)

@tool(name="generate_weekly_plan", description="Generate a new weekly meal plan for a household.")
def generate_weekly_plan(household_id: str, year_week: Optional[str] = None) -> Dict[str, Any]:
    """
    Generate a NEW weekly meal plan for a household.
    
    WARNING: usage of this tool completely WIPES OUT the existing plan for the specified week and creates a fresh one.
    Only use this if the user asks to "start over", "create a fresh plan", or "plan my week" from scratch.
    
    Args:
        household_id: The ID of the household.
        year_week: Optional year-week string (e.g., '2023-45').
    """
    params = {}
    if year_week:
        params['year_week'] = year_week
    return api_client.post(f"/api/v1/household/generate-weekly-meal-plan/{household_id}", data=params)

@tool(name="save_weekly_plan", description="Save a complete weekly meal plan. Do NOT use this for updating a single meal.")
def save_weekly_plan(household_id: str, year_week: str, weekly_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save a complete weekly meal plan. 
    
    WARNING: Do NOT use this tool to update or replace a single meal. 
    Use `replace_meal_slot` for changing specific meals.
    This tool overwrites the entire plan and should only be used when generating or saving a fully new plan.
    
    Args:
        household_id: The ID of the household.
        year_week: The year-week string.
        weekly_plan: The meal plan data.
    """
    data = {
        "household_id": household_id,
        "year_week": year_week,
        "weekly_plan": weekly_plan
    }
    return api_client.post("/api/v1/household/household-weekly-meal-plan", data=data)

@tool(name="get_meal_details", description="Get details for a specific meal.")
def get_meal_details(meal_id: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific meal.
    
    Use this tool to find out ingredients, nutrition info, preparation time, or tags for a meal.
    Useful when the user asks "What's in X?" or "Is X healthy?".
    
    Args:
        meal_id: The UUID of the meal.
    """
    return api_client.get(f"/api/v1/dashboard/meal/{meal_id}")

@tool(name="get_alternative_meals", description="Get alternative meal recommendations.")
def get_alternative_meals(meal_id: str) -> Dict[str, Any]:
    """
    Get alternative meal recommendations for a specific meal slot.
    
    Use this tool when the user wants to swap a meal but hasn't specified what to swap it with (e.g. "I don't like this, give me something else").
    This returns a list of "scored" recommendations that fit the user's preferences and ensuring variety.
    
    Args:
        meal_id: The ID of the original meal you want to replace.
    """
    return api_client.get(f"/api/v1/recommendations/alt-meal/{meal_id}")

@tool(name="search_ingredients", description="Search for ingredients.")
def search_ingredients(query: str, limit: Optional[int] = None) -> Dict[str, Any]:
    """
    Search for ingredients by name.
    
    Use this tool to find ingredient IDs or check for availability.
    
    Args:
        query: The search query (e.g., "Spinach").
        limit: Optional max results.
    """
    params = {"query": query}
    if limit:
        params['limit'] = limit
    return api_client.get("/api/v1/ingredients/search", params=params)

@tool(name="get_addon_details", description="Get details for a specific add-on.")
def get_addon_details(addon_id: str) -> Dict[str, Any]:
    """
    Get details for a specific add-on (side dish, condiment, etc).
    
    Args:
        addon_id: The ID of the add-on.
    """
    return api_client.get(f"/api/v1/dashboard/add-ons/{addon_id}")

@tool(name="search_meals", description="Search for meals by name to find their ID.")
def search_meals(query: str, limit: Optional[int] = 5) -> Dict[str, Any]:
    """
    Search for meals by name.
    
    Use this tool to find a `meal_id` when the user gives you a meal name (e.g., "Rajma Chawal").
    ALWAYS use the returned `meal_id` for other tools; NEVER guess the ID.
    
    Args:
        query: The name of the meal to search for.
        limit: Max results (default 5).
    """
    params = {"query": query, "limit": limit}
    return api_client.get("/api/v1/dashboard/meals/search", params=params)

@tool(name="replace_meal_slot_by_id", description="Replace a meal slot using a known UUID.")
def replace_meal_slot_by_id(household_id: str, day: str, slot: str, position_index: int, new_meal_id: str, year_week: Optional[str] = None) -> Dict[str, Any]:
    """
    Replace a single meal in a specific slot with a new meal using its UUID.
    
    Use this tool ONLY when you have a confirm, valid `meal_id` (UUID).
    
    Args:
        household_id: The ID of the household.
        day: The day of the week (e.g., 'Monday').
        slot: The meal slot (e.g., 'Breakfast', 'Lunch').
        position_index: The index of the meal in the slot (usually 0).
        new_meal_id: The ID of the new meal (UUID).
        year_week: Optional year-week string.
    """
    params = {}
    if year_week:
        params['year_week'] = year_week
        
    data = {
        "day": day.upper(),
        "slot": slot.upper(),
        "positionIndex": position_index,
        "newMealId": new_meal_id
    }
    
    return api_client.patch(f"/api/v1/household/household-weekly-meal-plan/{household_id}/replace-meal", data=data, params=params)

@tool(name="replace_meal_slot_by_name", description="Search and replace a meal slot by Name.")
def replace_meal_slot_by_name(household_id: str, day: str, slot: str, position_index: int, meal_name: str, year_week: Optional[str] = None) -> Dict[str, Any]:
    """
    Search for a meal by name and replace the slot with the best match.
    
    Use this tool when the user gives you a name (e.g. "Rajma Chawal") and you don't have the ID.
    The tool will search for the meal and use the top result.
    
    Args:
        household_id: The ID of the household.
        day: The day of the week.
        slot: The meal slot.
        position_index: The index.
        meal_name: The name of the meal to search for.
        year_week: Optional year-week string.
    """
    # 1. Search for the meal
    search_res = search_meals(query=meal_name, limit=1)
    
    # Check for errors in search response (ApiClient returns JSON)
    # The API returns structure: {"status": "success", "data": [...], "count": N}
    if not isinstance(search_res, dict) or "data" not in search_res:
         return {"success": False, "error": f"Search failed for '{meal_name}'. Response: {search_res}"}

    meals = search_res.get("data", [])
    
    if not meals:
        return {"success": False, "error": f"No meal found matching '{meal_name}'."}
        
    # 2. Pick top result
    best_match = meals[0]
    meal_id = best_match.get("meal_id")
    match_name = best_match.get("name")
    
    if not meal_id:
         return {"success": False, "error": "Found meal but it has no ID."}

    logger.info(f"Replacing slot with meal: {match_name} (ID: {meal_id})")

    # 3. Call replace by ID
    result = replace_meal_slot_by_id(
        household_id=household_id, 
        day=day, 
        slot=slot, 
        position_index=position_index, 
        new_meal_id=meal_id, 
        year_week=year_week
    )
    
    # 4. Annotate result
    if isinstance(result, dict):
        result["_agent_note"] = f"Automatically selected '{match_name}' (ID: {meal_id}) for query '{meal_name}'."
        
    return result
