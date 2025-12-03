# Barista Multi-Agent System

This project implements a sophisticated multi-agent system that simulates the interactions within a coffee shop. The system uses a combination of specialized AI agents, a semantic search server, and Google Cloud services to provide a rich, interactive user experience.

## System Architecture

The system is designed around a central orchestrator that delegates tasks to a team of specialist agents. This hierarchical structure allows for clear separation of concerns and makes the system extensible.

The flow of a user request is as follows:

1.  **User Interaction**: The user sends a query to the system.
2.  **Orchestrator Agent**: This agent acts as the front door. It analyzes the user's intent and routes the request to the most appropriate specialist.
3.  **Specialist Agents**: Each specialist handles a specific domain:
    *   **Head Barista Agent**: Manages menu inquiries, ingredient details, and stock availability.
    *   **Creative Director Agent**: Handles visual requests, such as generating images of coffee, and provides information on daily promotions.
    *   **Market Analyst Agent**: Analyzes global search trends and popularity data to provide data-driven drink recommendations based on real-world Wikipedia pageview statistics.
4.  **Tools & Services**: The agents use a set of tools to perform their tasks. This includes:
    *   Direct API calls to Google Cloud services (for image generation)
    *   **Menu Control Protocol (MCP) Server** for semantic menu searches
    *   **MCP Toolbox for Database** that provides access to BigQuery for global trend analysis
5.  **Backend Services**: The entire system is supported by Google Cloud Platform services, including:
    *   **Google Gemini**: Powers the reasoning for all agents and generates text embeddings for semantic search.
    *   **Google Imagen**: Generates photorealistic images of coffee.
    *   **Google Cloud Firestore**: Stores the menu data, including vector embeddings for similarity search.
    *   **Google Cloud Storage**: Hosts the generated coffee images.

## 🧑🏽‍💻 Design Overview

###  Context Diagram
<img width="761" height="691" alt="Barista Agent System drawio" src="https://github.com/user-attachments/assets/41c8fb3a-ae36-439b-a3be-33d34a4c0f11" />

### Container Diagram
<img width="1136" height="1201" alt="Barista Agent System - Container Diagram drawio" src="https://github.com/user-attachments/assets/14c166c1-6b9c-49ad-9a12-613a52ad45f5" />

### Component Diagram
<img width="1351" height="1021" alt="Barista Agent System - Component Diagram drawio" src="https://github.com/user-attachments/assets/6f526e65-66a1-4d82-bf04-ab99468dae49" />

---

## Components

### 1. Orchestrator Agent
- **File**: `agents/orchestrator_agent/agent.py`
- **Description**: The main entry point and router. It determines the user's intent (e.g., asking about the menu vs. asking for a picture) and delegates the task to the correct specialist agent. It does not answer user queries directly.

### 2. Head Barista Agent
- **File**: `agents/head_barista_agent/agent.py`
- **Description**: The coffee expert. This agent provides detailed descriptions of menu items, including ingredients and pricing. It also checks for product availability.
- **Key Tools**:
    - `check_availability_coffee()`: Checks a mock schedule to see if a coffee is available.
    - `MCPToolset()`: Connects to the external `MCP-Server` to fetch menu items based on semantic similarity.

### 3. Creative Director Agent
- **File**: `agents/creative_director_agent/agent.py`
- **Description**: The marketing and visual specialist. This agent is responsible for creating an engaging visual experience and communicating promotions.
- **Key Tools**:
    - `create_image_coffee()`: Generates a coffee image using Google's Imagen model and uploads it to Cloud Storage.
    - `get_current_promotion()`: Retrieves the daily special from a mock list.
    - `get_menu_items()`: Directly queries the Firestore database to get visual details for building high-quality image generation prompts.

### 4. Market Analyst Agent
- **File**: `agents/market_analyst_agent/agent.py`
- **Description**: The data and trends specialist. This agent analyzes global coffee popularity using real-time Wikipedia pageview data to provide data-driven recommendations.
- **Key Tools**:
    - **MCP Toolbox for Database**: Connects to a Toolbox server that exposes BigQuery tools for querying Wikipedia pageview trends.
    - `drink_trend`: A BigQuery SQL tool that retrieves popularity scores for coffee-related search terms over the last 30 days.
- **Configuration**: Requires a `TOOLBOX_URL` environment variable pointing to the running Toolbox server (default: `http://localhost:6000`).

### 5. MCP Server (Menu Control Protocol)
- **File**: `MCP-Server/menu_mcp/server.py`
- **Description**: A standalone server built with `FastMCP`. It exposes a single tool, `get_menu_items`, which performs a semantic vector search on the menu. It takes a natural language query (e.g., "a warm, comforting drink"), converts it to a Gemini embedding, and finds the most similar items in the Firestore database.

### 6. MCP Toolbox for Database
- **File**: `agents/market_analyst_agent/tools/tools.yaml`
- **Description**: A YAML configuration file that defines database connections and SQL tools for the Toolbox server. It connects to BigQuery's public Wikipedia dataset to analyze global search trends.
- **Toolset**: `drinks_toolset` includes:
    - `bigquery_get_table_info`: Retrieves table metadata.
    - `bigquery_list_table_ids`: Lists available tables.
    - `drink_trend`: Custom SQL query that returns popularity scores for coffee terms based on Wikipedia pageviews from the last 30 days.

---

## Technology Stack

- **Programming Language**: Python
- **AI Framework**: Google Agent Development Kit (ADK)
- **AI Models**: Google Gemini (for reasoning and embeddings), Google Imagen (for image generation)
- **Database**: Google Cloud Firestore (for menu and vector embeddings)
- **Storage**: Google Cloud Storage (for generated images)
- **Server**: FastMCP for the semantic search tool server

---

## Setup and Installation

### Prerequisites
- Python 3.10+
- [Poetry](https://python-poetry.org/) for dependency management.
- A Google Cloud Platform project with the following APIs enabled:
    - AI Platform API
    - Cloud Firestore API
    - Cloud Storage API
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated.

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd barista-agent-system
    ```

2.  **Install dependencies:**
    ```bash
    poetry install
    ```

3.  **Authenticate with Google Cloud:**
    Log in for application-default credentials.
    ```bash
    gcloud auth application-default login
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following variables. You will also need to create a `.env` file in each agent's directory (`head_barista_agent`, `creative_director_agent`, `orchestrator_agent`, `market_analyst_agent`) and in the `MCP-Server/menu_mcp` directory.
    
    **Base configuration** (for all agents):
    ```env
    # Google Cloud Project ID
    PROJECT_ID="your-gcp-project-id"

    # Name of the LLM model to use for agent reasoning (e.g., "gemini-1.5-pro-001")
    LLM_AGENT="gemini-1.5-pro-001"

    # Name of the image generation model
    MODEL_IMAGEN="image-generation-001"

    # Name of the Google Cloud Storage bucket for images
    GCS_BUCKET_NAME="your-gcs-bucket-name"
    ```
    
    **Additional configuration for Market Analyst Agent** (`agents/market_analyst_agent/.env`):
    ```env
    # URL of the MCP Toolbox server for database access
    TOOLBOX_URL="http://localhost:6000"
    ```

5.  **Set up Firestore:**
    - Ensure you have a Firestore database in your GCP project.
    - Create a collection named `menu`.
    - Each document in the `menu` collection must have two fields:
        - `text_content` (string): A descriptive text of the menu item (e.g., "Mocha Magic: A rich blend of dark chocolate and bold espresso, topped with whipped cream and a chocolate drizzle.").
        - `embedding` (vector): The Gemini-generated text embedding of the `text_content`.
