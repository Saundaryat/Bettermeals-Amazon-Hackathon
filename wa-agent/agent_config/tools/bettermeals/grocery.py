from typing import Dict, Any, Optional
from agent_config.api_client import api_client
from strands import tool

"""
Tools for managing groceries and inventory via Athena API.
"""

@tool(name="get_grocery_plan", description="Get the grocery plan for a household.")
def get_grocery_plan(household_id: str) -> Dict[str, Any]:
    """
    Get the grocery plan for a household.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/household/grocery-plan/{household_id}")

@tool(name="generate_grocery_plan", description="Generate a weekly grocery plan.")
def generate_grocery_plan(household_id: str, split: bool = True, year_week: Optional[str] = None) -> Dict[str, Any]:
    """
    Generate a weekly grocery plan.
    
    Args:
        household_id: The ID of the household.
        split: Whether to split the plan.
        year_week: Optional year-week string.
    """
    # Construct query string manually since api_client.post might not handle params
    query_parts = []
    if split:
        query_parts.append(f"split={str(split).lower()}")
    if year_week:
        query_parts.append(f"year_week={year_week}")
        
    endpoint = f"/api/v1/household/generate-weekly-grocery-plan/{household_id}"
    if query_parts:
        endpoint += "?" + "&".join(query_parts)
        
    return api_client.post(endpoint)

@tool(name="update_inventory_from_grocery", description="Update inventory based on the current grocery list.")
def update_inventory_from_grocery(household_id: str) -> Dict[str, Any]:
    """
    Update inventory based on the current grocery list.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.post(f"/api/v1/household/update-from-grocery/{household_id}")

@tool(name="save_grocery_plan", description="Save a weekly grocery plan.")
def save_grocery_plan(household_id: str, year_week: str, grocery_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save a weekly grocery plan.
    
    Args:
        household_id: The ID of the household.
        year_week: The year-week string.
        grocery_plan: The grocery plan data.
    """
    data = {
        "household_id": household_id,
        "year_week": year_week,
        "grocery_plan": grocery_plan
    }
    return api_client.post("/api/v1/household/household-weekly-grocery-plan", data=data)

@tool(name="get_inventory", description="Get the current inventory for a household.")
def get_inventory(household_id: str) -> Dict[str, Any]:
    """
    Get the current inventory for a household.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/household/inventory/{household_id}")

@tool(name="update_inventory", description="Update the inventory for a household.")
def update_inventory(household_id: str, inventory_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update the inventory for a household.
    
    Args:
        household_id: The ID of the household.
        inventory_data: The new inventory data.
    """
    return api_client.post(f"/api/v1/household/inventory/{household_id}", data=inventory_data)

@tool(name="get_external_grocery_list", description="Get grocery list from external API via Dashboard controller.")
def get_external_grocery_list(household_id: str) -> Dict[str, Any]:
    """
    Get grocery list from external API via Dashboard controller.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/dashboard/grocery-list/{household_id}")
