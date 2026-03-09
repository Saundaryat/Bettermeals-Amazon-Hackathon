import boto3
import json
import yaml
import os
from typing import Dict, Any
from agent_config.database.database import get_db
import hashlib
from datetime import datetime, timedelta, timezone
import logging
import asyncio
from typing import AsyncGenerator
import requests
from firebase_admin import auth

logger = logging.getLogger(__name__)


def _get_region() -> str:
    """Get AWS region from multiple sources with fallback."""
    # Check environment variables first (most reliable)
    region = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION")
    if region:
        return region
    
    # Check boto3 session (reads from ~/.aws/config)
    session = boto3.session.Session()
    if session.region_name:
        return session.region_name
    
    # Default fallback
    return "us-east-1"


# Set region once at module level - all boto3 clients will use this automatically
if "AWS_DEFAULT_REGION" not in os.environ:
    os.environ["AWS_DEFAULT_REGION"] = _get_region()


def get_ssm_parameter(name: str, with_decryption: bool = True) -> str:
    ssm = boto3.client("ssm")

    response = ssm.get_parameter(Name=name, WithDecryption=with_decryption)

    return response["Parameter"]["Value"]


def put_ssm_parameter(
    name: str, value: str, parameter_type: str = "String", with_encryption: bool = False
) -> None:
    ssm = boto3.client("ssm")

    put_params = {
        "Name": name,
        "Value": value,
        "Type": parameter_type,
        "Overwrite": True,
    }

    if with_encryption:
        put_params["Type"] = "SecureString"

    ssm.put_parameter(**put_params)


def delete_ssm_parameter(name: str) -> None:
    ssm = boto3.client("ssm")
    try:
        ssm.delete_parameter(Name=name)
    except ssm.exceptions.ParameterNotFound:
        pass


def load_api_spec(file_path: str) -> list:
    with open(file_path, "r") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("Expected a list in the JSON file")
    return data


def get_aws_region() -> str:
    """Get AWS region."""
    return os.environ.get("AWS_DEFAULT_REGION") or os.environ.get("AWS_REGION") or "us-east-1"


def get_aws_account_id() -> str:
    sts = boto3.client("sts")
    return sts.get_caller_identity()["Account"]


def get_cognito_client_secret() -> str:
    client = boto3.client("cognito-idp")
    response = client.describe_user_pool_client(
        UserPoolId=get_ssm_parameter("/app/useragent/agentcore/userpool_id"),
        ClientId=get_ssm_parameter("/app/useragent/agentcore/machine_client_id"),
    )
    return response["UserPoolClient"]["ClientSecret"]


def read_config(file_path: str) -> Dict[str, Any]:
    """
    Read configuration from a file path. Supports JSON, YAML, and YML formats.

    Args:
        file_path (str): Path to the configuration file

    Returns:
        Dict[str, Any]: Configuration data as a dictionary

    Raises:
        FileNotFoundError: If the file doesn't exist
        ValueError: If the file format is not supported or invalid
        yaml.YAMLError: If YAML parsing fails
        json.JSONDecodeError: If JSON parsing fails
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Configuration file not found: {file_path}")

    # Get file extension to determine format
    _, ext = os.path.splitext(file_path.lower())

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            if ext == ".json":
                return json.load(file)
            elif ext in [".yaml", ".yml"]:
                return yaml.safe_load(file)
            else:
                # Try to auto-detect format by attempting JSON first, then YAML
                content = file.read()
                file.seek(0)

                # Try JSON first
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    # Try YAML
                    try:
                        return yaml.safe_load(content)
                    except yaml.YAMLError:
                        raise ValueError(
                            f"Unsupported configuration file format: {ext}. "
                            f"Supported formats: .json, .yaml, .yml"
                        )

    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in configuration file {file_path}: {e}")
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML in configuration file {file_path}: {e}")

def build_and_set_tool_context(phone_number: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build context dictionary and update UserAgentContext.
    """
    from agent_config.context import UserAgentContext
    context = {}
    context["phone_number"] = phone_number
    
    # Update Context Manager
    UserAgentContext.set_phone_number_ctx(phone_number)
    
    try:
        db = get_db()
        # Extract user_id from database
        user_data = db.find_user_by_phone(phone_number)
        if user_data:
            user_id = user_data.get("id")
            if user_id:
                context["user_id"] = user_id
                # Update Context Manager
                UserAgentContext.update_workflow_data_ctx("user_id", user_id)
                
            # Add Name and Email to Context if available
            if user_data.get("name"):
                context["name"] = user_data["name"]
                UserAgentContext.update_workflow_data_ctx("name", user_data["name"])
            
            if user_data.get("email"):
                context["email"] = user_data["email"]
                UserAgentContext.update_workflow_data_ctx("email", user_data["email"])
            
            # Extract household_id from user data if available
            household_id = user_data.get("household_id")
            if household_id:
                context["household_id"] = household_id
                UserAgentContext.update_workflow_data_ctx("household_id", household_id)
                logger.info(f"Injecting household_id context: {household_id}")

    except Exception as e:
        logger.error(f"Error fetching user context: {e}")
    
    # Extract household_id from payload (takes precedence)
    if payload.get("household_id"):
        hid = payload.get("household_id")
        context["household_id"] = hid
        UserAgentContext.update_workflow_data_ctx("household_id", hid)
    
    # Extract meal_id from payload if present
    if payload.get("meal_id"):
        mid = payload.get("meal_id")
        context["meal_id"] = mid
        UserAgentContext.update_workflow_data_ctx("meal_id", mid)
    
    # Calculate year_week in format "YYYY-Www" (e.g., "2024-W01")
    ist = timezone(timedelta(hours=5, minutes=30))
    now = datetime.now(ist)
    
    # Add current time in IST
    context["current_time"] = now.strftime("%A %Y-%m-%d %H:%M:%S IST")
    UserAgentContext.update_workflow_data_ctx("current_time", context["current_time"])
    logger.info(f"Injecting current_time context: {context['current_time']}")

    # Calculate upcoming meal
    hour = now.hour
    if hour < 11:
        upcoming_meal = "Breakfast"
    elif hour < 16:
        upcoming_meal = "Lunch"
    else:
        upcoming_meal = "Dinner"
    
    context["upcoming_meal"] = upcoming_meal
    UserAgentContext.update_workflow_data_ctx("upcoming_meal", upcoming_meal)
    logger.info(f"Injecting upcoming_meal context: {upcoming_meal}")
    
    # Use ISO Calendar to avoid "Week 00" issues
    iso_year, iso_week, _ = now.isocalendar()
    context["year_week"] = f"{iso_year}-{iso_week:02d}"
    UserAgentContext.update_workflow_data_ctx("year_week", context["year_week"])
    
    return context


