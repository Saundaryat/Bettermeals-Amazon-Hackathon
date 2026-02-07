# BetterMeals: DESIGN.MD
## System Design & Architecture

---

## TABLE OF CONTENTS
1. [System Overview](#1-system-overview)
2. [Design Principles](#2-design-principles)
3. [Architecture Diagram](#3-architecture-diagram)
4. [Clinical AI Layer](#4-clinical-ai-layer)
5. [Household Automation Layer](#5-household-automation-layer)
6. [Grocer Integration Layer](#6-grocer-integration-layer)
7. [Data Layer](#7-data-layer)
8. [API Specifications](#8-api-specifications)
9. [Security Architecture](#9-security-architecture)
10. [Data Synchronization](#10-data-synchronization)
11. [Error Handling & Resilience](#11-error-handling--resilience)
12. [AWS Deployment](#12-aws-deployment)
13. [Performance Budgets](#13-performance-budgets)
14. [Testing Strategy](#14-testing-strategy)
15. [Rollout Plan](#15-rollout-plan)
16. [Tech Stack Summary](#16-tech-stack-summary)
17. [Design Decisions](#17-design-decisions)
18. [Success Metrics](#18-success-metrics)
19. [Troubleshooting Guide](#19-troubleshooting-guide)

---

## 1. SYSTEM OVERVIEW

BetterMeals orchestrates 5 interconnected layers:
- **Clinical AI Layer** - Biomarker analysis, meal plan generation, explainability
- **Household Automation Layer** - Shopping, cooking instructions, mobile app
- **Grocer Integration Layer** - Order routing, delivery, inventory
- **Clinician Interface** - Doctor dashboard and approval workflow
- **Data Layer** - PostgreSQL, MongoDB, Redis, S3

---

## 2. DESIGN PRINCIPLES

### Core Principles

**1. Doctor Trust Through Transparency**
- Every AI recommendation must be explainable (SHAP/LIME)
- No black-box decisions; doctors see reasoning for 100% of recommendations
- Doctor approval required before household receives plan (CDSSS compliance)

**2. Household-First Execution**
- Zero-touch ordering: groceries arrive automatically
- Simple cooking instructions: <30 minutes per meal, beginner-friendly
- Offline-first mobile app: works without internet for today's meals

**3. Clinical Accuracy Over Speed**
- Validate all recommendations against clinical guidelines (ADA, PCOS Society, IBS Society)
- Multi-disease optimization without conflicts
- Continuous biomarker monitoring and plan adjustment

**4. Graceful Degradation**
- If primary grocer fails, route to backup grocer
- If API is slow, show cached data with staleness indicator
- If network is poor, app works offline with last synced data

**5. Security by Design**
- Patient health data encrypted at rest (AES-256) and in transit (TLS 1.3)
- Role-based access control (RBAC): doctors see health data, grocers see only orders
- Audit logging for all data access (compliance requirement)

**6. Scalability from Day One**
- Microservices architecture for independent scaling
- Database sharding strategy for 100M+ patients
- Auto-scaling based on load (CPU, memory, request count)

---

## 3. ARCHITECTURE DIAGRAM

DOCTOR (Upload Lab) 
    ↓
CLINICAL AI LAYER (Biomarker Analysis)
    ↓
MEAL PLAN GENERATION (7-day plan)
    ↓
HOUSEHOLD AUTOMATION (Shopping list + delivery)
    ↓
GROCER INTEGRATION (Auto-order placement)
    ↓
HOUSEHOLD (Receives groceries + cooking instructions)
    ↓
ADHERENCE TRACKING (Monitor compliance)
    ↓
OUTCOMES (Biomarker improvement)
```

---

## 4. CLINICAL AI LAYER

**Implements:** [REQ-001], [REQ-002], [REQ-003], [REQ-004], [REQ-009]

### 4.1 Biomarker Analysis Engine
**Input:** Lab data (HbA1c, glucose, lipids, kidney function, hormones)
**Process:** Normalize values → Apply clinical cutoffs → Identify priorities
**Output:** Priority nutrients, food restrictions, SHAP/LIME reasoning

**Example:**
- HbA1c 8.2% (HIGH) → Priority: Low-GI foods (<55)
- Glucose 156 mg/dL (HIGH) → Priority: High fiber (>25g)
- Triglycerides 180 (ELEVATED) → Priority: Plant protein

**Tech Stack:** Python, TensorFlow, SHAP library

---

### 4.2 Multi-Disease Clinical Rules Engine
**Supported Diseases:**

**Diabetes:** GI <55, Fiber ≥25g, Portion control
**PCOS:** Anti-inflammatory, hormone-balancing, low FODMAP
**IBS:** Gut-friendly, soluble fiber, low FODMAP
**Thyroid:** Iodine, selenium, iron support
**Hypertension:** Sodium <5g, potassium-rich foods
**Autoimmune:** Anti-inflammatory, healing foods

**Multi-Disease Example:**
Patient with diabetes + PCOS + hypertension
→ Single meal: Brown rice + lentil curry + spinach
  ✓ Low GI (35)
  ✓ Anti-inflammatory
  ✓ Low sodium (<100mg)

**Tech Stack:** MongoDB rules database + Python rule engine

---

### 4.3 Meal Plan Generation Engine

**Implements:** [REQ-004]

**Process:**
1. Extract biomarker priorities
2. Query 37,000 Indian foods database with filters:
   - Disease-appropriate
   - Cuisine preference
   - Seasonal availability
   - Budget constraint (₹300-500/day)
   - No allergies
3. Optimize for meal variety (28 days unique, not 7 days)
4. Output: Personalized meal plan with nutrition data

**Algorithm Pseudocode:**
```
function generateMealPlan(patient, duration=28):
  priorities = extractBiomarkerPriorities(patient.labs)
  constraints = {
    diseases: patient.diagnoses,
    budget: patient.budget,
    preferences: patient.preferences,
    allergies: patient.allergies
  }
  
  foods = queryFoodDatabase(constraints)
  meals = []
  
  for day in 1..duration:
    for mealType in [breakfast, lunch, dinner, snack]:
      meal = optimizeMeal(foods, priorities, meals) // avoid repeats
      meals.append(meal)
  
  return validatePlan(meals, priorities)
```

**Daily Meal Example:**
```
Breakfast: Idli (2) + Sambar (1 cup)
  → 180 cal, 30g carbs, 6g protein, 3g fiber

Lunch: Brown rice (1 cup) + Lentil curry + Spinach
  → 320 cal, 45g carbs, 12g protein, 8g fiber

Dinner: Grilled chicken (150g) + Broccoli + Roti
  → 280 cal, 25g carbs, 35g protein, 4g fiber

Daily: 780 cal, 45% carbs, 25% protein, 30% fat
```

**Tech Stack:** MongoDB, Python optimization, Constraint solver

---

### 4.4 SHAP/LIME Explainability

**Implements:** [REQ-009]
**Purpose:** Show doctors WHY each meal was recommended

**Output:**
```
MEAL: Dal & Brown Rice

WHY?
  HbA1c 8.2% (HIGH) → Need low-GI foods
    → Brown rice GI=68 (acceptable)
  
  Glucose 156 mg/dL (HIGH) → Need high fiber
    → Dal has 6g fiber per 100g
  
  Triglycerides 180 (ELEVATED) → Need plant protein
    → Dal is 25% protein

EXPECTED: HbA1c drop to 7.2% in 90 days
SHAP Importance: HbA1c 45%, Glucose 35%, Triglycerides 20%

[✓ Approve] [⚠️ Modify] [❌ Reject]
```

**Tech Stack:** SHAP, LIME libraries

---

## 5. HOUSEHOLD AUTOMATION LAYER

**Implements:** [REQ-005], [REQ-006], [REQ-007], [REQ-008]

### 5.1 Shopping List Optimizer
**Input:** 7-day meal plan
**Process:**
1. Extract ingredients + aggregate quantities
2. Query grocer APIs for real-time pricing
3. Optimize for budget, seasonality, availability
4. Output: Organized shopping list with prices

**Example:**
```
VEGETABLES:
  Spinach 500g - ₹40 (Fresh Stores)
  Tomatoes 1kg - ₹30 (Local)
  Broccoli 500g - ₹60

GRAINS:
  Brown rice 2kg - ₹90
  Red lentils 500g - ₹50

PROTEINS:
  Chicken 500g - ₹180
  Eggs 6 - ₹30

TOTAL: ₹650 (Within ₹1000 budget)
BEST: Fresh Stores
```

**Tech Stack:** Grocer APIs, MongoDB caching, Integer linear programming

---

### 5.2 Cooking Instructions Generator
**Input:** Meal from plan
**Process:** Fetch recipe → Adjust skill level → Generate steps → Scale portions
**Output:** Step-by-step instructions with timing

**Example:**
```
RECIPE: Spinach Dal Curry
PREP: 10 min | COOK: 20 min | SERVES: 4

INGREDIENTS:
  Red lentils 100g
  Spinach 200g
  Onion 1
  Ginger-garlic paste 1 tsp
  Oil 1 tsp
  Turmeric ½ tsp

STEPS:
  1. [5 min] Wash lentils, soak
  2. [15 min] Heat oil, sauté onions golden
  3. [2 min] Add ginger-garlic paste
  4. [1 min] Add turmeric, cumin
  5. [20 min] Add lentils + water, simmer
  6. [5 min] Add spinach, simmer 3 min
  7. [1 min] Season, serve

NUTRITION: 160 cal, 22g carbs, 10g protein, 5g fiber
```

**Tech Stack:** MongoDB recipes, PDF generation

---

### 5.3 Household Mobile App
**Screens:**
- Today's Plan (breakfast, lunch, dinner, snack with images)
- Shopping Status (delivery time, items arriving)
- Cooking Instructions (step-by-step with timer)
- Adherence Dashboard (weekly %, trend graph)
- Profile (patient info, doctor contact, biomarkers)

**Features:**
- Multi-language (EN, HI, TA, KN, TE, BN)
- Offline mode (SQLite cache)
- Push notifications
- Large text for accessibility

**Tech Stack:** React Native, Node.js API, PostgreSQL, SQLite

---

## 6. GROCER INTEGRATION LAYER

**Implements:** [REQ-007]

### 6.1 Grocer Network Manager
**Partners:** Fresh Stores, BigBasket, Local stores

**Routing Logic:**
```
Order Generated (8 PM) →
Check: Fresh Stores (inventory, price, delivery)
Check: BigBasket (inventory, price, delivery)
Check: Local store (inventory, price, delivery)

Select: Best availability + price + speed
Execute: Send order to grocer API
Fallback: If unavailable, try next option
```

**Data:**
```json
{
  "grocer_id": "fresh_stores_001",
  "name": "Fresh Stores",
  "api_endpoint": "https://api.freshstores.com/orders",
  "coverage_zones": ["Bangalore", "Mumbai", "Delhi"],
  "commission_rate": 0.08,
  "delivery_time": "next_day",
  "priority": 1
}
```

**Tech Stack:** REST API clients, PostgreSQL, routing algorithm

---

### 6.2 Order Placement Engine

**Implements:** [REQ-007]

**Process:**
1. 8 PM trigger for each patient (cron job)
2. Generate order from shopping list
3. Format as grocer API request
4. Process payment (₹100-200/month subscription)
5. Place order via API
6. Poll for confirmation + tracking (retry up to 3 times)
7. Notify household (push notification)

**Sequence Diagram:**
```
Patient App          BetterMeals API      Grocer API         Payment Gateway
    |                      |                   |                    |
    |  [8 PM Trigger]      |                   |                    |
    |                      |--- Generate Order-|                    |
    |                      |                   |                    |
    |                      |--- Process Payment ------------------>|
    |                      |<------------------ Payment Success ----|
    |                      |                   |                    |
    |                      |--- Place Order -->|                    |
    |                      |<-- Order ID ------|                    |
    |                      |                   |                    |
    |                      |--- Poll Status -->|                    |
    |                      |<-- Confirmed -----|                    |
    |                      |                   |                    |
    |<-- Push Notification-|                   |                    |
    |  "Order placed"      |                   |                    |
```

**Timing:**
- Order generation: <5 seconds
- Payment processing: <3 seconds
- API call to grocer: <5 seconds
- Total end-to-end: <15 seconds (95th percentile)

**Example Order:**
```json
{
  "patient_id": "P123456",
  "delivery_date": "2026-01-25",
  "delivery_address": "123 Main St, Bangalore",
  "items": [
    {"name": "Spinach 500g", "sku": "FST-SPIN-500"},
    {"name": "Brown rice 2kg", "sku": "FST-BRICE-2K"}
  ],
  "estimated_cost": "₹650"
}
```

**Payment Model:**
- Patient: ₹50-100/month flat subscription
- Grocer: 5-10% commission on order value
- BetterMeals Margin: Revenue - (commission + logistics)

**Tech Stack:** Node.js, Razorpay API, Firebase Cloud Messaging, Cron jobs

---

## 7. DATA LAYER

### 7.1 Database Schema

### PostgreSQL Tables:
```sql
-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  diagnosis TEXT[] NOT NULL, -- array of disease codes
  comorbidities TEXT[],
  budget_min INTEGER DEFAULT 300, -- ₹ per day
  budget_max INTEGER DEFAULT 500,
  doctor_id UUID REFERENCES doctors(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_diagnosis (diagnosis) -- GIN index for array search
);

-- Doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  license_id VARCHAR(100) UNIQUE NOT NULL,
  hospital VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_license (license_id)
);

-- Lab values table
CREATE TABLE lab_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  lab_date DATE NOT NULL,
  hba1c DECIMAL(4,2), -- e.g., 8.20
  glucose INTEGER, -- mg/dL
  triglycerides INTEGER, -- mg/dL
  ldl INTEGER,
  hdl INTEGER,
  tsh DECIMAL(5,3), -- thyroid
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_patient_date (patient_id, lab_date DESC)
);

-- Meal plans table
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  meal_plan_json JSONB NOT NULL, -- full 28-day plan
  clinical_reasoning JSONB, -- SHAP/LIME explanations
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_patient_status (patient_id, status),
  INDEX idx_created (created_at DESC)
);

-- Meal adherence table
CREATE TABLE meal_adherence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(20) NOT NULL, -- breakfast, lunch, dinner, snack
  meal_eaten BOOLEAN DEFAULT FALSE,
  status VARCHAR(50), -- completed, skipped, modified
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_patient_date (patient_id, meal_date DESC)
);

-- Grocer orders table
CREATE TABLE grocer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  grocer_id UUID REFERENCES grocers(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, delivered, failed
  total_cost INTEGER NOT NULL, -- ₹
  grocer_order_id VARCHAR(255), -- external order ID
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_patient_status (patient_id, status),
  INDEX idx_grocer_date (grocer_id, created_at DESC)
);

-- Grocers table
CREATE TABLE grocers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  api_endpoint VARCHAR(500) NOT NULL,
  commission_rate DECIMAL(4,3) DEFAULT 0.08, -- 8%
  active BOOLEAN DEFAULT TRUE,
  coverage_zones TEXT[], -- array of cities
  priority INTEGER DEFAULT 1, -- routing priority
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_active_priority (active, priority)
);

-- Data retention policies
-- Patient data: 7 years (compliance requirement)
-- Lab values: 7 years
-- Meal plans: 2 years
-- Adherence logs: 2 years
-- Grocer orders: 2 years
```

### 7.2 MongoDB Collections:
```json
// Foods collection (37,000+ documents)
{
  "_id": ObjectId("..."),
  "name": "Brown Rice",
  "name_regional": {
    "hindi": "भूरा चावल",
    "tamil": "பழுப்பு அரிசி",
    "kannada": "ಕಂದು ಅಕ್ಕಿ"
  },
  "nutrition": {
    "calories": 112,
    "carbs": 24,
    "protein": 2.6,
    "fat": 0.9,
    "fiber": 1.8,
    "sodium": 5,
    "glycemic_index": 68
  },
  "disease_suitability": {
    "diabetes": "suitable", // suitable, caution, avoid
    "pcos": "suitable",
    "ibs": "suitable",
    "thyroid": "suitable",
    "hypertension": "suitable",
    "autoimmune": "suitable"
  },
  "seasonal_availability": ["all_year"],
  "regional_availability": ["north", "south", "east", "west"],
  "grocer_availability": {
    "fresh_stores": true,
    "bigbasket": true,
    "local": true
  },
  "avg_price_per_kg": 90,
  "cuisine_type": ["north_indian", "south_indian"],
  "updated_at": ISODate("2026-01-24")
}

// Recipes collection (5,000+ documents)
{
  "_id": ObjectId("..."),
  "name": "Spinach Dal Curry",
  "name_regional": {
    "hindi": "पालक दाल करी",
    "tamil": "கீரை பருப்பு கறி"
  },
  "ingredients": [
    {"food_id": ObjectId("..."), "name": "Red lentils", "quantity": 100, "unit": "g"},
    {"food_id": ObjectId("..."), "name": "Spinach", "quantity": 200, "unit": "g"},
    {"food_id": ObjectId("..."), "name": "Onion", "quantity": 1, "unit": "piece"}
  ],
  "steps": [
    {"order": 1, "instruction": "Wash lentils, soak for 5 min", "duration_min": 5},
    {"order": 2, "instruction": "Heat oil, sauté onions golden", "duration_min": 15},
    {"order": 3, "instruction": "Add ginger-garlic paste", "duration_min": 2}
  ],
  "timing": {
    "prep_min": 10,
    "cook_min": 20,
    "total_min": 30
  },
  "nutrition": {
    "calories": 160,
    "carbs": 22,
    "protein": 10,
    "fiber": 5
  },
  "difficulty": "beginner", // beginner, intermediate, advanced
  "serves": 4,
  "cuisine_type": "north_indian",
  "updated_at": ISODate("2026-01-24")
}
```

### 7.3 Redis Caching Strategy:
```
// Cache keys and TTL
grocer_prices:{grocer_id}:{food_id} -> price (TTL: 1 hour)
meal_plan:{patient_id}:current -> meal_plan_json (TTL: 7 days)
food_search:{query_hash} -> food_ids[] (TTL: 24 hours)
doctor_dashboard:{doctor_id} -> patient_list (TTL: 5 minutes)
```

---

## 8. API SPECIFICATIONS

### POST /api/v1/meal-plans/generate
```json
Request:
{
  "patient_id": "P123456",
  "doctor_id": "D789",
  "plan_duration": 28
}

Response (Success - 200):
{
  "meal_plan_id": "MP456789",
  "status": "generated",
  "plan": { 
    "day_1": {
      "breakfast": {...},
      "lunch": {...},
      "dinner": {...},
      "snack": {...}
    },
    "day_2": {...}
  },
  "clinical_reasoning": {
    "biomarker_priorities": [...],
    "shap_explanations": [...]
  },
  "time_to_generate": "1.8s"
}

Response (Error - 400):
{
  "error": "invalid_patient",
  "message": "Patient ID not found",
  "code": "PATIENT_NOT_FOUND"
}

Response (Error - 500):
{
  "error": "generation_failed",
  "message": "Unable to generate meal plan. Please try again.",
  "code": "INTERNAL_ERROR",
  "retry_after": 60
}
```

### POST /api/v1/meal-plans/{id}/approve
```json
Request:
{
  "doctor_id": "D789",
  "approval_status": "approved", // approved, rejected, modified
  "modifications": [] // optional, if status=modified
}

Response (Success - 200):
{
  "success": true,
  "message": "Plan approved and sent to household",
  "household_notified_at": "2026-01-25T10:30:00Z"
}

Response (Error - 403):
{
  "error": "unauthorized",
  "message": "Doctor not authorized to approve this plan",
  "code": "UNAUTHORIZED_DOCTOR"
}
```

### POST /api/v1/shopping-lists/generate
```json
Request:
{
  "meal_plan_id": "MP456789"
}

Response (Success - 200):
{
  "shopping_list_id": "SL987654",
  "items": [
    {
      "category": "vegetables",
      "name": "Spinach",
      "quantity": 500,
      "unit": "g",
      "price": 40,
      "grocer": "Fresh Stores"
    }
  ],
  "total_cost": 650,
  "budget_status": "within", // within, over, under
  "budget_variance": -50 // ₹ difference from budget
}

Response (Error - 404):
{
  "error": "meal_plan_not_found",
  "message": "Meal plan ID not found",
  "code": "MEAL_PLAN_NOT_FOUND"
}
```

### POST /api/v1/grocer-orders/place
```json
Request:
{
  "patient_id": "P123456",
  "shopping_list_id": "SL987654",
  "grocer_id": "GR001"
}

Response (Success - 200):
{
  "order_id": "GO123456",
  "grocer_order_id": "FST-ORD-999",
  "total_cost": 650,
  "estimated_delivery": "2026-01-25 10:00 AM",
  "tracking_url": "https://freshstores.com/track/FST-ORD-999"
}

Response (Error - 503):
{
  "error": "grocer_unavailable",
  "message": "Grocer API is currently unavailable. Trying backup grocer.",
  "code": "GROCER_API_DOWN",
  "retry_with_grocer": "GR002",
  "retry_after": 30
}
```

---

## 9. SECURITY ARCHITECTURE

### Data Protection:
- **Encryption at Rest:** AES-256
- **Encryption in Transit:** TLS 1.3
- **Database:** PostgreSQL with RBAC

### Access Control:
- **Doctor:** Own patients' health data only
- **Patient:** Own meal plans + adherence
- **Grocer:** Anonymized order data only (no health info)
- **Admin:** System config + audit logs

### Compliance:
- **HIPAA-Equivalent:** Privacy & security standards
- **Data Isolation:** No cross-sharing between entities
- **Audit Logging:** All data access logged
- **7-Year Retention:** Patient data kept per regulations

---

## 10. DATA SYNCHRONIZATION

### 10.1 Mobile App Sync Strategy

**Offline-First Architecture:**
- App stores last 7 days of meal plans in SQLite
- Cooking instructions cached locally
- Adherence logs queued for upload when online

**Sync Process:**
```
App Launch:
  1. Check network connectivity
  2. If online:
     - Fetch latest meal plan (if updated)
     - Upload queued adherence logs
     - Sync grocer order status
  3. If offline:
     - Load from SQLite cache
     - Show "Offline Mode" indicator
     - Queue all user actions for later sync

Background Sync (every 30 minutes):
  - Fetch order status updates
  - Upload adherence logs
  - Check for plan modifications
```

**Conflict Resolution:**
- **Patient logs meal as eaten, doctor modifies plan:** Patient's log preserved; new plan applies from next day
- **Multiple devices (patient + family member):** Last write wins; sync timestamp used for ordering
- **Network failure during order placement:** Retry up to 3 times with exponential backoff (1s, 2s, 4s)

**Data Freshness Indicators:**
```
Meal Plan: "Last updated 2 hours ago"
Order Status: "Checking delivery status..." (if stale >5 min)
Adherence: "Syncing..." (if queued logs exist)
```

### 10.2 Real-Time Updates

**Push Notifications (Firebase Cloud Messaging):**
- Order placed: "Your groceries are on the way!"
- Order delivered: "Groceries delivered. Check your doorstep."
- Plan modified: "Your doctor updated your meal plan."
- Adherence alert: "Don't forget to log today's lunch!"

**WebSocket Connections (for doctor dashboard):**
- Real-time patient adherence updates
- Order status changes
- New plan approval requests

---

## 11. ERROR HANDLING & RESILIENCE

### 11.1 Failure Modes & Mitigation

**Grocer API Failure:**
```
Primary Grocer Down:
  1. Detect failure (timeout >10s or 5xx error)
  2. Log error to monitoring system
  3. Route to backup grocer (priority 2)
  4. Notify patient: "Using alternate grocer due to availability"
  5. If all grocers down: Generate manual shopping list, send via email/SMS
```

**Payment Gateway Failure:**
```
Payment Processing Error:
  1. Retry payment up to 3 times
  2. If still failing: Hold order, notify patient
  3. Send payment link via email/SMS
  4. Resume order once payment confirmed
  5. Escalate to support if unresolved after 24 hours
```

**Database Connection Loss:**
```
PostgreSQL Connection Lost:
  1. Attempt reconnection (max 5 retries, exponential backoff)
  2. If read replica available: Route read queries there
  3. If all connections lost: Return cached data with staleness warning
  4. Queue write operations for retry
  5. Alert DevOps team via PagerDuty
```

**AI Model Failure:**
```
Meal Plan Generation Timeout (>2 min):
  1. Cancel current generation
  2. Log error with patient context
  3. Retry with simplified constraints (fewer optimization passes)
  4. If still failing: Fallback to template-based plan (generic for disease)
  5. Notify doctor: "Plan generated using fallback method. Please review carefully."
```

### 11.2 Retry Logic

**Exponential Backoff Strategy:**
```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await sleep(delay);
    }
  }
}
```

**Circuit Breaker Pattern:**
```
Grocer API Circuit Breaker:
  - Threshold: 5 failures in 60 seconds
  - Open circuit: Stop calling API for 5 minutes
  - Half-open: Try 1 request after 5 minutes
  - Close circuit: If request succeeds, resume normal operation
```

### 11.3 Graceful Degradation

**Feature Degradation Levels:**
```
Level 1 (Full Functionality):
  - All features working
  - Real-time updates
  - Auto-ordering enabled

Level 2 (Degraded):
  - Grocer API slow/unreliable
  - Show cached prices (with staleness indicator)
  - Manual order confirmation required

Level 3 (Minimal):
  - Grocer API down
  - Generate manual shopping list
  - Email/SMS delivery
  - No auto-ordering

Level 4 (Emergency):
  - Database issues
  - Read-only mode
  - Show cached meal plans
  - No new plan generation
```

---

## 12. AWS DEPLOYMENT

### Infrastructure:
```
VPC (Private)
  ↓
ECS Fargate (Microservices)
  - Meal Plan Service: 2-10 instances (auto-scale on CPU >70%)
  - Shopping List Service: 2-5 instances (auto-scale on CPU >70%)
  - Grocer Integration Service: 2-8 instances (auto-scale on request count >1000/min)
  - Doctor Dashboard Service: 2-4 instances
  - Household App API: 2-10 instances (auto-scale on CPU >70%)
  ↓
RDS PostgreSQL (Primary + 2 read replicas)
  - Instance: db.r5.xlarge (4 vCPU, 32 GB RAM)
  - Storage: 500 GB SSD (auto-scaling to 2 TB)
  - Backups: Daily automated, 30-day retention
  ↓
MongoDB Atlas (Managed service)
  - Cluster: M30 (8 GB RAM, 2 vCPU)
  - Storage: 1 TB
  - Sharding: By region (north, south, east, west)
  ↓
ElastiCache Redis (Caching)
  - Instance: cache.r5.large (13.5 GB RAM)
  - Cluster mode: Enabled (3 shards, 2 replicas each)
  ↓
S3 (PDFs, backups, static assets)
  - Lab reports: Encrypted, 7-year retention
  - Backups: Glacier after 90 days
  ↓
CloudFront (CDN)
  - Edge locations: Mumbai, Delhi, Bangalore
  - Cache: Static assets (images, CSS, JS)
  ↓
API Gateway (Rate limiting)
  - Rate limit: 1000 requests/min per API key
  - Throttle: 10,000 requests/sec burst
  ↓
Application Load Balancer (Distribution)
  - Health checks: Every 30 seconds
  - Unhealthy threshold: 3 consecutive failures
```

**Auto-Scaling Policies:**
```
Meal Plan Service:
  - Scale up: CPU >70% for 2 minutes
  - Scale down: CPU <30% for 5 minutes
  - Min: 2 instances, Max: 10 instances

Grocer Integration Service:
  - Scale up: Request count >1000/min for 1 minute
  - Scale down: Request count <300/min for 5 minutes
  - Min: 2 instances, Max: 8 instances
```

### CI/CD Pipeline:
```
GitHub Push →
GitHub Actions →
  Run Tests (unit, integration) →
  Build Docker Image →
  Push to ECR →
  Deploy to ECS staging →
  Run Smoke Tests →
  Manual Approval →
  Deploy to Production
```

### Monitoring:
- **CloudWatch:** Logs, metrics, alarms
  - Alarms: CPU >80%, Memory >85%, API latency >2s (p95)
  - Dashboards: Real-time service health, request rates, error rates
- **DataDog:** APM (Application Performance Monitoring)
  - Distributed tracing across microservices
  - Database query performance
  - Custom metrics: Adherence rate, plan generation time
- **PagerDuty:** Alerts and on-call rotation
  - Critical: Database down, payment gateway failure
  - High: Grocer API failure, high error rate (>5%)
  - Medium: Slow response times, cache misses

---

## 13. PERFORMANCE BUDGETS

### 13.1 API Response Time Budgets

| Endpoint | p50 | p95 | p99 | Timeout |
|----------|-----|-----|-----|---------|
| POST /meal-plans/generate | 45s | 90s | 120s | 180s |
| POST /meal-plans/{id}/approve | 200ms | 500ms | 1s | 5s |
| POST /shopping-lists/generate | 5s | 15s | 30s | 60s |
| POST /grocer-orders/place | 2s | 5s | 10s | 30s |
| GET /meal-plans/{id} | 100ms | 300ms | 500ms | 2s |
| GET /adherence/stats | 200ms | 500ms | 1s | 5s |

### 13.2 Database Query Budgets

| Query Type | Target | Max |
|------------|--------|-----|
| Patient lookup by ID | <10ms | 50ms |
| Lab values (last 6 months) | <50ms | 200ms |
| Meal plan retrieval | <20ms | 100ms |
| Adherence aggregation (30 days) | <100ms | 500ms |
| Food search (with filters) | <200ms | 1s |

### 13.3 Mobile App Performance

| Metric | Target | Max |
|--------|--------|-----|
| App launch (cold start) | <2s | 4s |
| App launch (warm start) | <500ms | 1s |
| Screen transition | <200ms | 500ms |
| Image load (cached) | <100ms | 300ms |
| Image load (network) | <1s | 3s |
| Sync operation | <5s | 15s |

### 13.4 Resource Limits

**Per Service:**
- CPU: 2 vCPU per instance
- Memory: 4 GB per instance
- Disk I/O: 3000 IOPS (SSD)

**Database Connections:**
- Max connections per service: 20
- Connection pool size: 10
- Connection timeout: 30s

**API Rate Limits:**
- Doctor API: 100 requests/min per doctor
- Household API: 50 requests/min per patient
- Grocer API: 1000 requests/min total

---

## 14. TESTING STRATEGY

### Unit Testing:
- Clinical AI logic tests
- Meal plan generation tests
- Shopping list optimizer tests
- API contract tests

### Integration Testing:
- Lab upload → Plan generation → Household delivery
- Grocer order → Delivery tracking
- Payment processing flow

### Clinical Validation:
- Validate against ADA guidelines
- Pilot 100 patients
- Measure adherence + biomarker improvements
- Collect user feedback

### Load Testing:
- Simulate 10K concurrent users
- Verify <2 second response time (95th percentile)
- Test grocer APIs under load

---

## 15. ROLLOUT PLAN

### Phase 1: MVP Development (Months 1-4)
- Build all core services
- Integrate with 3 grocer partners
- Deploy to staging
- Security & compliance setup

### Phase 2: Pilot Launch (Months 5-6)
- 500 patients (Bangalore, Delhi, Mumbai)
- Daily monitoring
- Collect feedback

### Phase 3: Validate & Iterate (Months 7-9)
- Analyze outcomes (adherence, biomarkers)
- Refine based on learnings
- Prepare for scale

### Phase 4: Scale (Months 10-12)
- Deploy to 10+ cities
- 10,000+ active patients
- Full grocer network coverage

---

## 16. TECH STACK SUMMARY

| Component | Technology |
|-----------|------------|
| **AI/ML** | Python, TensorFlow, SHAP, scikit-learn |
| **Backend API** | Node.js, FastAPI, Express |
| **Mobile** | React Native (iOS + Android) |
| **Database** | PostgreSQL, MongoDB, Redis |
| **Cloud** | AWS (ECS, RDS, S3, CloudFront) |
| **DevOps** | Docker, Kubernetes, GitHub Actions |
| **Monitoring** | CloudWatch, DataDog, PagerDuty |
| **Payment** | Razorpay |
| **Notifications** | Firebase Cloud Messaging |

---

## 17. DESIGN DECISIONS

| Decision | Why |
|----------|-----|
| **Microservices** | Scalability, independent deployment, flexibility |
| **PostgreSQL + MongoDB** | Structured patient data + flexible recipes |
| **AWS** | Managed services, compliance-ready, auto-scaling |
| **React Native** | Single codebase, iOS + Android, fast time-to-market |
| **SHAP/LIME** | Doctor trust through transparency |
| **Grocer First** | Solves execution gap, defensible moat |
| **Mobile-First** | Household engagement, offline support |
| **Role-Based Access** | Security through data separation |

---

## 18. SUCCESS METRICS

| Metric | Target |
|--------|--------|
| **Plan Generation Time** | <2 minutes |
| **Adherence Rate** | 78% |
| **Biomarker Improvement** | 1.0-1.5% HbA1c drop in 90 days |
| **Cost per Patient/Month** | ₹50-100 |
| **Doctor Time Savings** | 70% (20 min → 2 min) |
| **System Uptime** | 99.5% |
| **Concurrent Users Supported** | 10,000+ |
| **Grocer Orders/Day/Patient** | 5-10 |
| **Patient Retention (Month 3)** | 85%+ |
| **Doctor Satisfaction (NPS)** | >50 |

---

## 19. TROUBLESHOOTING GUIDE

### Common Integration Issues

**Issue 1: Grocer API Returns 503 (Service Unavailable)**
```
Symptoms:
  - Orders failing to place
  - Error: "grocer_unavailable"
  
Diagnosis:
  1. Check grocer API status page
  2. Review CloudWatch logs for grocer service
  3. Check circuit breaker status (may be open)
  
Resolution:
  1. If grocer is down: Route to backup grocer
  2. If circuit breaker open: Wait for half-open state (5 min)
  3. If persistent: Contact grocer support, escalate to manual ordering
  
Prevention:
  - Monitor grocer API health proactively
  - Maintain 3+ grocer partnerships per city
  - Test failover weekly
```

**Issue 2: Meal Plan Generation Timeout**
```
Symptoms:
  - Plan generation takes >2 minutes
  - Doctor sees "Generation in progress..." indefinitely
  
Diagnosis:
  1. Check AI service CPU/memory usage
  2. Review patient complexity (number of diseases, constraints)
  3. Check food database query performance
  
Resolution:
  1. Retry with simplified constraints (fewer optimization passes)
  2. If still failing: Use template-based fallback plan
  3. Scale up AI service instances if CPU >80%
  
Prevention:
  - Set hard timeout at 180 seconds
  - Optimize food database indexes
  - Cache common query results
```

**Issue 3: Mobile App Not Syncing**
```
Symptoms:
  - Adherence logs not uploading
  - Meal plan shows "Last updated X hours ago"
  
Diagnosis:
  1. Check patient's network connectivity
  2. Review app logs for sync errors
  3. Check API Gateway rate limits
  
Resolution:
  1. If network issue: App will auto-retry when online
  2. If rate limit hit: Increase limit for patient
  3. If API error: Check backend service health
  
Prevention:
  - Implement exponential backoff for retries
  - Queue sync operations locally
  - Monitor sync success rate
```

**Issue 4: Payment Gateway Failure**
```
Symptoms:
  - Orders not placing due to payment failure
  - Error: "Payment processing failed"
  
Diagnosis:
  1. Check Razorpay API status
  2. Review payment logs for error codes
  3. Verify patient payment method validity
  
Resolution:
  1. Retry payment up to 3 times
  2. If still failing: Send payment link via email/SMS
  3. Hold order until payment confirmed
  
Prevention:
  - Monitor payment success rate
  - Alert patients before payment method expires
  - Maintain backup payment gateway
```

**Issue 5: Database Connection Pool Exhausted**
```
Symptoms:
  - API requests timing out
  - Error: "Connection pool exhausted"
  
Diagnosis:
  1. Check active database connections
  2. Review slow queries (>1s)
  3. Check for connection leaks
  
Resolution:
  1. Increase connection pool size (temporary)
  2. Kill long-running queries
  3. Restart service with connection leaks
  
Prevention:
  - Set connection timeout to 30s
  - Monitor connection pool usage
  - Optimize slow queries
```

### Performance Debugging

**Slow API Response:**
```
1. Check CloudWatch metrics for service CPU/memory
2. Review DataDog APM for slow database queries
3. Check Redis cache hit rate
4. Review API Gateway throttling logs

Common causes:
  - Database query not using index
  - Cache miss (cold cache)
  - High concurrent load
  - Network latency to external APIs
```

**High Error Rate:**
```
1. Check CloudWatch logs for error patterns
2. Review PagerDuty alerts for service failures
3. Check external API status (grocer, payment)
4. Review recent deployments (rollback if needed)

Common causes:
  - External API failure
  - Database connection issues
  - Code bug in recent deployment
  - Rate limiting
```

---

**END OF DESIGN.MD**
