# User Agent Architecture

## Overview

The User Agent is an AI-powered assistant built on AWS Bedrock AgentCore using the Strands framework. It supports both **open-ended conversations** and **structured workflows** for meal planning, grocery ordering, and kitchen management.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      External Clients                           │
│  (WhatsApp, Web App, Mobile App, API Clients)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS/WebSocket
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    AWS Bedrock AgentCore                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              BedrockAgentCoreApp Runtime                  │ │
│  │  - Entry point: main.py                                  │ │
│  │  - Session management                                     │ │
│  │  - Streaming response handling                             │ │
│  └──────────────────┬───────────────────────────────────────┘ │
└─────────────────────┼──────────────────────────────────────────┘
                      │
                      │ Invokes
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│                    User Agent (Strands)                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  UserAgent Class (agent_config/agent.py)                 │ │
│  │  - Claude 3.7 Sonnet Model                              │ │
│  │  - Tool orchestration                                    │ │
│  │  - System prompt with workflow guidance                   │ │
│  └──────────────────┬───────────────────────────────────────┘ │
│                     │                                          │
│  ┌──────────────────▼───────────────────────────────────────┐ │
│  │  UserAgentContext (agent_config/context.py)              │ │
│  │  - Workflow state management                             │ │
│  │  - Token management (gateway, Google OAuth)              │ │
│  │  - Response queue for streaming                           │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────┬──────────────────────────────────────────┘
                      │
                      │ Uses Tools
                      │
        ┌─────────────┼─────────────┬─────────────┐
        │             │             │             │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼──────┐ ┌───▼──────┐
│ BetterMeals │ │   MCP    │ │  Google  │ │Knowledge │
│    API      │ │ Gateway  │ │ Calendar │ │   Base   │
│   Tools     │ │  Tools   │ │  Tools   │ │  Tools   │
└─────────────┘ └──────────┘ └──────────┘ └──────────┘
```

## Component Details

### 1. Entry Point (`main.py`)

**Responsibilities:**
- Initializes BedrockAgentCoreApp runtime
- Handles incoming requests from Bedrock AgentCore
- Manages session state
- Sets up streaming response queues
- Initializes workflow state

**Key Functions:**
- `invoke(payload, context)`: Main entry point for agent invocations

### 2. User Agent (`agent_config/agent.py`)

**Responsibilities:**
- Wraps Strands Agent with Claude 3.7 Sonnet
- Manages tool discovery and execution
- Provides system prompt with workflow guidance
- Handles both conversational and structured modes

**Key Components:**
- `UserAgent` class: Main agent wrapper
- System prompt: Defines conversational and workflow behaviors
- Tool integration: BetterMeals API, MCP Gateway, Google Calendar, Knowledge Base

### 3. Context Management (`agent_config/context.py`)

**Responsibilities:**
- Manages workflow state (onboarding, meal_planning, ordering)
- Tracks workflow steps and pending actions
- Stores workflow data (plan_id, cart_id, etc.)
- Manages authentication tokens

**State Variables:**
- `current_workflow`: Active workflow type or None
- `workflow_step`: Current step within workflow
- `pending_action`: Approval type if waiting
- `workflow_data`: Dict storing workflow artifacts

### 4. Agent Task (`agent_config/agent_task.py`)

**Responsibilities:**
- Orchestrates agent execution
- Manages memory hooks
- Handles streaming responses
- Initializes agent instance

**Key Functions:**
- `agent_task(user_message, session_id, actor_id)`: Main task executor

### 5. Memory Management (`agent_config/memory_hook_provider.py`)

**Responsibilities:**
- Semantic memory integration via AgentCore
- Stores user preferences and facts
- Loads conversation history
- Context injection for agent responses

**Memory Namespaces:**
- `user/{actor_id}/preferences`: Dietary preferences, constraints
- `user/{actor_id}/facts`: User-specific information

### 6. Tools

#### BetterMeals API Tools (`agent_config/tools/bettermeals/`)

**Onboarding:**
- `create_household_profile`: Create household/resident profiles
- `update_household_preferences`: Update preferences, allergies, constraints
- `get_onboarding_status`: Check onboarding completion

**Meal Planning:**
- `generate_meal_recommendations`: Generate weekly meal plans
- `score_meal_plan`: Score plans and explain trade-offs
- `get_meal_plan_details`: Get full plan details

**Ordering:**
- `build_grocery_cart`: Build cart from meal plan
- `handle_substitution`: Apply user substitution choices
- `checkout_order`: Finalize order (idempotent)
- `get_order_status`: Track delivery status

#### MCP Gateway Tools

**Source:** Lambda functions via MCP Gateway
- Meal management (get_meal_by_id, get_weekly_meal_plan)
- Cook profiles (get_cook_profile)
- Inventory management (get_inventory)
- Other domain-specific tools

#### Google Calendar Tools (`agent_config/tools/google.py`)

- `Create_calendar_event`: Create calendar events
- `Get_calendar_events_today`: Retrieve today's events

#### Knowledge Base Tools

- `retrieve`: Semantic search in knowledge base

## Data Flow

### Conversational Flow

```
User Message
    │
    ▼
