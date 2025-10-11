import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const NoteModal = ({ note, onClose, onSave, isNew = false }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    summary: note?.summary || '',
    category: note?.category || '',
  });
  
  const [useAI, setUseAI] = useState(isNew);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, useAI);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isNew ? 'Create New Note' : 'Edit Note'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="form-textarea"
              required
            />
          </div>

          {!useAI && (
            <>
              <div className="form-group">
                <label className="form-label">Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                />
              </div>
            </>
          )}

          {isNew && (
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="useAI"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor="useAI" className="checkbox-label">
                <Sparkles size={16} style={{ color: '#a855f7' }} />
                Use AI to generate summary and category
              </label>
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="btn-primary">
              {isNew ? 'Create Note' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