def normalize_phone_number_to_e164(phone_number: str) -> str:
    """
    Ensure the phone number is in E.164 format (specifically prepending + if missing).
    """
    if phone_number and not phone_number.startswith("+") and phone_number.isdigit():
        return f"+{phone_number}"
    return phone_number


def generate_id_token_from_uid(uid: str, web_api_key: str, phone_number: str = None) -> str:
    """
    Generate ID token bypassing phone lookup, using knowledge of UID from DB.
    Also ensures the user exists in Auth and has the correct phone number.
    """
    try:
        # 1. Ensure User Exists/Update Phone
        if phone_number:
            try:
                user = auth.get_user(uid)
                if user.phone_number != phone_number:
                    logger.info(f"Updating phone number for {uid} to {phone_number}")
                    auth.update_user(uid, phone_number=phone_number)
            except auth.UserNotFoundError:
                logger.info(f"Creating new user {uid} with phone {phone_number}")
                auth.create_user(uid=uid, phone_number=phone_number)
            except Exception as ue:
                logger.warning(f"Failed to update/create user {uid} in Auth: {ue}")

        # Mint Custom Token
        custom_token = auth.create_custom_token(uid)
        if isinstance(custom_token, bytes):
            custom_token = custom_token.decode('utf-8')

        # Exchange for ID Token
        exchange_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={web_api_key}"
        resp = requests.post(exchange_url, json={
            "token": custom_token,
            "returnSecureToken": True
        })
        resp.raise_for_status()
        return resp.json()['idToken']
    except Exception as e:
        logger.error(f"Failed to generate ID token for UID {uid}: {e}")
        raise e


def get_or_create_daily_session_id(phone_number: str) -> str:
    """
    Generate session ID for AgentCore memory (daily grouping).
    
    Bedrock Runtime API requires runtimeSessionId to be at least 33 characters.
    This method ensures the session ID meets that requirement while maintaining
    determinism (same phone_number + date = same session_id).
    """
    date_str = datetime.now().strftime("%Y%m%d")
    base_id = f"{phone_number}_{date_str}"
    
    # If already long enough, return as-is
    if len(base_id) >= 33:
        return base_id
    
    # Calculate padding needed: 33 - len(base_id) - 1 (for underscore)
    padding_needed = max(0, 33 - len(base_id) - 1)
    
    # Generate deterministic hash suffix (always use at least 16 chars for uniqueness)
    hash_digest = hashlib.sha256(base_id.encode()).hexdigest()
    hash_length = max(16, padding_needed)
    hash_suffix = hash_digest[:hash_length]
    
    return f"{base_id}_{hash_suffix}"


def postprocess_response(response: str) -> str:
    """
    Postprocess the response to clean data prefixes and accumulate content.
    """
    if not response:
        return ""
    
    # If the response doesn't appear to be an SSE stream (lines starting with 'data: '),
    # return it as-is (just whitespace trimmed).
    # This preserves internal line breaks in normal text responses.
    if "data: " not in response:
        return response.strip()
    
    response_text = ""
    # Process line by line as requested
    for line in response.splitlines():
        line = line.strip()
        if not line:
            continue

        # Handle data: prefixes
        if line.startswith("data: "):
            # Extract content after "data: " prefix
            content = line[6:].strip()
            try:
                # Attempt to use JSON parsing for robust unescaping/unwrapping
                parsed = json.loads(content)
                if isinstance(parsed, str):
                    response_text += parsed
                else:
                    response_text += str(parsed)
            except json.JSONDecodeError:
                # Fallback: just return content as-is (e.g. simple text)
                response_text += content
        else:
            # Handle any other non-empty lines - append with space or newline?
            # If we're in this mixed mode, it's safer to just append
            response_text += line
    return response_text


async def stream_with_persistence(
    response_queue: Any,  # Typed as Any to avoid circular import with StreamingQueue
    task: asyncio.Task,
    phone_number: str
) -> AsyncGenerator[str, None]:
    """
    Stream response from queue while accumulating full text for persistence.
    """
    full_raw_response = ""
    final_clean_response = ""
    
    try:
        async for item in response_queue.stream():
            full_raw_response += str(item)
        await task  # Ensure task completion
        final_clean_response = postprocess_response(full_raw_response)
        if final_clean_response:
            yield final_clean_response
    finally:
        try:
            if final_clean_response and phone_number:
                db = get_db()
                db.save_user_message(phone_number, {"role": "bot", "content": final_clean_response})
                logger.info(f"Saved bot response for {phone_number}: {final_clean_response[:50]}...")
        except Exception as e:
            logger.error(f"Failed to save bot response: {e}")
