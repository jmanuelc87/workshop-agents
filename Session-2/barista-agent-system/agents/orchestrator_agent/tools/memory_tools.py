from google.cloud import firestore

DATABASE_NAME = "embeddings"
COLLECTION_NAME = "user_memories"

db = firestore.Client(database=DATABASE_NAME)


def save_user_preference(preference: str, user_id: str = "demo_student") -> str:
    """
    Saves a specific fact or preference about the user into the database.
    Useful when the user says "I am vegan", "I love chocolate", etc.

    Args:
        preference (str): The fact to remember (e.g., "Is allergic to nuts").
        user_id (str): The ID of the user (defaults to 'demo_student' for the workshop).
    """
    try:
        user_ref = db.collection(COLLECTION_NAME).document(user_id)
        user_ref.set({
            "preferences": firestore.ArrayUnion([preference])
        }, merge=True)

        return f"Memory saved: '{preference}'"
    except Exception as e:
        return f"Error saving memory: {str(e)}"


def get_user_memories(user_id: str = "demo_student") -> str:
    """
    Retrieves all stored preferences for the user. 
    Call this tool to know the user's context before making a recommendation.
    """
    try:
        user_ref = db.collection(COLLECTION_NAME).document(user_id)
        doc = user_ref.get()

        if doc.exists:
            prefs = doc.to_dict().get("preferences", [])
            if not prefs:
                return "No memories found for this user."
            return f"User Memories: {', '.join(prefs)}"
        else:
            return "No memories found (New User)."
    except Exception as e:
        return f"Error fetching memories: {str(e)}"


def forget_user_memories(user_id: str = "demo_student") -> str:
    """
    Deletes all stored memories for the user. 
    Use this when the user asks to "forget everything" or "reset my preferences".
    """
    try:
        db.collection(COLLECTION_NAME).document(user_id).delete()
        return "All memories for this user have been deleted."
    except Exception as e:
        return f"Error deleting memories: {str(e)}"
