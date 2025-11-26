# Menu Search Service with AI

This project is a server that provides a smart way to search for menu items. It uses Artificial Intelligence, specifically Google's Gemini model, to understand the meaning behind a search query and find the most relevant items from a menu stored in a Google Cloud Firestore database.

## Description

The server is built using the `FastMCP` framework. It exposes a single tool, `get_menu_items`, which takes a type of coffee as input (e.g., "a morning coffee") and returns a list of the most similar coffee options available on the menu.

This is achieved by converting the input text into a mathematical representation (an embedding) using the Gemini AI model. This embedding is then used to perform a vector search against a collection of pre-embedded menu items in Firestore, ensuring that the results are based on semantic meaning rather than just keywords.

## Technology Stack

*   **Server Framework:** FastMCP
*   **Database:** Google Cloud Firestore (for storing menu items and their vector embeddings)
*   **AI & Embeddings:** Google Gemini (`gemini-embedding-001` model)
*   **Language:** Python

## Getting Started

### Prerequisites

*   Python 3.x
*   Google Cloud SDK installed and authenticated. You need to have a Google Cloud project with Firestore and the AI Platform APIs enabled.
*   Set up Application Default Credentials for Google Cloud. You can do this by running:
    ```bash
    gcloud auth application-default login
    ```

### Installation

1.  Install the required Python libraries. You can do this using pip:
    ```bash
    pip install google-cloud-firestore google-generativeai python-dotenv FastMCP
    ```
    *(Note: The installation method for `FastMCP` is assumed. Please refer to its official documentation if this is incorrect.)*

2.  Ensure your menu items are populated in a Firestore collection named `menu`. Each document in this collection should have a `text_content` field with the item's description and an `embedding` field containing the vector embedding of that description.

### Configuration

This project uses a `.env` file to manage environment variables, which is loaded at startup. While the provided code doesn't show specific variables being used, it's a common practice to store sensitive information like `GOOGLE_APPLICATION_CREDENTIALS` path or project IDs in this file.

## Usage

To run the server, execute the Python script:

```bash
python your_server_file.py
```

The server will start on port 9000.

## Inspecting the Server

Once the server is running, you can use the Model Context Protocol Inspector to view the server's tools and their schemas. Run the following command in your terminal:

```bash
npx @modelcontextprotocol/inspector
```

This will launch a web-based interface that connects to your local server and allows you to inspect its capabilities.

## API / Tools

### `get_menu_items(type_coffee: str)`

This is the main function exposed by the server.

*   **Description:** It finds and returns a list of menu items that are semantically similar to the input coffee type.
*   **Arguments:**
    *   `type_coffee` (str): A string describing the kind of coffee you are looking for.
*   **Returns:** A list of strings, where each string is the `text_content` of a matching menu item from the database.
