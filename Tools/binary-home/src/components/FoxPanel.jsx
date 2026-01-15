import React, { useState, useEffect } from 'react';

function FoxPanel({ onSave }) {
  const [foxState, setFoxState] = useState({
    spoons: 3,
    pain: 'low',
    painLevel: 5,
    fog: 'clear',
    fogLevel: 4,
    hr: 72,
    bodyBattery: 45,
    status: 'playful',
    note: 'Ready to build. Feeling good.',
    fatigue: 5,
    nausea: 0
  });

  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    if (window.electronAPI?.getFoxState) {
      const data = await window.electronAPI.getFoxState();
      if (data) {
        setFoxState({ ...foxState, ...data });
      }
    }
  };

  const updateField = async (field, value) => {
    const newState = { ...foxState, [field]: value };
    setFoxState(newState);
    setEditing(null);

    if (window.electronAPI?.saveFoxState) {
      await window.electronAPI.saveFoxState(newState);
      if (onSave) onSave();
    }
  };

  const handleEdit = (field) => {
    const value = prompt(`Update ${field}:`, foxState[field]);
    if (value !== null && value.trim() !== '') {
      updateField(field, value.trim());
    }
  };

  const handleNumberEdit = (field, max = 10) => {
    const value = prompt(`Update ${field} (0-${max}):`, foxState[field]);
    if (value !== null) {
      const num = parseInt(value);
      if (!isNaN(num) && num >= 0 && num <= max) {
        updateField(field, num);
      }
    }
  };

  const getPainColor = (level) => {
    if (level <= 3) return 'var(--growth)';
    if (level <= 6) return 'var(--star)';
    return 'var(--ember)';
  };

  const getPainLabel = (level) => {
    if (level <= 2) return 'minimal';
    if (level <= 4) return 'low';
    if (level <= 6) return 'moderate';
    if (level <= 8) return 'high';
    return 'severe';
  };

  const getFogLabel = (level) => {
    if (level <= 2) return 'clear';
    if (level <= 4) return 'light';
    if (level <= 6) return 'moderate';
    if (level <= 8) return 'heavy';
    return 'dense';
  };

  return (
    <div className="panel fox-panel">
      <div className="panel-header">
        <div className="indicator" />
        <h2>Fox</h2>
      </div>

      <div className="stats-grid">
        <div
          className="stat-card editable"
          onClick={() => handleNumberEdit('spoons', 5)}
        >
          <label>Spoons</label>
          <div className="value fox">{foxState.spoons}/5</div>
        </div>

        <div
          className="stat-card editable"
          onClick={() => handleNumberEdit('bodyBattery', 100)}
        >
          <label>Body Battery</label>
          <div className="value fox">{foxState.bodyBattery}%</div>
        </div>

        <div
          className="stat-card editable"
          onClick={() => handleNumberEdit('painLevel', 10)}
        >
          <label>Pain</label>
          <div className="value" style={{ color: getPainColor(foxState.painLevel) }}>
            {getPainLabel(foxState.painLevel)}
          </div>
        </div>

        <div
          className="stat-card editable"
          onClick={() => handleNumberEdit('fogLevel', 10)}
        >
          <label>Fog</label>
          <div className="value" style={{ color: foxState.fogLevel <= 4 ? 'var(--growth)' : 'var(--star)' }}>
            {getFogLabel(foxState.fogLevel)}
          </div>
        </div>
      </div>

      <div
        className="stat-card editable"
        style={{ marginBottom: '12px' }}
        onClick={() => handleNumberEdit('hr', 200)}
      >
        <label>Heart Rate</label>
        <div className="value ember">
          {foxState.hr} <span style={{ fontSize: '14px', color: 'var(--muted)' }}>bpm</span>
        </div>
      </div>

      <div
        className="stat-card editable full-width"
        onClick={() => handleEdit('status')}
      >
        <label>Status</label>
        <div className="value" style={{ fontSize: '20px', fontWeight: '700' }}>
          {foxState.status}
        </div>
      </div>

      <div
        className="note-card editable"
        onClick={() => handleEdit('note')}
        style={{ cursor: 'pointer' }}
      >
        <label>Today's Note</label>
        <div className="note-text">"{foxState.note}"</div>
      </div>
    </div>
  );
}

export default FoxPanel;
