from typing import Dict, Any, Optional, List
from agent_config.api_client import api_client
from strands import tool

"""
Tools for managing user and household profiles via Athena API.
"""

@tool(name="get_profile_dashboard", description="Get the dashboard summary for a household.")
def get_profile_dashboard(household_id: str) -> Dict[str, Any]:
    """
    Get the dashboard summary for a household.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/household/profile-dashboard/{household_id}")

@tool(name="get_household_info", description="Get detailed information about a household.")
def get_household_info(household_id: str) -> Dict[str, Any]:
    """
    Get detailed information about a household.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/household/info/{household_id}")

@tool(name="update_household", description="Update household information.")
def update_household(household_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update household information.
    
    Args:
        household_id: The ID of the household.
        data: Dictionary containing fields to update (e.g., address, numberOfUsers).
    """
    return api_client.put(f"/api/v1/household/update/{household_id}", data=data)

@tool(name="update_user_profile", description="Update a specific user's profile.")
def update_user_profile(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update a specific user's profile.
    
    Args:
        user_id: The ID of the user.
        data: Dictionary containing profile fields to update.
    """
    return api_client.put(f"/api/v1/household/profile/update-user/{user_id}", data=data)

@tool(name="get_user_profile", description="Get a specific user's profile.")
def get_user_profile(user_id: str) -> Dict[str, Any]:
    """
    Get a specific user's profile.
    
    Args:
        user_id: The ID of the user.
    """
    return api_client.get(f"/api/v1/household/profile/get-user/{user_id}")

@tool(name="get_household_status", description="Get the current status of a household.")
def get_household_status(household_id: str) -> Dict[str, Any]:
    """
    Get the current status of a household.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/household/status/{household_id}")

@tool(name="update_household_status", description="Update the status of a household.")
def update_household_status(household_id: str, status: str) -> Dict[str, Any]:
    """
    Update the status of a household.
    
    Args:
        household_id: The ID of the household.
        status: The new status string.
    """
    return api_client.post(f"/api/v1/household/status/{household_id}", data={"status": status})

@tool(name="get_cycle_data", description="Get cycle syncing data for a household.")
def get_cycle_data(household_id: str) -> Dict[str, Any]:
    """
    Get cycle syncing data for a household (last_period_date, etc.).
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/household/cycle-syncing/{household_id}")
