# User Agent - API Integration Guide

This guide explains how to integrate with the deployed User Agent from your external applications. The agent provides AI-powered assistance for meal planning, grocery ordering, and kitchen management, supporting both open-ended conversations and structured workflows.

## Agent Capabilities

The User Agent provides:

- **Open-Ended Conversations**: Natural language assistance for questions about food, nutrition, meal planning, and kitchen management
- **Structured Workflows**: Guided processes for onboarding, meal planning, and ordering with approval checkpoints
- **Onboarding**: Create household profiles, manage dietary preferences, allergies, and constraints
- **Meal Planning**: Generate weekly meal plans, score plans, and explain trade-offs
- **Ordering**: Build grocery carts, handle substitutions, and checkout orders
- **Calendar Integration**: Create calendar events and retrieve daily schedules
- **Knowledge Base**: Access cooking guidelines and troubleshooting information


## Available Tools

### Onboarding Tools
- **`create_household_profile`**: Create household/resident profiles with dietary preferences, allergies, and constraints
- **`update_household_preferences`**: Update dietary preferences, allergies, or constraints
- **`get_onboarding_status`**: Check onboarding completion status

**Example Queries**:
- "I want to set up my household profile"
- "Update my preferences - I'm now vegetarian"
- "Am I done with onboarding?"

### Meal Planning Tools
- **`generate_meal_recommendations`**: Generate weekly meal plans based on preferences
- **`score_meal_plan`**: Score plans and explain trade-offs (nutrition, variety, cost, preferences)
- **`get_meal_plan_details`**: Get full plan details including ingredients and recipes

**Example Queries**:
- "Plan my meals for next week"
- "Score the current meal plan"
- "Show me details for plan PLAN001"

### Ordering Tools
- **`build_grocery_cart`**: Build cart from approved meal plan (returns substitutions if needed)
- **`handle_substitution`**: Apply user's substitution choice for out-of-stock items
- **`checkout_order`**: Finalize order (idempotent, returns order_id + ETA)
- **`get_order_status`**: Track delivery status

**Example Queries**:
- "Build a cart for my meal plan"
- "Replace spinach with kale"
- "Checkout my cart"
- "What's the status of order ORD001?"

### Calendar Integration
- **`Create_calendar_event`**: Create new calendar events
- **`Get_calendar_events_today`**: Retrieve today's calendar events

**Example Queries**:
- "Create a meal prep event for tomorrow"
- "What's on my calendar today?"

### Knowledge Base
- **`retrieve`**: Search knowledge base for cooking and nutrition information

**Example Queries**:
- "What are the basic cooking techniques?"
- "How do I meal prep efficiently?"

## Workflows

The User Agent supports both conversational and structured modes:

### Conversational Mode
For general questions and assistance:
- "What are some healthy breakfast options?"
- "How do I store leftovers?"
- "Tell me about Indian cuisine"

### Structured Workflows

#### Onboarding Workflow
1. User: "I want to set up my household"
2. Agent collects: household name, residents, dietary preferences, allergies, constraints
3. Agent may parse lab results if provided
4. Agent creates profile using `create_household_profile`
5. Agent confirms completion

#### Meal Planning Workflow
1. User: "Plan my meals for next week"
2. Agent generates plan using `generate_meal_recommendations`
3. Agent scores plan using `score_meal_plan`
4. Agent presents summary and **requests approval**
5. User approves
6. Agent proceeds to ordering (if requested)

#### Ordering Workflow
1. User: "Order groceries for my meal plan"
2. Agent builds cart using `build_grocery_cart`
3. If substitutions needed, agent presents options and **requests choice**
4. User selects substitution
5. Agent applies using `handle_substitution`
6. Agent **requests checkout approval**
7. User approves
8. Agent finalizes using `checkout_order` (idempotent)
9. Agent provides order_id and ETA

**Approval Checkpoints**: The agent pauses at key decision points (plan approval, substitution choice, checkout) and waits for explicit user confirmation before proceeding.

## User Interaction Categories

### 1. **Meal Discovery & Planning**
- "What's for breakfast/lunch/dinner today?"
- "Show me upcoming meals"
- "What's planned for this week?"
- "Show me meal schedule"

### 2. **Meal Modifications**
- "Swap today's lunch with tomorrow's"
- "Replace dinner with pasta"
- "Update lunch for 5 people"
- "Skip breakfast tomorrow"
- "I won't be eating dinner today"
- "Add this recipe from Instagram"

### 3. **Grocery & Shopping**
- "Show my grocery cart"
- "Place grocery order"
- "What's my order status?"
- "Show order history"
- "Cancel my order"
- "Do we have everything for dinner?"
- "Add milk to shopping list"

### 4. **Cook Management**
- "When is cook taking leave?"
- "Is cook available this week?"
- "Show cook's schedule"

### 5. **Meal Details & Instructions**
- "How do I prepare today's dinner?"
- "Show me cooking steps"
- "How many calories in today's lunch?"
- "Show nutritional info"

### 6. **Feedback & Preferences**
- "Rate this meal"
- "Report issue with meal"
- "Update my preferences"
- "No onion on Mondays"
- "Upload lab results"

### 7. **Inventory & Pantry**
- "Check pantry status"
- "What's missing for this week?"
- "Show inventory"
