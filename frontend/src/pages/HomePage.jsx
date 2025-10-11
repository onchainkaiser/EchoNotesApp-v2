import { useState, useEffect } from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import NoteDetailModal from '../components/NoteDetailModal';
import { notesAPI } from '../services/api';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.category && note.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const data = await notesAPI.getAllNotes();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      alert('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (noteData, useAI) => {
    try {
      if (useAI) {
        await notesAPI.createNoteWithAI({
          title: noteData.title,
          content: noteData.content,
          auto_summarize: true,
          auto_categorize: true,
        });
      } else {
        await notesAPI.createNote(noteData);
      }
      await fetchNotes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note');
    }
  };

  const handleUpdateNote = async (noteData) => {
    try {
      await notesAPI.updateNote(selectedNote.id, noteData);
      await fetchNotes();
      setIsModalOpen(false);
      setSelectedNote(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesAPI.deleteNote(id);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setIsDetailModalOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedNote(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Sparkles color="#a855f7" size={32} />
            <h1>EchoNotes v2</h1>
          </div>
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={20} />
            New Note
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <Sparkles color="#9ca3af" size={48} />
            <h3>{searchQuery ? 'No notes found' : 'No notes yet'}</h3>
            <p>{searchQuery ? 'Try a different search term' : 'Create your first note to get started'}</p>
            {!searchQuery && (
              <button onClick={openCreateModal} className="btn-primary">
                Create Note
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
                onView={handleViewNote}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <NoteModal
          note={isEditMode ? selectedNote : null}
          isNew={!isEditMode}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNote(null);
            setIsEditMode(false);
          }}
          onSave={isEditMode ? handleUpdateNote : handleCreateNote}
        />
      )}

      {isDetailModalOpen && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedNote(null);
          }}
          onEdit={handleEditNote}
        />
      )}
    </div>
  );
};

export default HomePage;
