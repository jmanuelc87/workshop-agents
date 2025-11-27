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
    Create a `.env` file in the root directory to store necessary environment variables, such as your GCP project details.

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

The application includes a Flask web server and can be deployed as a Google Cloud Function. It is configured to listen for `POST` requests at the `/pipeline` endpoint, which should be triggered by a file upload event in a configured Google Cloud Storage bucket.

```