Bedrock AgentCore Runtime
    │
    ▼
UserAgent.invoke()
    │
    ▼
Strands Agent (Claude 3.7 Sonnet)
    │
    ├─► Memory Hook: Load context
    ├─► Tool Selection: Based on intent
    ├─► Tool Execution: Call appropriate tool
    └─► Response Generation: Natural language response
    │
    ▼
Streaming Response Queue
    │
    ▼
User (via Bedrock AgentCore)
```

### Structured Workflow Flow

```
User Message: "Plan my meals"
    │
    ▼
Intent Detection (via system prompt)
    │
    ▼
Workflow Initiation: Set current_workflow = "meal_planning"
    │
    ▼
Step 1: Generate Plan
    │
    ├─► Tool: generate_meal_recommendations()
    ├─► Store: plan_id in workflow_data
    └─► Update: workflow_step = "plan_generated"
    │
    ▼
Step 2: Score Plan
    │
    ├─► Tool: score_meal_plan(plan_id)
    └─► Update: workflow_step = "plan_scored"
    │
    ▼
Step 3: Request Approval
    │
    ├─► Set: pending_action = "approve_plan"
    └─► Pause: Wait for user response
    │
    ▼
User: "Approved"
    │
    ├─► Clear: pending_action
    └─► Update: workflow_step = "plan_approved"
    │
    ▼
Workflow Complete: Clear workflow state
    │
    ▼
Return to Conversational Mode
```

## Workflow State Machine

```
                    ┌─────────────┐
                    │ Conversational│
                    │    Mode       │
                    └──────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Onboarding   │  │ Meal Planning│  │   Ordering   │
│  Workflow    │  │   Workflow   │  │   Workflow   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       │                 │                  │
       └─────────────────┴──────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Workflow Complete│
                 └────────┬─────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Conversational   │
                 │      Mode        │
                 └──────────────────┘
