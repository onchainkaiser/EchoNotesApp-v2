import { Trash2, Edit, Sparkles } from 'lucide-react';

const NoteCard = ({ note, onDelete, onEdit, onView }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="note-card" onClick={() => onView(note)}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="icon-btn edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="icon-btn delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {note.category && (
        <span className="category-badge">{note.category}</span>
      )}
      
      <p className="note-summary">
        {note.summary || note.content}
      </p>
      
      <div className="note-footer">
        <span>{formatDate(note.created_at)}</span>
        {note.key_points && (
          <span className="ai-badge">
            <Sparkles size={14} />
            AI Enhanced
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
