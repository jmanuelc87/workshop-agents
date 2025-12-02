#!/bin/bash
set -e

PROJECT_ID="devhack-3f0c2"

AGENT_SERVICE_ACCOUNT="agents@${PROJECT_ID}.iam.gserviceaccount.com"

# Cloud Run service name for the AGENT
MCP_SERVICE_NAME="mcp-menu"

REGION="us-central1"

# Docker image name for the agent
MCP_IMAGE_NAME="gcr.io/${PROJECT_ID}/${MCP_SERVICE_NAME}"

# --- Build and Deploy Agent ---
echo "Building agent Docker image: ${MCP_IMAGE_NAME}"
gcloud builds submit --tag "${MCP_IMAGE_NAME}" . --project "${PROJECT_ID}"

echo "Deploying agent to Cloud Run service: ${MCP_SERVICE_NAME}"
gcloud run deploy "${MCP_SERVICE_NAME}" \
    --image "${MCP_IMAGE_NAME}" \
    --service-account "${AGENT_SERVICE_ACCOUNT}" \
    --update-secrets GOOGLE_API_KEY=GOOGLE_GENAI_API_KEY:latest \
    --platform "managed" \
    --region "${REGION}" \
    --allow-unauthenticated \
    --project "${PROJECT_ID}"

MCP_SERVICE_URL=$(gcloud run services describe "${MCP_SERVICE_NAME}" --platform "managed" --region "${REGION}" --project "${PROJECT_ID}" --format="value(status.url)")

echo -e "\nAgent deployment successful!"
echo "Your agent is available at: ${MCP_SERVICE_URL}"
