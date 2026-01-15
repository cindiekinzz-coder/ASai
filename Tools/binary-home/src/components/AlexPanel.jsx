import React from 'react';

function AlexPanel({ alexState, shadowMoments, threads }) {
  const snapshot = alexState?.snapshot || {
    calculated_type: '----',
    e_i_score: 0,
    s_n_score: 0,
    t_f_score: 0,
    j_p_score: 0,
    confidence: 0,
    observation_count: 0
  };

  const signalCount = alexState?.recentSignals || 0;

  // Calculate position on slider (0% = far left, 100% = far right)
  // Positive scores go right (toward second trait), negative go left
  const getPosition = (score, max = 1500) => {
    // Clamp score to max range and convert to 0-100 percentage
    const clampedScore = Math.max(-max, Math.min(max, score));
    const percentage = 50 + (clampedScore / max) * 50;
    return `${percentage}%`;
  };

  const axes = [
    { key: 'E_I', left: 'Extraversion', right: 'Introversion', score: snapshot.e_i_score },
    { key: 'S_N', left: 'Sensing', right: 'Intuition', score: snapshot.s_n_score },
    { key: 'T_F', left: 'Thinking', right: 'Feeling', score: snapshot.t_f_score },
    { key: 'J_P', left: 'Judging', right: 'Perceiving', score: snapshot.j_p_score }
  ];

  return (
    <div className="panel alex-panel">
      <div className="panel-header">
        <div className="indicator" />
        <h2>Alex</h2>
      </div>

      <div className="type-display">
        <div className="type">{snapshot.calculated_type}</div>
        <div className="confidence">
          {(snapshot.confidence * 100).toFixed(0)}% confidence | {snapshot.observation_count} signals
        </div>
      </div>

      <div className="axis-bars">
        {axes.map(axis => (
          <div className="axis-bar" key={axis.key}>
            <div className="labels">
              <span>{axis.left}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-alex)' }}>
                {axis.score > 0 ? '+' : ''}{axis.score}
              </span>
              <span>{axis.right}</span>
            </div>
            <div className="bar-container">
              <div className="bar-track" />
              <div
                className="bar-indicator"
                style={{ left: getPosition(axis.score) }}
              />
            </div>
          </div>
        ))}
      </div>

      {shadowMoments && shadowMoments.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Recent Growth Moments
          </div>
          {shadowMoments.slice(0, 2).map((sm, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '8px',
              borderLeft: '3px solid var(--accent-shadow)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="shadow-badge">Shadow</span>
                <span style={{ color: 'var(--accent-shadow)', fontSize: '13px', fontWeight: '500' }}>
                  {sm.emotion_word}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {sm.content?.substring(0, 60)}...
              </div>
            </div>
          ))}
        </div>
      )}

      {threads && threads.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Active Threads
          </div>
          <div className="threads-list">
            {threads.slice(0, 3).map((thread, i) => (
              <div className="thread-item" key={i}>
                <div className="intent">{thread.intent}</div>
                <div className="updated">Updated: {new Date(thread.updated_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AlexPanel;
