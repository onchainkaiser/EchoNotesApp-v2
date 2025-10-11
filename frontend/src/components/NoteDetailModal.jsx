import { X, Sparkles, Tag, Calendar } from 'lucide-react';

const NoteDetailModal = ({ note, onClose, onEdit }) => {
  if (!note) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{note.title}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-metadata">
            {note.category && (
              <div className="metadata-item">
                <Tag size={16} />
                <span className="category-badge">{note.category}</span>
              </div>
            )}
            <div className="metadata-item">
              <Calendar size={16} />
              <span>{formatDate(note.created_at)}</span>
            </div>
          </div>

          {note.summary && (
            <div className="info-box summary">
              <h3 className="info-box-title">
                <Sparkles size={18} />
                AI Summary
              </h3>
              <p>{note.summary}</p>
            </div>
          )}

          {note.key_points && note.key_points.length > 0 && (
            <div className="info-box keypoints">
              <h3 className="info-box-title">
                <Sparkles size={18} />
                Key Points
              </h3>
              <ul>
                {note.key_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="content-section">
            <h3>Content</h3>
            <div className="content-text">{note.content}</div>
          </div>

          <div className="modal-actions">
            <button
              onClick={() => {
                onClose();
                onEdit(note);
              }}
              className="btn-primary"
            >
              Edit Note
            </button>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailModal;
