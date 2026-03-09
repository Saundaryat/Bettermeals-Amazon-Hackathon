from typing import Dict, Any
from agent_config.api_client import api_client
from strands import tool

"""
Tools for managing workflow actions via Athena API.
"""

@tool(name="get_pending_actions", description="Get pending actions for a household.")
def get_pending_actions(household_id: str) -> Dict[str, Any]:
    """
    Get pending actions for a household.
    
    Args:
        household_id: The ID of the household.
    """
    return api_client.get(f"/api/v1/household/{household_id}/pending-actions")

@tool(name="log_action", description="Log a user action.")
def log_action(household_id: str, action_type: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Log a user action.
    
    Args:
        household_id: The ID of the household.
        action_type: The type of action (e.g., 'approve_plan').
        metadata: Optional metadata for the action.
    """
    data = {
        "action_type": action_type,
        "metadata": metadata or {}
    }
    return api_client.post(f"/api/v1/household/action/{household_id}", data=data)

@tool(name="update_workflow_node", description="Update a specific workflow node status.")
def update_workflow_node(household_id: str, field: str, status: str) -> Dict[str, Any]:
    """
    Update a specific workflow node status.
    
    Args:
        household_id: The ID of the household.
        field: The workflow field (e.g., '1_meal_status').
        status: The new status (e.g., 'completed').
    """
    data = {
        "field": field,
        "status": status
    }
    return api_client.post(f"/api/v1/household/{household_id}/workflow", data=data)


@tool(name="dashboard_link", description="Get dashboard link for a household.")
def dashboard_link(household_id: str) -> str:
    """
    Get dashboard link for a household.
    """
    return f"https://bettermeals.in/app/dashboard/{household_id}"
