from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class NoteBase(BaseModel):
    """Base schema with common fields"""
    title: str = Field(..., min_length=1, max_length=225, description="Note title")
    content: str = Field(..., min_length=1, description="Note content")
    summary: str = Field(default="", description="Note summary")
    category: Optional[str] = Field(None, max_length=100, description="Note category")


class NoteCreate(NoteBase):
    """Schema for creating a new note"""
    pass


class NoteCreateAI(BaseModel):
    """Schema for creating a note with AI enhancement"""
    title: str = Field(..., min_length=1, max_length=225)
    content: str = Field(..., min_length=1)
    auto_summarize: bool = Field(default=True, description="Auto-generate summary")
    auto_categorize: bool = Field(default=True, description="Auto-suggest category")


class NoteUpdate(BaseModel):
    """Schema for updating a note - all fields optional"""
    title: Optional[str] = Field(None, min_length=1, max_length=225)
    content: Optional[str] = Field(None, min_length=1)
    summary: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)


class NoteResponse(NoteBase):
    """Schema for note responses"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class NoteEnhanced(NoteResponse):
    """Schema for AI-enhanced note response"""
    key_points: Optional[List[str]] = None