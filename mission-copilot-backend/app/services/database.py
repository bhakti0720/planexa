"""
MongoDB database service for Planexa
Handles async database connections and operations using Motor
"""

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB configuration
MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "planexa")

# Global database client
client: AsyncIOMotorClient = None
db = None


async def connect_to_mongodb():
    """
    Connect to MongoDB Atlas
    Called on application startup
    """
    global client, db
    
    if not MONGODB_URI:
        logger.warning("⚠️ MONGODB_URI not set in environment variables")
        logger.warning("⚠️ MongoDB features will be disabled")
        return None
    
    try:
        logger.info("📡 Connecting to MongoDB Atlas...")
        client = AsyncIOMotorClient(MONGODB_URI)
        
        # Verify connection
        await client.admin.command('ping')
        
        db = client[MONGODB_DB_NAME]
        logger.info(f"✅ Connected to MongoDB database: {MONGODB_DB_NAME}")
        
        # Create indexes for better performance
        await create_indexes()
        
        return db
        
    except ConnectionFailure as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        logger.error("❌ Please check your MONGODB_URI in .env file")
        return None
    except Exception as e:
        logger.error(f"❌ Unexpected error connecting to MongoDB: {e}")
        return None


async def close_mongodb_connection():
    """
    Close MongoDB connection
    Called on application shutdown
    """
    global client
    
    if client:
        logger.info("🔌 Closing MongoDB connection...")
        client.close()
        logger.info("✅ MongoDB connection closed")


async def create_indexes():
    """
    Create database indexes for better query performance
    """
    try:
        # Missions collection indexes
        await db.missions.create_index("userId")
        await db.missions.create_index("createdAt")
        
        # Chats collection indexes
        await db.chats.create_index("userId")
        await db.chats.create_index("chatId")
        await db.chats.create_index("updatedAt")
        
        logger.info("✅ Database indexes created")
    except Exception as e:
        logger.warning(f"⚠️ Could not create indexes: {e}")


def get_database():
    """
    Get database instance
    Used as dependency in FastAPI routes
    Returns None if database is not connected
    """
    return db


async def check_mongodb_health():
    """
    Check if MongoDB is connected and responsive
    Returns status dict
    """
    if client is None:
        return {
            "status": "disconnected",
            "message": "MongoDB client not initialized"
        }
    
    try:
        await client.admin.command('ping')
        return {
            "status": "connected",
            "database": MONGODB_DB_NAME,
            "message": "MongoDB is healthy"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"MongoDB health check failed: {str(e)}"
        }
