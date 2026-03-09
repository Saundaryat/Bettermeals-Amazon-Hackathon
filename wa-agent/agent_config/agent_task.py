from .context import UserAgentContext
from .utils import get_ssm_parameter
from agent_config.agent import UserAgent 
from .tools import bettermeals
import logging

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def agent_task(user_message: str, session_id: str, actor_id: str):
    agent = UserAgentContext.get_agent_ctx()

    response_queue = UserAgentContext.get_response_queue_ctx()
    
    try:
        if agent is None:

            # BetterMeals custom tools for onboarding, meal planning, and ordering
            bettermeals_tools = bettermeals.ALL_TOOLS
            
            agent = UserAgent(
                tools=bettermeals_tools,
            )

            UserAgentContext.set_agent_ctx(agent)

        async for chunk in agent.stream(user_query=user_message):
            await response_queue.put(chunk)

    except Exception as e:
        logger.exception("Agent execution failed.")
        await response_queue.put(f"Error: {str(e)}")
    finally:
        await response_queue.finish()
