from .agent import UserAgent
from contextvars import ContextVar
from typing import Optional, Dict, Any
import asyncio


class UserAgentContext:
    """Context Manager for User Agent"""

    # Global state for tokens that persist across agent calls
    _google_token: Optional[str] = None
    _gateway_token: Optional[str] = None
    _response_queue: Optional[asyncio.Queue] = None
    _agent: Optional[UserAgent] = None
    
    # Workflow state
    _current_workflow: Optional[str] = None  # None | "onboarding" | "meal_planning" | "ordering"
    _workflow_step: Optional[str] = None
    _pending_action: Optional[str] = None  # "approve_plan" | "approve_substitution" | "approve_checkout"
    _workflow_data: Dict[str, Any] = {}
    
    # Context variables for application state
    _google_token_ctx: ContextVar[Optional[str]] = ContextVar(
        "google_token", default=None
    )
    _gateway_token_ctx: ContextVar[Optional[str]] = ContextVar(
        "gateway_token", default=None
    )
    _response_queue_ctx: ContextVar[Optional[asyncio.Queue]] = ContextVar(
        "response_queue", default=None
    )
    _agent_ctx: ContextVar[Optional[UserAgent]] = ContextVar(
        "agent", default=None
    )
    _current_workflow_ctx: ContextVar[Optional[str]] = ContextVar(
        "current_workflow", default=None
    )
    _workflow_step_ctx: ContextVar[Optional[str]] = ContextVar(
        "workflow_step", default=None
    )
    _pending_action_ctx: ContextVar[Optional[str]] = ContextVar(
        "pending_action", default=None
    )
    _workflow_data_ctx: ContextVar[Optional[Dict[str, Any]]] = ContextVar(
        "workflow_data", default=None
    )
    _phone_number_ctx: ContextVar[Optional[str]] = ContextVar(
        "phone_number", default=None
    )
    _auth_token_ctx: ContextVar[Optional[str]] = ContextVar(
        "auth_token", default=None
    )

    @classmethod
    def get_google_token_ctx(
        cls,
    ) -> Optional[str]:
        # First try to get from global state for persistence across calls
        if cls._google_token:
            return cls._google_token
        try:
            return cls._google_token_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_google_token_ctx(cls, token: str) -> None:
        # Set both global state and context variable
        cls._google_token = token
        cls._google_token_ctx.set(token)

    @classmethod
    def get_response_queue_ctx(
        cls,
    ) -> Optional[asyncio.Queue]:
        # First try to get from global state for persistence across calls
        if cls._response_queue:
            return cls._response_queue
        try:
            return cls._response_queue_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_response_queue_ctx(cls, queue: asyncio.Queue) -> None:
        # Set both global state and context variable
        cls._response_queue = queue
        cls._response_queue_ctx.set(queue)

    @classmethod
    def get_gateway_token_ctx(
        cls,
    ) -> Optional[str]:
        # First try to get from global state for persistence across calls
        if cls._gateway_token:
            return cls._gateway_token
        try:
            return cls._gateway_token_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_gateway_token_ctx(cls, token: str) -> None:
        # Set both global state and context variable
        cls._gateway_token = token
        cls._gateway_token_ctx.set(token)

    @classmethod
    def get_agent_ctx(
        cls,
    ) -> Optional[UserAgent]:
        # First try to get from global state for persistence across calls
        if cls._agent:
            return cls._agent
        try:
            return cls._agent_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_agent_ctx(cls, agent: UserAgent) -> None:
        # Set both global state and context variable
        cls._agent = agent
        cls._agent_ctx.set(agent)

    @classmethod
    def get_current_workflow_ctx(cls) -> Optional[str]:
        if cls._current_workflow:
            return cls._current_workflow
        try:
            return cls._current_workflow_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_current_workflow_ctx(cls, workflow: Optional[str]) -> None:
        cls._current_workflow = workflow
        cls._current_workflow_ctx.set(workflow)

    @classmethod
    def get_workflow_step_ctx(cls) -> Optional[str]:
        if cls._workflow_step:
            return cls._workflow_step
        try:
            return cls._workflow_step_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_workflow_step_ctx(cls, step: Optional[str]) -> None:
        cls._workflow_step = step
        cls._workflow_step_ctx.set(step)

    @classmethod
    def get_pending_action_ctx(cls) -> Optional[str]:
        if cls._pending_action:
            return cls._pending_action
        try:
            return cls._pending_action_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_pending_action_ctx(cls, action: Optional[str]) -> None:
        cls._pending_action = action
        cls._pending_action_ctx.set(action)

    @classmethod
    def get_workflow_data_ctx(cls) -> Dict[str, Any]:
        if cls._workflow_data:
            return cls._workflow_data
        try:
            data = cls._workflow_data_ctx.get()
            return data if data is not None else {}
        except LookupError:
            return {}

    @classmethod
    def set_workflow_data_ctx(cls, data: Dict[str, Any]) -> None:
        cls._workflow_data = data
        cls._workflow_data_ctx.set(data)

    @classmethod
    def update_workflow_data_ctx(cls, key: str, value: Any) -> None:
        """Update a specific key in workflow data"""
        current_data = cls.get_workflow_data_ctx()
        current_data[key] = value
        cls.set_workflow_data_ctx(current_data)

    @classmethod
    def clear_workflow_state(cls) -> None:
        """Clear all workflow state"""
        cls.set_current_workflow_ctx(None)
        cls.set_workflow_step_ctx(None)
        cls.set_pending_action_ctx(None)
        cls.set_workflow_data_ctx({})

    @classmethod
    def get_phone_number_ctx(cls) -> Optional[str]:
        try:
            return cls._phone_number_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_phone_number_ctx(cls, phone: Optional[str]) -> None:
        cls._phone_number_ctx.set(phone)

    @classmethod
    def get_auth_token_ctx(cls) -> Optional[str]:
        try:
            return cls._auth_token_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_auth_token_ctx(cls, token: Optional[str]) -> None:
        cls._auth_token_ctx.set(token)

    # Session Cookie Management
    _session_cookie: Optional[str] = None
    _session_cookie_ctx: ContextVar[Optional[str]] = ContextVar(
        "session_cookie", default=None
    )

    @classmethod
    def get_session_cookie_ctx(cls) -> Optional[str]:
        # Global persistence preference
        if cls._session_cookie:
            return cls._session_cookie
        try:
            return cls._session_cookie_ctx.get()
        except LookupError:
            return None

    @classmethod
    def set_session_cookie_ctx(cls, cookie: Optional[str]) -> None:
        cls._session_cookie = cookie
        cls._session_cookie_ctx.set(cookie)
