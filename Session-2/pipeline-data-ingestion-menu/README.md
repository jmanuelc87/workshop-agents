# Menu Ingestion Pipeline

This project implements a data ingestion pipeline that processes a menu from a Markdown file, generates vector embeddings for each section using Google's Gemini API, and stores them in a Google Cloud Firestore database.

The pipeline is designed to run as a serverless function (e.g., Google Cloud Function) triggered by file uploads to a Cloud Storage bucket, but it can also be executed locally for development and testing.

## Prerequisites

- Python 3.10+
- [Poetry](https://python-poetry.org/) for dependency management.
- A Google Cloud Platform (GCP) project with the following APIs enabled:
  - Cloud Storage
  - Cloud Firestore
  - Vertex AI (for Gemini models)
- Authenticated `gcloud` CLI or a service account with appropriate permissions.

## Setup

1.  **Install Dependencies:**
    Clone the repository and install the required Python packages using Poetry.
    ```bash
    poetry install
    ```

2.  **Configure Environment:**
    Create a `.env` file in the root directory to store necessary environment variables:
    ```bash
    GOOGLE_API_KEY=your_gemini_api_key
    ```

3.  **Create Firestore Index:**
    Before ingesting data, you must create a composite index in Firestore to enable vector similarity search. Run the following command:
    ```bash
    gcloud firestore indexes composite create \
    --collection-group=menu \
    --query-scope=COLLECTION \
    --field-config field-path=embedding,vector-config='{"dimension": "768", "flat": "{}"}' \
    --database=embeddings
    ```

## Usage

### Local Execution

To run the ingestion process locally using the `resources/menu.md` file, execute the main script:

```bash
poetry run python src/ingestion_menu.py
```

### Cloud Deployment

The application can be deployed to Google Cloud Run with Eventarc integration to automatically trigger the ingestion pipeline when files are uploaded to a Cloud Storage bucket.

1.  **Configure Deployment:**
    Edit the `deploy-pipeline-ingestion.sh` script to set your GCP project details:
    - `PROJECT_ID`: Your GCP project ID
    - `PROJECT_NUMBER`: Your GCP project number
    - `AGENT_SERVICE_ACCOUNT`: Service account email with necessary permissions
    - `BUCKET`: Cloud Storage bucket name for file uploads

2.  **Deploy the Pipeline:**
    Run the deployment script:
    ```bash
    ./deploy-pipeline-ingestion.sh
    ```

    This script will:
    - Build a Docker image using Google Cloud Build
    - Deploy the image to Cloud Run
    - Create an Eventarc trigger that invokes the `/pipeline` endpoint when files are uploaded to the configured bucket

3.  **Upload Menu Files:**
    Upload menu files (Markdown format) to the configured Cloud Storage bucket to trigger automatic ingestion:
    ```bash
    gsutil cp resources/menu.md gs://your-bucket-name/
    ```

## Architecture

The pipeline follows these steps:

1. **Chunking:** The menu file is split into sections based on `##` headers (MenuCategory)
2. **Embedding Generation:** Each section is processed with Gemini's `gemini-embedding-001` model (768 dimensions)
3. **Storage:** Embeddings are stored in Firestore with the following structure:
   - `text_content`: Combined category and content
   - `embedding`: Vector representation (768 dimensions)
   - `timestamp`: Server-generated timestamp

## Endpoints

- **POST `/pipeline`**: Receives CloudEvents from Eventarc when files are uploaded to Cloud Storage