```

### Workflow States

**Onboarding:**
1. `collecting_info` → Collect household/resident info
2. `parsing_labs` → Parse lab results (if provided)
3. `creating_profile` → Create household profile
4. `complete` → Onboarding done

**Meal Planning:**
1. `generating_plan` → Generate recommendations
2. `scoring_plan` → Score plan
3. `awaiting_approval` → Wait for plan approval
4. `plan_approved` → Plan approved, ready for ordering

**Ordering:**
1. `building_cart` → Build grocery cart
2. `awaiting_substitution` → Wait for substitution choice
3. `awaiting_checkout` → Wait for checkout approval
4. `order_placed` → Order confirmed

## Integration Points

### 1. AWS Bedrock AgentCore

**Purpose:** Runtime environment and session management

**Integration:**
- Entry point via `BedrockAgentCoreApp`
- Session ID management
- Streaming response handling
- Authentication via Cognito M2M

### 2. BetterMeals API (`api.bettermeals.in`)

**Purpose:** Domain logic for meal planning and ordering

**Endpoints (Mock Implementation):**
- `POST /onboarding/*`: Household profiles
- `POST /meals/recommendations`: Generate plans
- `POST /meals/score`: Score plans
- `POST /orders/build_cart`: Build carts
- `POST /orders/substitute`: Handle substitutions
- `POST /orders/checkout`: Finalize orders

**Note:** Currently implemented as mock tools. Replace with real HTTP clients when API is available.

### 3. MCP Gateway

**Purpose:** Dynamic tool discovery and execution

**Tools:** Lambda functions exposed via MCP Gateway
- Meal management
- Cook profiles
- Inventory
- Other domain tools

### 4. AgentCore Memory

**Purpose:** Semantic memory for user context

**Features:**
- Actor-scoped namespaces
- 30-day retention
- Session grouping
- Context injection

### 5. Google Calendar API

**Purpose:** Calendar integration

**OAuth Flow:** USER_FEDERATION (3LO)
**Scopes:** `https://www.googleapis.com/auth/calendar`

## Authentication & Authorization

### Machine-to-Machine (M2M) Flow

```
User Agent
    │
    ├─► Cognito Provider (SSM: /app/useragent/agentcore/cognito_provider)
    │
    ├─► Client Credentials Grant
    │
    └─► Access Token (Bearer)
        │
        └─► Used for:
            - Bedrock AgentCore API calls
            - MCP Gateway authentication
```

### User Federation (3LO) Flow

```
User Agent
    │
    ├─► Google OAuth Provider (SSM: /app/useragent/agentcore/google_provider)
    │
    ├─► Authorization Code Flow (PKCE)
    │
    └─► Access Token
        │
        └─► Used for:
            - Google Calendar API calls
```

## Configuration

### SSM Parameters

All configuration stored in AWS Systems Manager Parameter Store:

```
/app/useragent/
├── agentcore/
│   ├── gateway_url          # MCP Gateway URL
│   ├── memory_id            # AgentCore Memory ID
│   ├── cognito_provider     # Cognito provider name (M2M)
│   └── google_provider      # Google OAuth provider name (3LO)
└── knowledge_base/
    └── knowledge_base_id    # Knowledge base ID
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Cloud                                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         Bedrock AgentCore Runtime                     │ │
│  │  - Deployed as Lambda function                        │ │
│  │  - Entry point: main.py                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         MCP Gateway (Lambda Functions)                │ │
│  │  - Tool implementations                                │ │
│  │  - DynamoDB access                                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         Infrastructure                                  │ │
│  │  - DynamoDB: Meals, Cooks, Inventory, etc.            │ │
│  │  - SSM Parameter Store: Configuration                 │ │
│  │  - Cognito: Authentication                            │ │
│  │  - AgentCore Memory: Semantic memory                  │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling

### Error Types

1. **Authentication Errors**: Token expired/invalid
   - Action: Refresh token or re-authenticate

2. **Tool Execution Errors**: API failures, timeouts
   - Action: Retry with exponential backoff
   - Fallback: Graceful error message to user

3. **Workflow Errors**: Invalid state transitions
   - Action: Reset workflow state, return to conversational mode

4. **Memory Errors**: Memory save/load failures
   - Action: Log error, continue without memory context

## Performance Considerations

### Streaming
- Token-level streaming for responsive UX
- Non-blocking response queue

### State Management
- Context variables for thread-safe state
- Global state for persistence across calls

### Tool Execution
- Async tool execution where possible
- Timeout handling for external APIs

## Security

### Data Protection
- PII minimization (hashing IDs where possible)
- Secrets never stored in state
- Structured, redacted logs

### Access Control
- Cognito-based authentication
- SSM parameter encryption
- IAM roles for Lambda execution

### Approval Gates
- Human-in-the-loop for financial actions
- Explicit approval required for checkout
- Substitution choices require user input

## Future Enhancements

1. **Workflow Orchestration**: Explicit state machine for workflows
2. **Checkpointing**: Durable workflow state persistence
3. **Resume Capability**: Resume workflows after interruption
4. **Multi-modal**: Vision for lab results, voice input
5. **Real API Integration**: Replace mock tools with HTTP clients

