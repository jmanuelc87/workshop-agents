import asyncio
from typing import List
from dotenv import load_dotenv
from google import genai
from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from google.cloud.firestore_v1.vector import Vector
from google.genai import types
#from mcp.server.fastmcp import FastMCP
from fastmcp import FastMCP

load_dotenv()

MCP_PORT = 8080

# Initialize FastMCP server
mcp = FastMCP(name="menudb", port=int(MCP_PORT))

# Constants
MENU_FIRESTORE_COLLECTION = "menu"
DATABASE_NAME = "embeddings"
GEMINI_MODEL_EMBEDDING = "gemini-embedding-001"


@mcp.tool()
def get_menu_items(search_query: str) -> List[str]:
    """
    Search the menu database for drinks. 
    Use this to find specific items, categories, or ingredients.
    
    Args:
        search_query (str): The term to search for (e.g., "coffee", "tea", "matcha", "cold drinks", "price of latte").
    
    Returns:
        List[str]: A list of matching menu items with descriptions and prices.
    """

    try:
        db = firestore.Client(database=DATABASE_NAME)

        client = genai.Client()

        print("creating embeddings...")

        result = client.models.embed_content(
            model=GEMINI_MODEL_EMBEDDING,
            contents=search_query,
            config=types.EmbedContentConfig(
                task_type="SEMANTIC_SIMILARITY",
                output_dimensionality=768,
            ),
        )

        embeddings_collection = db.collection(MENU_FIRESTORE_COLLECTION)

        vector_query = embeddings_collection.find_nearest(
            vector_field="embedding",
            query_vector=Vector(result.embeddings[0].values),
            distance_measure=DistanceMeasure.COSINE,
            limit=2,
        )

        docs = vector_query.stream()
        print("Getting menu items...")

        menu_items = []

        for doc in docs:
            print(doc.get("text_content"))
            menu_items.append(doc.get("text_content"))

        return menu_items

    except Exception as e:
        print(f"An error occurred in get_menu_items: {e}")
        return []


# --- Run Server ---
if __name__ == "__main__":
    # mcp.run(transport="streamable-http")
    asyncio.run(
        mcp.run_async(
            transport="streamable-http",
            host="0.0.0.0",
            port=MCP_PORT,
        )
    )
