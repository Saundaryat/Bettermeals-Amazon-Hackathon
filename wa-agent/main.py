import os
import firebase_admin
from firebase_admin import credentials

# Import secrets to ensure environment variables are set
import agent_config.secrets

from agent_config.context import UserAgentContext
from agent_config.agent_task import agent_task
from agent_config.streaming_queue import StreamingQueue
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from agent_config.utils import get_ssm_parameter, normalize_phone_number_to_e164, build_and_set_tool_context, get_or_create_daily_session_id, stream_with_persistence
import asyncio
import logging

from agent_config.config import config_manager, ConfigurationError
from agent_config.prompt_enhancer import enhance_prompt_with_context, format_conversation_history
from agent_config.database.database import get_db

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase App (only once)
if not firebase_admin._apps:
    try:
        config = config_manager.get_config()
        cred = credentials.Certificate(config.database.firebase_creds)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized successfully via Unified Config")
    except ConfigurationError as e:
        logger.error(f"Failed to initialize Firebase: {e}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error initializing Firebase: {e}")
        raise e

# Environment flags
os.environ["STRANDS_OTEL_ENABLE_CONSOLE_EXPORT"] = "true"
os.environ["STRANDS_TOOL_CONSOLE_MODE"] = "enabled"

os.environ["KNOWLEDGE_BASE_ID"] = get_ssm_parameter(
    "/app/healthfab/knowledge_base/knowledge_base_id"
)

# Bedrock app and global agent instance
app = BedrockAgentCoreApp()


@app.entrypoint
async def invoke(payload, context):
    if not UserAgentContext.get_response_queue_ctx():
        UserAgentContext.set_response_queue_ctx(StreamingQueue())

    # Initialize workflow state if not set
    if UserAgentContext.get_current_workflow_ctx() is None:
        UserAgentContext.set_current_workflow_ctx(None)
        UserAgentContext.set_workflow_step_ctx(None)
        UserAgentContext.set_pending_action_ctx(None)
        UserAgentContext.set_workflow_data_ctx({})

    user_message = payload["prompt"]
    actor_id = payload["actor_id"]
    phone_number = payload.get("phone_number") or actor_id
    
    # Normalize phone number to E.164
    if phone_number:
        phone_number = normalize_phone_number_to_e164(phone_number)
        
    session_id = payload.get("session_id")

    # Inject Context
    try:
        tool_context = build_and_set_tool_context(phone_number, payload)
        
        # NOTE: Authentication token generation is now handled automatically
        # by the ApiClient in agent_config/api_client.py using the user_id
        # injected into the tool_context.

        user_message = enhance_prompt_with_context(user_message, tool_context)
        
        # Inject Conversation History
        if phone_number:
            try:
                db = get_db()
                recent_msgs = db.get_recent_messages(phone_number, limit=5)
                history_str = format_conversation_history(recent_msgs)
                if history_str:
                    logger.info(f"Injecting history of {len(recent_msgs)} messages. Content preview:\n{history_str[:200]}...")
                    user_message = f"{history_str}\n\n{user_message}"
            except Exception as he:
                logger.error(f"Failed to inject history: {he}")
                
        logger.info(f"Augmented User Message with Context for {phone_number}")
    except Exception as e:
        logger.error(f"Failed to inject context: {e}")

    # Use deterministic daily session ID logic or fallback to strict context
    # This ensures memory continuity for the day
    if phone_number:
        session_id = get_or_create_daily_session_id(phone_number)
    else:
        session_id = context.session_id

    if not session_id:
        raise Exception("Context session_id is not set")
    
    # Save user message to DB
    try:
        db = get_db()
        db.save_user_message(phone_number, {"role": "user", "content": payload["prompt"]})
    except Exception as e:
        logger.error(f"Failed to save user message: {e}")

    task = asyncio.create_task(
        agent_task(
            user_message=user_message,
            session_id=session_id,
            actor_id=actor_id,
        )
    )

    response_queue = UserAgentContext.get_response_queue_ctx()
    return stream_with_persistence(response_queue, task, phone_number)


if __name__ == "__main__":
    app.run()
