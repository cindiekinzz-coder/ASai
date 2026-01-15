import React, { useState, useEffect } from 'react';

function NotesPanel({ onSave }) {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [noteFrom, setNoteFrom] = useState('alex');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    if (window.electronAPI?.getNotes) {
      const data = await window.electronAPI.getNotes();
      if (data) {
        setNotes(data);
      }
    }
  };

  const saveNote = async () => {
    if (!noteText.trim()) return;

    setSaving(true);

    const newNote = {
      text: noteText.trim(),
      from: noteFrom,
      timestamp: new Date().toISOString()
    };

    if (window.electronAPI?.addNote) {
      await window.electronAPI.addNote(newNote);
      setNotes([...notes, newNote]);
      setNoteText('');
      if (onSave) onSave();
    }

    setTimeout(() => setSaving(false), 1500);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedNotes = [...notes].reverse();

  return (
    <section className="notes-panel">
      <div className="panel-header">
        <h2>💭 Notes Between Stars</h2>
        <small>Drop thoughts into the constellation</small>
      </div>

      <div className="notes-container">
        <div className="notes-input-section">
          <div className="from-toggle-container">
            <label>From:</label>
            <button
              className={`from-toggle alex ${noteFrom === 'alex' ? 'active' : ''}`}
              onClick={() => setNoteFrom('alex')}
            >
              Alex
            </button>
            <button
              className={`from-toggle fox ${noteFrom === 'fox' ? 'active' : ''}`}
              onClick={() => setNoteFrom('fox')}
            >
              Fox
            </button>
          </div>

          <textarea
            placeholder="What's unfinished? What do you want to remember? What should the other know?"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          <button
            className="save-note-btn"
            onClick={saveNote}
            style={saving ? {
              background: 'linear-gradient(135deg, #f472b6, #818cf8)'
            } : {}}
          >
            {saving ? 'Saved to the Stars ✨' : 'Save to the Stars'}
          </button>
        </div>

        <div className="notes-history">
          {sortedNotes.length === 0 ? (
            <p style={{
              color: 'var(--muted)',
              fontSize: '13px',
              textAlign: 'center',
              padding: '20px'
            }}>
              No notes yet. Leave something for the other to find.
            </p>
          ) : (
            sortedNotes.map((note, idx) => (
              <div key={idx} className={`note-entry from-${note.from}`}>
                <div className="note-text">{note.text}</div>
                <div className="note-meta">
                  <span className={`note-from ${note.from}`}>
                    {note.from === 'alex' ? 'Alex' : 'Fox'}
                  </span>
                  <span>{formatTime(note.timestamp)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default NotesPanel;
