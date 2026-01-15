"""
API Router for Mission CRUD operations
Handles saving, retrieving, and deleting missions from MongoDB
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId
from app.services.database import get_database

router = APIRouter(prefix="/api/missions", tags=["missions"])


def serialize_mission(mission):
    """Convert MongoDB document to JSON-serializable dict"""
    if mission:
        mission["id"] = str(mission.pop("_id"))
        return mission
    return None


@router.post("", status_code=201)
async def create_mission(
    query: str,
    data: dict,
    userId: str = "temp-user",
    db = Depends(get_database)
):
    """
    Create a new mission in MongoDB
    
    Args:
        query: User's mission query/request
        data: Mission data from AI generation
        userId: User ID (default: temp-user)
    
    Returns:
        Created mission with ID
    """
    try:
        mission_doc = {
            "userId": userId,
            "query": query,
            "data": data,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await db.missions.insert_one(mission_doc)
        
        mission_doc["id"] = str(result.inserted_id)
        mission_doc.pop("_id", None)
        
        return mission_doc
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create mission: {str(e)}")


@router.get("", response_model=List[dict])
async def get_all_missions(
    userId: str = "temp-user",
    limit: int = 50,
    db = Depends(get_database)
):
    """
    Get all missions for a user
    
    Args:
        userId: User ID to filter missions
        limit: Maximum number of missions to return (default: 50)
    
    Returns:
        List of missions
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        cursor = db.missions.find({"userId": userId}).sort("createdAt", -1).limit(limit)
        missions = await cursor.to_list(length=limit)
        
        return [serialize_mission(mission) for mission in missions]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch missions: {str(e)}")


@router.get("/{mission_id}")
async def get_mission(
    mission_id: str,
    db = Depends(get_database)
):
    """
    Get a specific mission by ID
    
    Args:
        mission_id: Mission ID
    
    Returns:
        Mission document
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        if not ObjectId.is_valid(mission_id):
            raise HTTPException(status_code=400, detail="Invalid mission ID format")
        
        mission = await db.missions.find_one({"_id": ObjectId(mission_id)})
        
        if not mission:
            raise HTTPException(status_code=404, detail="Mission not found")
        
        return serialize_mission(mission)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch mission: {str(e)}")


@router.delete("/{mission_id}")
async def delete_mission(
    mission_id: str,
    db = Depends(get_database)
):
    """
    Delete a mission by ID
    
    Args:
        mission_id: Mission ID to delete
    
    Returns:
        Success message
    """
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected. Please configure MONGODB_URI in .env file."
        )
    
    try:
        if not ObjectId.is_valid(mission_id):
            raise HTTPException(status_code=400, detail="Invalid mission ID format")
        
        result = await db.missions.delete_one({"_id": ObjectId(mission_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Mission not found")
        
        return {"message": "Mission deleted successfully", "id": mission_id}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete mission: {str(e)}")
