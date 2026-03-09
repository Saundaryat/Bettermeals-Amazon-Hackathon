# HealthFab Agent Setup Guide

This guide details the prerequisites and steps required to set up and run the HealthFab Agent.

## 1. Prerequisites

Before starting, ensure you have the following installed and configured:

*   **Python 3.11+**
*   **AWS CLI**: Configured with valid credentials and a default region (e.g., `us-east-1`).
    ```bash
    aws configure
    ```
*   **Firebase Credentials**: A valid `serviceAccountKey.json` file from your Firebase Project console (Project Settings > Service Accounts > Generate new private key).

## 2. Installation

Clone the repository and install the dependencies:

```bash
pip install -r requirements.txt
```

## 3. Infrastructure Setup (One-Time)

We use a helper script to deploy the necessary AWS infrastructure (Cognito for Auth, Bedrock for Knowledge Base).

Run the prerequisite script:

```bash
# Deploys Cognito User Pool and Bedrock Knowledge Base
./scripts/prereq.sh
```

**What this does:**
1.  **Cognito**: Creates a User Pool and App Clients for authentication. Stores Client IDs in AWS SSM Parameter Store.
2.  **Bedrock Knowledge Base**: Creates an S3 bucket for documents and a Bedrock Knowledge Base connected to it. Stores the Knowledge Base ID in SSM (`/app/useragent/knowledge_base/knowledge_base_id`).

## 4. Configuration

The agent relies on **Firebase** for its database (Firestore). You must provide credentials via an environment variable.

### Set Firebase Credentials

The agent uses a centralized configuration system (`agent_config/config.py`) that checks for credentials in the following order:

1.  **AWS Secrets Manager** (Production/Cloud):
    *   The agent looks for a secret named `/app/healthfab/firebase_credentials` (override with `AWS_SECRET_NAME` env var).
    *   The secret value should be the **JSON content** of your `serviceAccountKey.json`.
    *   *Note*: Handles Base64 encoded secrets and newline replacement automatically.

2.  **Environment Variables** (Development):
    *   **Option A (File Path)**: Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your JSON key file.
        ```bash
        export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
        ```
    *   **Option B (Raw JSON)**: Set `FIREBASE_SERVICE_ACCOUNT_KEY` to the JSON string of your key.
    *   **Option C (Individual Fields)**: Set `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, etc. directly.

3.  **Application Default Credentials**: Fallback for Google Cloud environments.

## 5. Running the Agent

With the infrastructure deployed and credentials set, you can run the agent locally:

```bash
python main.py
```

## 6. Verification

To verify the setup:

1.  **Check startup logs**: Ensure `main.py` starts without error.
2.  **Test Tool Calls** (Optional): You can write a small script to verify Firestore connectivity:
    ```python
    from agent_config.tools.bettermeals.onboarding import get_onboarding_status
    print(get_onboarding_status("test-household-id"))
    ```
