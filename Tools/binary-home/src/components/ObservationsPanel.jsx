import React from 'react';

function ObservationsPanel({ observations }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="panel observations-panel">
      <div className="panel-header">
        <h2 style={{ color: 'var(--text-primary)' }}>Recent Observations</h2>
      </div>

      {observations.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
          No observations yet. Start by recording how you feel.
        </div>
      ) : (
        <div className="observation-list">
          {observations.map((obs, i) => (
            <div key={i} className={`observation-item ${obs.is_shadow ? 'shadow' : ''}`}>
              <div className="observation-meta">
                <span className="emotion">{obs.emotion_word || 'unnamed'}</span>
                <span className="pillar">{obs.pillar_name}</span>
                {obs.is_shadow && <span className="shadow-badge">Growth</span>}
                <span className="time">{formatTime(obs.created_at)}</span>
              </div>
              <div className="observation-content">{obs.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ObservationsPanel;
