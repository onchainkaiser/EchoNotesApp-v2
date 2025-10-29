from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import get_db, init_db, engine  # Make sure engine is imported
from typing import List
from contextlib import asynccontextmanager
import crud
from ai.gemini import generate_summary, suggest_category, extract_key_points, enhance_note
from schemas import NoteCreate, NoteUpdate, NoteResponse, NoteCreateAI, NoteEnhanced


# ✅ Lifespan context for startup + shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles app startup and graceful shutdown"""
    # --- Startup phase ---
    await init_db()
    print("✅ Database initialized successfully!")

    yield  # 🚀 Hand control over to FastAPI

    # --- Shutdown phase ---
    if engine:
        await engine.dispose()
        print("🧹 Database connection closed.")
    print("👋 Shutting down EchoNotes v2...")


# ✅ App configuration
app = FastAPI(
    title="EchoNotes v2",
    description="A modern note-taking API with AI-powered summaries",
    version="2.0.0",
    lifespan=lifespan
)


# ✅ CORS middleware (fixed)
app.add_middleware(
    CORSMiddleware,
    allow_origins = [
    "https://echo-notes-app.vercel.app",  # your Vercel frontend
    "http://localhost:5173"               # for local dev (optional)
    ]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Routes
@app.get("/")
async def home():
    return {
        "message": "Welcome to EchoNotes v2 API 🚀",
        "docs": "/docs",
        "version": "2.0.0"
    }


@app.post("/notes/", response_model=NoteResponse, status_code=201)
async def create_note(
    note: NoteCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new note"""
    return await crud.create_note(db, note)  # Pass Pydantic object directly


@app.post("/notes/ai", response_model=NoteEnhanced, status_code=201)
async def create_note_with_ai(
    note: NoteCreateAI,
    db: AsyncSession = Depends(get_db)
):
    """Create a new note with AI-generated summary and category"""

    # Generate AI enhancements
    enhancements = await enhance_note(note.title, note.content)

    # Use AI suggestions or user-provided values
    summary = enhancements["summary"] if note.auto_summarize else ""
    category = enhancements["category"] if note.auto_categorize else None

    # Create the note
    created_note = await crud.create_note(
        db,
        NoteCreate(
            title=note.title,
            content=note.content,
            summary=summary,
            category=category
        )
    )

    # Add key points to response
    response_dict = {
        "id": created_note.id,
        "title": created_note.title,
        "content": created_note.content,
        "summary": created_note.summary,
        "category": created_note.category,
        "created_at": created_note.created_at,
        "key_points": enhancements["key_points"]
    }

    return response_dict


@app.get("/notes/", response_model=List[NoteResponse])
async def get_notes(db: AsyncSession = Depends(get_db)):
    """Get all notes"""
    return await crud.get_all_notes(db)


@app.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific note by ID"""
    note = await crud.get_note_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.post("/notes/{note_id}/summarize")
async def summarize_note(note_id: int, db: AsyncSession = Depends(get_db)):
    """Generate a summary for an existing note"""
    note = await crud.get_note_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    summary = await generate_summary(note.content)

    # Update the note with the new summary
    updated_note = await crud.update_note(db, note_id, summary=summary)

    return {"summary": summary, "note": updated_note}


@app.post("/notes/{note_id}/categorize")
async def categorize_note(note_id: int, db: AsyncSession = Depends(get_db)):
    """Suggest a category for an existing note"""
    note = await crud.get_note_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    category = await suggest_category(note.title, note.content)

    # Update the note with the suggested category
    updated_note = await crud.update_note(db, note_id, category=category)

    return {"category": category, "note": updated_note}


@app.get("/notes/{note_id}/key-points")
async def get_key_points(note_id: int, db: AsyncSession = Depends(get_db)):
    """Extract key points from a note"""
    note = await crud.get_note_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    key_points = await extract_key_points(note.content)

    return {"key_points": key_points}


@app.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_update: NoteUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a note"""
    note = await crud.update_note(
        db,
        note_id,
        note_update.title,
        note_update.content,
        note_update.summary,
        note_update.category
    )
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.delete("/notes/{note_id}")
async def delete_note(note_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a note"""
    note = await crud.delete_note(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully", "id": note_id}
