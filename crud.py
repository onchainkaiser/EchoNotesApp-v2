from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from database.models import Note
from datetime import datetime


async def create_note(db: AsyncSession, title: str, content: str, summary: str = "", category: str = None):
    new_note = Note(
        title=title,
        content=content,
        summary=summary,
        category=category,
        created_at=datetime.utcnow()
    )
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    return new_note


async def get_all_notes(db: AsyncSession):
    result = await db.execute(select(Note))
    return result.scalars().all()


async def get_note_by_id(db: AsyncSession, note_id: int):
    result = await db.execute(select(Note).where(Note.id == note_id))
    return result.scalar_one_or_none()


async def update_note(db: AsyncSession, note_id: int, title: str = None, content: str = None, summary: str = None, category: str = None):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()

    if not note:
        return None

    if title:
        note.title = title
    if content:
        note.content = content
    if summary:
        note.summary = summary
    if category:
        note.category = category

    await db.commit()
    await db.refresh(note)
    return note


async def delete_note(db: AsyncSession, note_id: int):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()

    if not note:
        return None

    await db.delete(note)
    await db.commit()
    return note
