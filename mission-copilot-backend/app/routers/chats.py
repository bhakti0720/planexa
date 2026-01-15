"""
API Router for Chat CRUD operations
Handles saving, retrieving, and deleting chats from MongoDB
"""

from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List
from datetime import datetime
from bson import ObjectId
from app.services.database import get_database

router = APIRouter(prefix="/api/chats", tags=["chats"])


def serialize_chat(chat):
    """Convert MongoDB document to JSON-serializable dict"""
    if chat:
        chat["id"] = str(chat.pop("_id"))
        return chat
    return None


@router.post("", status_code=201)
async def create_chat(
    chatId: str,
    name: str,
    messages: List[dict] = [],
    userId: str = "temp-user",
    db = Depends(get_database)
):
    """
    Create or update a chat in MongoDB
    
    Args:
        chatId: Unique chat identifier
        name: Chat name/title
        messages: List of chat messages
        userId: User ID (default: temp-user)
    
    Returns:
        Created/updated chat with ID
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        # Check if chat already exists
        existing_chat = await db.chats.find_one({"chatId": chatId})
        
        if existing_chat:
            # Update existing chat
            result = await db.chats.update_one(
                {"chatId": chatId},
                {
                    "$set": {
                        "name": name,
                        "messages": messages,
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
            
            updated_chat = await db.chats.find_one({"chatId": chatId})
            return serialize_chat(updated_chat)
        else:
            # Create new chat
            chat_doc = {
                "chatId": chatId,
                "userId": userId,
                "name": name,
                "messages": messages,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            
            result = await db.chats.insert_one(chat_doc)
            
            chat_doc["id"] = str(result.inserted_id)
            chat_doc.pop("_id", None)
            
            return chat_doc
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create/update chat: {str(e)}")


@router.get("", response_model=List[dict])
async def get_all_chats(
    userId: str = "temp-user",
    limit: int = 50,
    db = Depends(get_database)
):
    """
    Get all chats for a user
    
    Args:
        userId: User ID to filter chats
        limit: Maximum number of chats to return (default: 50)
    
    Returns:
        List of chats
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        cursor = db.chats.find({"userId": userId}).sort("updatedAt", -1).limit(limit)
        chats = await cursor.to_list(length=limit)
        
        return [serialize_chat(chat) for chat in chats]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch chats: {str(e)}")


@router.get("/{chat_id}")
async def get_chat(
    chat_id: str,
    db = Depends(get_database)
):
    """
    Get a specific chat by ID or chatId
    
    Args:
        chat_id: Chat ID or chatId
    
    Returns:
        Chat document
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        # Try to find by MongoDB _id first
        chat = None
        if ObjectId.is_valid(chat_id):
            chat = await db.chats.find_one({"_id": ObjectId(chat_id)})
        
        # If not found, try by chatId
        if not chat:
            chat = await db.chats.find_one({"chatId": chat_id})
        
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return serialize_chat(chat)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch chat: {str(e)}")


@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: str,
    db = Depends(get_database)
):
    """
    Delete a chat by ID or chatId
    
    Args:
        chat_id: Chat ID or chatId to delete
    
    Returns:
        Success message
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        # Try to delete by MongoDB _id first
        result = None
        if ObjectId.is_valid(chat_id):
            result = await db.chats.delete_one({"_id": ObjectId(chat_id)})
        
        # If not found, try by chatId
        if not result or result.deleted_count == 0:
            result = await db.chats.delete_one({"chatId": chat_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return {"message": "Chat deleted successfully", "id": chat_id}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete chat: {str(e)}")


@router.post("/{chat_id}/messages")
async def add_message_to_chat(
    chat_id: str,
    message: dict = Body(...),
    db = Depends(get_database)
):
    """
    Add a message to an existing chat
    
    Args:
        chat_id: Chat ID or chatId
        message: Message object to add
    
    Returns:
        Updated chat
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        # Try to find by MongoDB _id first
        chat = None
        if ObjectId.is_valid(chat_id):
            chat = await db.chats.find_one({"_id": ObjectId(chat_id)})
        
        # If not found, try by chatId
        if not chat:
            chat = await db.chats.find_one({"chatId": chat_id})
        
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        # Add message to chat
        result = await db.chats.update_one(
            {"_id": chat["_id"]},
            {
                "$push": {"messages": message},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        # Fetch updated chat
        updated_chat = await db.chats.find_one({"_id": chat["_id"]})
        
        return serialize_chat(updated_chat)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add message: {str(e)}")
