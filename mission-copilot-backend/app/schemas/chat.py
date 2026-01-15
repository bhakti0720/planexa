"""
Pydantic schemas for Chat data validation
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class ChatMessage(BaseModel):
    """Schema for a single chat message"""
    id: str = Field(..., description="Message ID")
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(..., description="Message timestamp")
    missionData: Optional[Dict[str, Any]] = Field(None, description="Mission data if assistant message")
    isError: Optional[bool] = Field(False, description="Whether this is an error message")


class ChatCreate(BaseModel):
    """Schema for creating a new chat"""
    name: str = Field(..., description="Chat name/title")
    messages: List[ChatMessage] = Field(default=[], description="Chat messages")
    userId: str = Field(default="temp-user", description="User ID (temp until auth is implemented)")


class ChatResponse(BaseModel):
    """Schema for chat response"""
    id: str = Field(..., description="Chat ID")
    chatId: str = Field(..., description="Unique chat identifier")
    name: str = Field(..., description="Chat name/title")
    messages: List[ChatMessage]
    userId: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439012",
                "chatId": "chat-uuid-123",
                "name": "Agriculture Mission Chat",
                "messages": [
                    {
                        "id": "msg-1",
                        "role": "user",
                        "content": "Design a 3U CubeSat",
                        "timestamp": "2026-01-14T20:00:00Z"
                    }
                ],
                "userId": "temp-user",
                "createdAt": "2026-01-14T20:00:00Z",
                "updatedAt": "2026-01-14T20:00:00Z"
            }
        }


class ChatUpdate(BaseModel):
    """Schema for updating a chat"""
    name: Optional[str] = None
    messages: Optional[List[ChatMessage]] = None


class MessageAdd(BaseModel):
    """Schema for adding a message to a chat"""
    message: ChatMessage
