import requests
import logging
from typing import Optional, Dict, Any, Union
import firebase_admin.auth
from firebase_admin import auth

from .config import config_manager
from .context import UserAgentContext

logger = logging.getLogger(__name__)

class ApiClient:
    """
    Client for interacting with Athena Backend API.
    Handles authentication via Phone Number -> Custom Token -> ID Token.
    """

    def __init__(self):
        self.config = config_manager.get_config()
        self.base_url = self.config.server.athena_api_url
        self.web_api_key = self.config.database.web_api_key

    def _get_id_token(self) -> str:
        """
        Get a valid ID token for the current user context.
        Strategy:
        1. Check UserAgentContext for specific auth_token.
        2. Check UserAgentContext for phone_number.
           a. Look up user by phone.
           b. Mint Custom Token.
           c. Exchange for ID Token via Google Identity Toolkit.
        """
    def _get_id_token(self) -> str:
        """
        Retrieves a valid Firebase ID Token.
        Strategies:
        1. Check Context for existing token.
        2. Check Context for 'user_id' (from DB) -> Mint Token (Bypass).
        3. Check Context for 'phone_number' -> Lookup Auth User -> Mint Token.
        """
        from agent_config.utils import generate_id_token_from_uid
        
        # 1. Direct Token
        token = UserAgentContext.get_auth_token_ctx()
        if token:
            return token

        if not self.web_api_key:
             raise ValueError("FIREBASE_WEB_API_KEY is required for authentication strategy")

        # 2. User ID (Firestore) based Auth (Preferred Bypass)
        # Try to retrieve user_id from context. It might be in workflow_data if not directly available.
        workflow_data = UserAgentContext.get_workflow_data_ctx()
        user_id = workflow_data.get("user_id") if workflow_data else None
        
        phone_number = UserAgentContext.get_phone_number_ctx()

        if user_id:
            try:
                # Use shared helper (which also ensures user exists/updates phone)
                token = generate_id_token_from_uid(user_id, self.web_api_key, phone_number=phone_number)
                UserAgentContext.set_auth_token_ctx(token)
                return token
            except Exception as e:
                logger.error(f"Failed to generate bypass token for {user_id}: {e}")
                # Fallthrough to phone number lookup

        # 3. Phone Number Auth (Fallback)
        if phone_number:
            try:
                # a. Look up user
                user_record = auth.get_user_by_phone_number(phone_number)
                uid = user_record.uid
                
                token = generate_id_token_from_uid(uid, self.web_api_key, phone_number=phone_number)
                UserAgentContext.set_auth_token_ctx(token)
                return token
            except auth.UserNotFoundError:
                logger.error(f"User not found for phone number: {phone_number}")
                raise ValueError(f"User not found for phone number: {phone_number}")
            except Exception as e:
                logger.error(f"Authentication failed for phone {phone_number}: {e}")
                raise

        raise ValueError("No authentication context found (auth_token, user_id, or phone_number required)")

    def _get_headers(self) -> Dict[str, str]:
        # Basic headers
        return {
            "Content-Type": "application/json"
        }

    def login(self) -> None:
        """Exchange ID token for Session Cookie"""
        try:
            # Force regeneration/retrieval of ID token
            token = self._get_id_token()
            
            logger.info("Attempting login to exchange ID token for Session Cookie...")
            login_url = f"{self.base_url}/api/v1/auth/login"
            
            # Post without cookies, with verify=False
            resp = requests.post(
                login_url,
                json={"id_token": token},
                headers={"Content-Type": "application/json"},
                verify=False
            )
            resp.raise_for_status()
            
            # Extract session_id from response cookies
            session_id = resp.cookies.get("session_id")
            if session_id:
                logger.info(f"Login successful. Got session_id: {session_id[:6]}...")
                UserAgentContext.set_session_cookie_ctx(session_id)
            else:
                logger.warning("Login response ok but no session_id cookie found.")
                
        except Exception as e:
            logger.error(f"Login failed: {e}")
            # Verify if 401?
            pass

    def _ensure_session(self) -> Dict[str, str]:
        """Ensure we have a session cookie, login if needed. Returns cookies dict."""
        session_id = UserAgentContext.get_session_cookie_ctx()
        if not session_id:
            self.login()
            session_id = UserAgentContext.get_session_cookie_ctx()
        
        if session_id:
            return {"session_id": session_id}
        return {}

    def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        cookies = self._ensure_session()
        try:
            response = requests.get(url, headers=self._get_headers(), params=params, verify=False, cookies=cookies)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                logger.warning("401 received. Retrying login...")
                self.login() # Force re-login
                cookies = self._ensure_session()
                # Retry once
                response = requests.get(url, headers=self._get_headers(), params=params, verify=False, cookies=cookies)
                response.raise_for_status()
                return response.json()
            
            logger.error(f"HTTP Error calling {url}: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error calling {url}: {e}")
            raise

    def post(self, endpoint: str, data: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        cookies = self._ensure_session()
        try:
            response = requests.post(url, headers=self._get_headers(), json=data, verify=False, cookies=cookies)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                logger.warning("401 received. Retrying login...")
                self.login()
                cookies = self._ensure_session()
                response = requests.post(url, headers=self._get_headers(), json=data, verify=False, cookies=cookies)
                response.raise_for_status()
                return response.json()
            logger.error(f"HTTP Error calling {url}: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error calling {url}: {e}")
            raise

    def put(self, endpoint: str, data: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        cookies = self._ensure_session()
        try:
            response = requests.put(url, headers=self._get_headers(), json=data, verify=False, cookies=cookies)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
             if e.response.status_code == 401:
                logger.warning("401 received. Retrying login...")
                self.login()
                cookies = self._ensure_session()
                response = requests.put(url, headers=self._get_headers(), json=data, verify=False, cookies=cookies)
                response.raise_for_status()
                return response.json()
             logger.error(f"HTTP Error calling {url}: {e.response.text}")
             raise
        except Exception as e:
            logger.error(f"Error calling {url}: {e}")
            raise

    def patch(self, endpoint: str, data: Optional[Dict[str, Any]] = None, params: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        cookies = self._ensure_session()
        try:
            response = requests.patch(url, headers=self._get_headers(), json=data, params=params, verify=False, cookies=cookies)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
             if e.response.status_code == 401:
                logger.warning("401 received. Retrying login...")
                self.login()
                cookies = self._ensure_session()
                response = requests.patch(url, headers=self._get_headers(), json=data, params=params, verify=False, cookies=cookies)
                response.raise_for_status()
                return response.json()
             logger.error(f"HTTP Error calling {url}: {e.response.text}")
             raise
        except Exception as e:
            logger.error(f"Error calling {url}: {e}")
            raise

api_client = ApiClient()
