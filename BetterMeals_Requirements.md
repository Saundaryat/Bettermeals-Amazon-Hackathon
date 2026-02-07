# BetterMeals: REQUIREMENTS.MD

## Product Requirements Document (PRD)

---

## TABLE OF CONTENTS
1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Success Criteria](#3-vision--success-criteria)
4. [Target Users & Personas](#4-target-users--personas)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [User Stories](#7-user-stories)
8. [Overall Acceptance Criteria](#8-overall-acceptance-criteria)
9. [Project Timeline](#9-project-timeline)
10. [Dependencies & Risks](#10-dependencies--risks)
11. [Success Metrics Dashboard](#11-success-metrics-dashboard)
12. [Glossary](#12-glossary)
13. [Out of Scope (v1.0)](#13-out-of-scope-v10)
14. [Approval & Sign-Off](#14-approval--sign-off)

---

## 1. EXECUTIVE SUMMARY

**Product Name:** BetterMeals - Autonomous AI Nutrition Copilot

**Version:** 1.0 MVP

**Last Updated:** January 24, 2026

**Status:** Development (Pre-Launch Pilot)

**Primary Goal:** Deliver personalized, clinically-grounded nutrition therapy at scale to 100M+ Indians with chronic diseases (diabetes, PCOS, IBS, thyroid, hypertension, autoimmune) by automating the complete household nutrition workflow—from biomarker analysis to meal planning to grocery delivery.

---

## 2. PROBLEM STATEMENT

### Current State
- **77 million Indians with Type 2 Diabetes** lack access to personalized nutrition therapy
- **20 million Indians with PCOS** have no tailored nutritional guidance
- **220 million Indians with hypertension** receive generic "eat healthy" advice
- **1 nutritionist per 100,000 people** in India (global average: 1 per 10,000)
- **Nutrition plan compliance: ~20%** because execution gaps (shopping, cooking, inventory) block adherence
- **Doctor time waste:** 20 minutes per patient on dietary counseling with vague, non-actionable advice

### Root Cause
Existing solutions fail at the execution gap:
- Patient apps suggest meals; patients must decide, shop, and cook (20% follow-through)
- Nutritionist services cost ₹5,000+/month (unaffordable for mass market)
- Hospital CDSS systems are generic, complex, require enterprise IT (not household-ready)
- No solution integrates doctor → patient → household → supply chain

### Why Now?
- **Digital Health Adoption:** Post-COVID, 65% of Indian households use health apps (up from 23% in 2019)
- **Grocer API Maturity:** BigBasket, Swiggy Instamart, Zepto now offer B2B APIs for automated ordering
- **AI Explainability:** SHAP/LIME libraries enable transparent clinical AI (critical for doctor trust)
- **Government Push:** NDHM (National Digital Health Mission) creating interoperable health data infrastructure
- **Market Gap:** Competitors (HealthifyMe, Fitterfly) focus on coaching, not household execution automation

---

## 3. VISION & SUCCESS CRITERIA

### Vision
Transform nutrition from vague advice into *autonomous household execution*, making personalized clinical nutrition accessible to 100M+ Indians at ₹50-100/month.

### Success Metrics
| Metric | Target | Evidence |
|--------|--------|----------|
| **Adherence Rate** | 78% (4X improvement) | Patient meal logging + household feedback |
| **Biomarker Improvement** | HbA1c drop 1.0-1.5% in 90 days | Lab reports at baseline, 90-day, 180-day |
| **Doctor Time Savings** | 70% (20 min → 2 min) | Clinician workflow logs |
| **Cost per Patient/Month** | ₹50-100 | Unit economics tracking |
| **Multi-Disease Coverage** | 6+ conditions (diabetes, PCOS, IBS, thyroid, hypertension, autoimmune) | Disease rule base coverage |
| **Household Execution Rate** | 80%+ (households follow plan without deviation) | Adherence tracking data |
| **Grocer Partnership Coverage** | 80%+ in pilot cities | Grocer network integrations |
| **Patient Retention** | 85% Month 3 (after pilot) | Churn analysis |

---

## 4. TARGET USERS & PERSONAS

### Primary User 1: Doctor / Nutritionist
- **Goal:** Generate personalized plans efficiently; maintain clinical oversight
- **Pain Point:** Spends 20 minutes per patient on dietary counseling with low impact
- **Key Need:** 2-minute plan generation + explainable AI + easy approval workflow
- **Acceptance Criteria:** Can generate & approve plan in <2 minutes; sees AI reasoning; tracks patient biomarkers

### Primary User 2: Household (Patient + Family)
- **Goal:** Follow nutrition plan without confusion or effort
- **Pain Points:** Don't know what to cook, where to shop, food spoilage, budget management
- **Key Need:** One app with meals, shopping, instructions, delivery tracking
- **Acceptance Criteria:** Receives groceries daily; follows daily plan without decisions; biomarkers improve

### Primary User 3: Grocer / Local Store
- **Goal:** Gain predictable customer orders and revenue
- **Pain Point:** Random customer shopping patterns; inconsistent demand
- **Key Need:** Automated daily orders; customer loyalty; margin opportunities
- **Acceptance Criteria:** Receives 5-10 orders/day per patient; margin increases 15%; customer retention improves

### Secondary User 4: Health System / Insurer
- **Goal:** Reduce preventable nutrition-related hospitalizations
- **Pain Point:** Current nutrition programs have low adherence; high re-admission rates
- **Key Need:** Measurable patient outcomes; cost reduction; scalable intervention
- **Acceptance Criteria:** ₹5-10K savings per patient/year; 40%+ reduction in nutrition-related admissions

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 Core: Autonomous Meal Plan Generation

**FR.1.1 - Biomarker Analysis Engine** [REQ-001]
- **Requirement:** System must analyze patient lab data (HbA1c, glucose, lipids, thyroid, kidney function, hormones) and identify disease-specific nutritional priorities
- **Input:** Lab report (PDF or structured data), diagnosis codes, existing conditions
- **Processing:** <2 minutes
- **Output:** Meal plan with clinical reasoning
- **Acceptance Criteria:** 
  - AI recommendations match ADA guidelines in 95% of diabetes cases (validated against 100 test cases)
  - AI recommendations match PCOS Society guidelines in 95% of PCOS cases
  - AI recommendations match IBS Society guidelines in 90% of IBS cases
  - Multi-disease cases (2+ conditions) achieve 90% guideline compliance across all conditions
  - Clinical reasoning provided for 100% of recommendations
  - Zero recommendations that contradict established clinical guidelines

**FR.1.2 - Multi-Disease Clinical Rules** [REQ-002]
- **Requirement:** System must generate optimal meal plans for patients with multiple concurrent diseases
- **Example:** Patient with diabetes + PCOS + hypertension → Single meal plan optimizing for all three
- **Coverage:** Minimum 6 conditions (diabetes, PCOS, IBS, thyroid, hypertension, autoimmune)
- **Acceptance Criteria:** 
  - Multi-disease overlap handled without conflicting recommendations
  - All conditions controlled equally (no prioritization of one disease over another)
  - Conflict resolution documented when food benefits one condition but harms another
  - 95% of multi-disease patients receive plans that meet all disease-specific guidelines simultaneously

**FR.1.3 - 37,000 Indian Food Database** [REQ-003]
- **Requirement:** System must recommend from 37,000+ Indian foods (regional cuisines, local availability, seasonal)
- **Data Elements:** Food name, calories, macros, micros, GI, cost, seasonal availability, regional cuisines
- **Update Frequency:** Weekly (pricing, seasonality)
- **Acceptance Criteria:** 
  - Recommendations are culturally appropriate (validated by regional nutritionists)
  - Locally available (80%+ of recommended foods available in patient's city)
  - Budget-aligned (total weekly cost within patient's specified budget)
  - Database covers all major Indian cuisines (North, South, East, West, Northeast)

**FR.1.4 - Meal Plan Generation** [REQ-004]
- **Requirement:** System must auto-generate personalized meal plans for 28 days (4 weeks)
- **Inputs:** Patient biomarkers, disease status, food preferences, allergies, budget, household size
- **Output:** Daily meal plan (breakfast, lunch, dinner, snacks) with nutritional breakdown
- **Customization:** Vegetarian/non-vegetarian, cuisine preferences, portion sizes
- **Acceptance Criteria:** 
  - Plans meet clinical targets (e.g., HbA1c control within 90 days)
  - Patient preferences respected (95%+ of meals match stated preferences)
  - Within budget (100% of plans within ±10% of patient's budget)
  - Meal variety (no meal repeated within 28-day cycle)
  - Nutritional balance maintained across all 28 days

---

### 5.2 Core: Household-Integrated Execution Workflow

**FR.2.1 - Personalized Shopping List Generation** [REQ-005]
- **Requirement:** System must generate shopping lists from meal plan with exact quantities, local store mapping, budget optimization
- **Output:** Organized by food type (vegetables, grains, proteins, oils) with quantities, prices, local store options
- **Dynamic Pricing:** Integrates with grocer APIs for real-time pricing; adjusts recommendations if prices spike
- **Seasonal Optimization:** Recommends in-season foods (cheaper, fresher)
- **Edge Cases Handled:**
  - Out of stock items: Automatically substitute with nutritionally equivalent alternatives
  - Price spikes (>20% increase): Notify patient and suggest alternatives
  - Grocer unavailability: Route to backup grocer or manual shopping list
- **Acceptance Criteria:** 
  - Shopping list totals within patient budget (100% of cases)
  - Items available in 80%+ of local stores
  - Substitutions maintain nutritional equivalence (±5% variance in key nutrients)
  - Real-time pricing updated within 1 hour of grocer API changes

**FR.2.2 - Step-by-Step Cooking Instructions** [REQ-006]
- **Requirement:** System must generate daily cooking instructions matched to meal plan
- **Content:** Ingredient quantities, cooking steps, timing, temperature, portion sizes, nutritional breakdown per meal
- **Format:** Mobile-friendly, simple language, video links optional
- **Adaptability:** Adjust for household's cooking skill level (beginner/intermediate/advanced)
- **Acceptance Criteria:** Household cook can follow instructions without nutritionist knowledge; meals prepared correctly in <30 minutes

**FR.2.3 - Grocer Integration & Auto-Ordering** [REQ-007]
- **Requirement:** System must automatically place orders with integrated local grocers
- **Process:** AI generates shopping list → connects to grocer API → auto-places order → confirms delivery
- **Grocer Partners:** Minimum 3 grocer chains/networks per pilot city (e.g., Fresh Stores, BigBasket, local shops)
- **Delivery:** Next-day or same-day depending on grocer
- **Inventory Management:** System tracks delivered items; prevents over-ordering
- **Cost to Patient:** ₹50-100/month including grocer commission (5-10%)
- **Edge Cases Handled:**
  - Patient traveling: Pause orders automatically (patient sets travel dates)
  - Eating out: Allow patient to skip specific meals; adjust shopping accordingly
  - Delivery failure: Retry with backup grocer; notify patient within 1 hour
  - Address change: Update delivery address with 24-hour notice
- **Acceptance Criteria:** 
  - Orders placed automatically (100% success rate for API-connected grocers)
  - Delivery confirmed (95%+ on-time delivery rate)
  - No patient action needed (zero-touch ordering)
  - Cost under ₹100/month (including all fees and commissions)
  - Delivery failure resolution within 4 hours

**FR.2.4 - Household App Interface** [REQ-008]
- **Requirement:** System must provide mobile app showing daily meal plan, shopping list, cooking instructions
- **Screens:** Today's meals → shopping status → cooking instructions → adherence logging
- **Updates:** Push notifications for daily plans, delivery arrival, preparation reminders
- **Language:** English + regional languages (Hindi, Tamil, Kannada, Telugu, Bengali)
- **Accessibility:** Large text, simple icons, works on older phones (Android 5.0+)
- **Acceptance Criteria:** Household can navigate app and follow daily plan without training

---

### 5.3 Core: Explainable Clinical AI

**FR.3.1 - SHAP/LIME Explainability** [REQ-009]
- **Requirement:** System must show doctors exactly WHY each meal recommendation was made
- **Format:** "HbA1c 8.2% → low-GI priority → recommend brown rice + lentils → expected HbA1c drop to 7.2% in 90 days"
- **Transparency:** Show feature importance (which biomarkers drove the recommendation)
- **Verification:** Doctor sees clinical reasoning; can approve, modify, or reject
- **Acceptance Criteria:** Doctor sees transparent reasoning for 100% of recommendations; trust score improves (measured via survey: ≥4/5)

**FR.3.2 - Doctor Approval Workflow** [REQ-010]
- **Requirement:** System must require doctor/nutritionist approval before household receives plan
- **Time to Approve:** <2 minutes per plan
- **Actions:** Approve as-is, modify specific meals, reject with reasoning
- **CDSSS Compliance:** Positioned as "Clinical Decision Support Software" - supplementary, not autonomous diagnosis
- **Audit Trail:** All approvals/modifications logged for compliance
- **Acceptance Criteria:** Doctor approves 80%+ of plans within 2 minutes; modifications tracked

---

### 5.4 Clinical Oversight & Monitoring

**FR.4.1 - Adherence Tracking** [REQ-011]
- **Requirement:** System must track household adherence to meal plan
- **Input:** Household logs meals eaten (or optional auto-sync with payment data if available)
- **Measurement:** % meals followed correctly
- **Alerts:** If adherence drops <70%, notify doctor for re-engagement
- **Acceptance Criteria:** Adherence tracked with ≥80% accuracy; alerts sent within 1 day

**FR.4.2 - Biomarker Monitoring** [REQ-012]
- **Requirement:** System must track patient biomarker improvements over time
- **Input:** Lab reports at baseline, 90-day, 180-day checkpoints
- **Display:** Dashboard showing HbA1c trend, expected vs. actual improvement
- **Outcome Prediction:** "Current adherence suggests HbA1c will reach 7.0% by Day 120"
- **Acceptance Criteria:** Predictions within ±0.5% of actual biomarker values

**FR.4.3 - Plan Adjustment** [REQ-013]
- **Requirement:** System must adjust meal plans if adherence drops or biomarkers stall
- **Triggers:** <70% adherence, no biomarker improvement after 45 days
- **Adjustment:** Generate new meal plan with different foods, simpler recipes, or budget adjustments
- **Doctor Review:** New plan submitted for doctor approval
- **Acceptance Criteria:** Re-generated plans approved within 1 day; improve adherence to 80%+

---

### 5.5 Multi-Disease Support

**FR.5.1 - Disease-Specific Rules Engine** [REQ-014]
- **Requirement:** System must apply disease-specific nutritional rules
- **Diseases Supported (MVP):** Type 2 Diabetes, PCOS, IBS, Thyroid disorders, Hypertension, Autoimmune disorders
- **Example Rules:**
  - Diabetes: Low GI <55, high fiber >25g, portion control
  - PCOS: Anti-inflammatory, hormone-balancing foods, low FODMAP consideration
  - IBS: Gut-friendly, low FODMAP, high fiber gradual increase
  - Thyroid: Iodine, selenium, iron support, gluten consideration
  - Hypertension: <5g sodium/day, potassium-rich foods
  - Autoimmune: Anti-inflammatory, elimination diet support
- **Acceptance Criteria:** Each disease-specific meal plan meets clinical guidelines (ADA, PCOS Society, etc.)

**FR.5.2 - Multi-Disease Optimization** [REQ-015]
- **Requirement:** System must generate single meal plan optimizing for multiple concurrent diseases
- **Conflict Resolution:** If food is good for diabetes but bad for PCOS, choose compromise or alternative
- **Example:** Patient with diabetes + hypertension → plan is low-GI AND low-sodium
- **Acceptance Criteria:** All disease biomarkers controlled equally; no conflicting recommendations

---

### 5.6 Allergy, Intolerance, and Preference Management

**FR.6.1 - Allergy & Intolerance Input** [REQ-016]
- **Requirement:** System must exclude foods causing allergies, intolerances, or dislikes
- **Input Process:** Doctor/ASHA checks during initial assessment: "Dairy allergy?" "Nut intolerance?" "Don't like bitter gourd?"
- **Exclusion:** AI removes those foods from 37K database
- **Continuous Learning:** If household reports reaction to recommended food, system learns and excludes future
- **Acceptance Criteria:** Zero allergic reactions to recommended meals; patient satisfaction ≥4/5

**FR.6.2 - Food Preferences** [REQ-017]
- **Requirement:** System must respect vegetarian/non-vegetarian, cuisine, and cultural preferences
- **Input:** Household specifies preferences before plan generation
- **Customization:** Meals aligned to preferences while maintaining nutritional targets
- **Acceptance Criteria:** 95%+ of recommended foods accepted by household

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance
- **Plan Generation Time:** <2 minutes from lab data upload to final meal plan (95th percentile)
- **Shopping List Generation:** <30 seconds (99th percentile)
- **App Load Time:** <3 seconds on 4G networks (median)
- **Grocer Order Placement:** <5 seconds (API integration latency, 95th percentile)
- **Concurrent Users:** Support 100K concurrent users during peak hours (8-10 AM, 6-8 PM)
- **API Response Time:** <500ms for 95% of requests, <2s for 99% of requests

### 6.2 User Experience
- **Error Handling:** User-friendly error messages in local language; no technical jargon
- **Offline Mode:** Household app must work offline for viewing today's meals and cooking instructions
- **Accessibility:** WCAG 2.1 Level AA compliance; screen reader support; minimum touch target 44x44px
- **Network Resilience:** App functions on 2G/3G networks with graceful degradation
- **Loading States:** Show progress indicators for all operations >2 seconds
- **Error Recovery:** Auto-retry failed operations (max 3 attempts); provide manual retry option

### 6.2 Scalability
- **Addressable Market:** 100M+ Indians (multi-disease)
- **Geographic Scaling:** Start with 3 pilot cities (Bangalore, Delhi, Mumbai); scale to 50+ cities by Year 2
- **Grocer Network:** Minimum 3 grocer partners per city; scale to 10+ per city
- **Data Storage:** Support 10M+ patient records (with growth to 100M by Year 3)

### 6.3 Security & Privacy
- **Data Encryption:** All patient health data encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Data Isolation:** Patient health data NOT shared with grocers (only anonymized order data)
- **HIPAA Compliance:** Follow HIPAA-equivalent standards (India does not have HIPAA, but we adopt similar principles)
- **Data Retention:** Patient data retained for minimum 7 years post-discharge
- **Access Control:** Role-based access (doctors see health data, grocers see only order data, patients see own plans)
- **Audit Logging:** All data access logged; compliance audits quarterly

### 6.4 Reliability & Availability
- **Uptime:** 99.5% availability (max 3.6 hours downtime/month)
- **Failover:** Automatic failover to backup systems within 5 minutes
- **Data Backup:** Daily backups; 30-day retention for recovery
- **Disaster Recovery:** RTO (Recovery Time Objective): 4 hours; RPO (Recovery Point Objective): 1 hour

### 6.5 Compliance & Regulatory
- **Positioning:** Clinical Decision Support Software (CDSSS) - supplementary to doctor, not autonomous diagnosis
- **Doctor Oversight:** Doctor must approve all meal plans before household receives them
- **Data Governance:** Comply with India's Digital Health Framework, NDHM guidelines
- **Clinical Validation:** Plans validated against clinical guidelines (ADA, PCOS Society, IBS Society, etc.)
- **Quality Standards:** ISO 27001 (security), ISO 13485-equivalent (medical device standards)

### 6.6 Integration Requirements
- **Grocer APIs:** Integration with grocer order management systems (custom APIs for each grocer)
- **Lab Integration:** Accept PDF lab reports + structured data (HL7, FHIR format preferred)
- **Wearable Ready:** Future integration with CGMs (Continuous Glucose Monitors), smart scales (not MVP)
- **Payment Gateway:** Secure payment processing for patient subscriptions + grocer commissions

---

## 7. USER STORIES

### Story 1: Doctor Generates Meal Plan
**As a** doctor treating a patient with Type 2 Diabetes
**I want to** generate a personalized meal plan in <2 minutes
**So that** I can serve 100+ patients instead of 20 and provide clinically sound nutritional therapy at scale

**Acceptance Criteria:**
- [ ] Doctor uploads lab report or enters HbA1c manually
- [ ] AI analyzes biomarkers in <2 minutes
- [ ] System generates meal plan with reasoning visible
- [ ] Doctor reviews SHAP/LIME explanation
- [ ] Doctor approves or modifies plan
- [ ] Plan sent to household

---

### Story 2: Household Receives Daily Meals & Groceries
**As a** household member cooking for family with diabetes
**I want to** receive daily meals, groceries, and cooking instructions automatically
**So that** I don't have to think about "what to cook" and can focus on health improvement

**Acceptance Criteria:**
- [ ] Open app → see today's breakfast, lunch, dinner with images
- [ ] See shopping list with items being delivered today
- [ ] Receive groceries at doorstep (auto-ordered yesterday)
- [ ] Follow step-by-step cooking instructions
- [ ] Log that meal was eaten (adherence)
- [ ] See next day's meals

---

### Story 3: Grocer Receives Predictable Orders
**As a** local grocer integrated with BetterMeals
**I want to** receive 5-10 predictable daily orders from patients on the platform
**So that** I can optimize inventory, reduce spoilage, and earn consistent revenue

**Acceptance Criteria:**
- [ ] BetterMeals API sends orders automatically at 8 PM for next-day delivery
- [ ] Orders specify exact quantities (no guessing)
- [ ] 80%+ delivery rate (automated + human oversight)
- [ ] Earn 5-10% commission on fulfilled orders
- [ ] Customer churn reduced (patients subscribe for long term)

---

### Story 4: Patient Tracks Biomarker Improvement
**As a** patient with diabetes on BetterMeals
**I want to** see my HbA1c drop from 8.2% to 7.2% over 90 days
**So that** I'm motivated to continue adhering and see real health improvement

**Acceptance Criteria:**
- [ ] Baseline HbA1c recorded (8.2%)
- [ ] Daily adherence tracked (78% eating as planned)
- [ ] 90-day follow-up shows HbA1c 7.2% (1% drop)
- [ ] App shows trend graph
- [ ] Doctor receives outcome notification

---

## 8. OVERALL ACCEPTANCE CRITERIA

The product is complete when:

1. ✅ **Autonomous Meal Planning Works**
   - System generates 100 meal plans with 95%+ clinical accuracy (validated against clinical guidelines)
   - Doctor reviews and approves in <2 minutes each (measured via workflow logs)
   - Household receives meal plan within 1 hour of doctor approval (end-to-end latency)
   - **Test Scenario:** Generate 100 meal plans for diverse patient profiles; validate against ADA/PCOS/IBS guidelines; measure doctor approval time

2. ✅ **Household Integration Works**
   - Shopping list generated automatically from meal plan (100% success rate)
   - Grocers receive auto-orders (95%+ successful order placement)
   - Groceries delivered to household doorstep (95%+ on-time delivery)
   - Household follows daily cooking instructions (measured via adherence logging)
   - 78% adherence achieved in pilot (vs. 20% baseline)
   - **Test Scenario:** Run 50 patients through full cycle (plan → shop → deliver → cook); measure adherence weekly

3. ✅ **Explainability Works**
   - Doctors see reasoning for every recommendation (100% of plans include SHAP/LIME explanations)
   - Trust survey shows ≥4/5 satisfaction (measured via post-approval survey)
   - No black-box AI; all decisions transparent (audit trail for every recommendation)
   - **Test Scenario:** Survey 50 doctors after reviewing 10 plans each; measure trust score and comprehension

4. ✅ **Multi-Disease Support Works**
   - 6+ chronic diseases covered (diabetes, PCOS, IBS, thyroid, hypertension, autoimmune)
   - Patients with multiple conditions receive optimized single meal plan (no conflicting recommendations)
   - All disease biomarkers controlled equally (measured via 90-day lab follow-up)
   - **Test Scenario:** Generate plans for 30 multi-disease patients; validate no conflicts; track biomarker improvements

5. ✅ **Clinical Outcomes Achieved**
   - Biomarker improvements: HbA1c drop ≥1% (measured at 90-day follow-up)
   - Weight reduction ≥3kg (measured at 90-day follow-up)
   - 80%+ of patients see measurable improvement at 90 days
   - 85%+ month-3 retention rate (churn analysis)
   - **Test Scenario:** Track 100 pilot patients for 90 days; measure biomarkers at baseline, 45-day, 90-day

6. ✅ **Grocer Integration Works**
   - 3+ grocer partners in each pilot city (signed agreements)
   - 5-10 orders/day per patient (order volume tracking)
   - <5% order fulfillment failure rate (delivery success tracking)
   - Grocer margin improves ≥15% (grocer revenue analysis)
   - **Test Scenario:** Monitor 500 orders across 3 grocers; track success rate, delivery time, grocer satisfaction

7. ✅ **Unit Economics Work**
   - Cost per patient/month: ₹50-100 (including grocer commission, cloud, staff)
   - Revenue per patient/month: ₹100-200 (B2B insurance, B2C subscription)
   - Gross margin: ≥50% at scale (100K+ patients)
   - **Test Scenario:** Track costs for 500 pilot patients; project to 100K scale; validate margin assumptions

8. ✅ **Compliance & Security**
   - Zero patient data breaches (security audit)
   - 100% HIPAA-equivalent compliance (compliance audit)
   - Quarterly security audits passed (penetration testing)
   - **Test Scenario:** Conduct security audit; penetration testing; compliance review before launch

---

## 9. PROJECT TIMELINE

### Phase 1: MVP Development (Months 1-4)
- [ ] Biomarker analysis engine
- [ ] Multi-disease clinical rules
- [ ] Indian food database (37K foods)
- [ ] Doctor dashboard + approval workflow
- [ ] Household app (mobile)
- [ ] Grocer API integrations (3 partners)
- [ ] Security & compliance setup

### Phase 2: Pilot Launch (Months 5-6)
- [ ] Recruit 500 patients across 3 cities
- [ ] Train doctors and grocers
- [ ] Operational support setup
- [ ] Data collection and monitoring

### Phase 3: Validation & Scale (Months 7-9)
- [ ] Analyze clinical outcomes (adherence, biomarker improvements)
- [ ] Gather feedback from users
- [ ] Refine based on learnings
- [ ] Prepare for scale to 10+ cities

### Phase 4: Scale (Months 10-12)
- [ ] Deploy to 10+ cities
- [ ] 10,000+ active patients
- [ ] Full grocer network coverage

---

## 10. DEPENDENCIES & RISKS

### Dependencies
1. **Grocer Partnerships:** Requires signed agreements with grocer chains before launch
2. **Doctor Recruitment:** Need 50+ doctors in pilot cities to generate demand
3. **Data Access:** Need access to ICMR food composition database and clinical guidelines
4. **Regulatory Approval:** May require health ministry clearance (TBD)

### Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Grocer integration delays | Medium | High | Start integration 3 months before launch; have fallback manual ordering |
| Low doctor adoption | Medium | High | Free trial + CME credits for doctors; early adopter program |
| Patient adherence lower than 78% | Low | High | Incentive program + family engagement features |
| Biomarker improvements don't materialize | Low | Critical | Pilot with 100 patients first; validate clinical model before scale |
| Data privacy breach | Low | Critical | ISO 27001 certification; quarterly penetration testing |
| Competition from HealthifyMe/Fitterfly | Medium | Medium | Focus on doctor integration + grocer partnerships (harder to copy) |

---

## 11. SUCCESS METRICS DASHBOARD

| KPI | Baseline | Target (Month 6) | Target (Month 12) |
|-----|----------|-----------------|------------------|
| Active Patients | 0 | 500 | 10,000 |
| Adherence Rate | 20% (apps) | 78% | 80%+ |
| Biomarker Improvement (HbA1c) | N/A | 1.0% drop | 1.5% drop |
| Doctor Time Savings | 20 min | 2 min | 2 min |
| Cost per Patient/Month | ₹5,000 | ₹75 | ₹60 |
| Grocer Orders/Day/Patient | 0 | 1 | 1.2 |
| Grocer Partner Count | 0 | 3/city | 8/city |
| Monthly Churn Rate | N/A | <10% | <5% |
| Doctor Satisfaction (NPS) | N/A | >50 | >70 |
| Patient Satisfaction (NPS) | N/A | >40 | >60 |

---

## 12. GLOSSARY

**Adherence:** Percentage of prescribed meals that the household actually prepares and consumes as planned. Measured via patient logging in the mobile app.

**Biomarker:** Measurable biological indicator of health status (e.g., HbA1c for diabetes, hormone levels for PCOS, blood pressure for hypertension).

**CDSSS (Clinical Decision Support Software System):** Software that assists doctors in making clinical decisions but does not autonomously diagnose or prescribe. Requires doctor approval.

**GI (Glycemic Index):** Measure of how quickly a food raises blood glucose levels. Low GI (<55) is preferred for diabetes management.

**Household:** The primary cooking unit, typically including the patient and family members who prepare meals. Used consistently throughout this document instead of "family" or "patient's home."

**SHAP/LIME:** Explainable AI techniques that show which factors (biomarkers, preferences) influenced each recommendation, enabling doctor trust and verification.

**Multi-Disease Optimization:** Process of generating a single meal plan that simultaneously addresses multiple chronic conditions without conflicting recommendations.

**Grocer API:** Application Programming Interface that allows BetterMeals to automatically place orders with grocery stores and track delivery status.

**Plan Duration:** The time period covered by a generated meal plan. Default is 28 days (4 weeks) to ensure meal variety.

**Adherence Rate:** Percentage of meals followed correctly. Target: 78% (vs. 20% baseline for traditional nutrition apps).

---

## 13. OUT OF SCOPE (v1.0)

The following features are explicitly excluded from the MVP and will be considered for future releases:

**Not Included in v1.0:**
- ❌ Wearable device integration (CGMs, smart scales, fitness trackers)
- ❌ Restaurant meal recommendations (eating out scenarios)
- ❌ Social features (meal sharing, community forums, patient-to-patient chat)
- ❌ Recipe customization by patients (all recipes are clinically validated)
- ❌ Meal kit delivery (pre-portioned ingredients)
- ❌ Video consultations with nutritionists
- ❌ Calorie tracking from photos (AI food recognition)
- ❌ Integration with hospital EMR systems (beyond lab report upload)
- ❌ Pediatric nutrition (focus on adults 18+ only)
- ❌ Pregnancy/lactation nutrition (specialized requirements)
- ❌ Rare diseases beyond the 6 core conditions
- ❌ International cuisines (focus on Indian foods only)
- ❌ Supplement recommendations (food-only approach)
- ❌ Exercise/fitness integration (nutrition-only focus)

**Why These Are Out of Scope:**
- Complexity: Each adds significant technical and clinical complexity
- Focus: MVP must prove core value proposition (autonomous household execution)
- Validation: Need to validate clinical outcomes before expanding scope
- Resources: Limited development time and budget for v1.0

**Future Consideration:**
These features will be prioritized based on pilot feedback, clinical outcomes, and user demand in v2.0 and beyond.

---

## 14. APPROVAL & SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | - | - | - |
| Tech Lead | - | - | - |
| Clinical Advisor | - | - | - |
| Business Lead | - | - | - |

---

**END OF REQUIREMENTS.MD**

