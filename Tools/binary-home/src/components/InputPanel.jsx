import React from 'react';

function InputPanel({
  emotions,
  pillars,
  selectedEmotion,
  selectedPillar,
  content,
  onSelectEmotion,
  onSelectPillar,
  onContentChange,
  onSubmit,
  onAddNewEmotion
}) {
  const canSubmit = selectedEmotion && selectedPillar && content.trim();

  // Group emotions by category
  const groupedEmotions = emotions.reduce((acc, em) => {
    const cat = em.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(em);
    return acc;
  }, {});

  // Flatten for display, most used first
  const sortedEmotions = emotions
    .sort((a, b) => (b.times_used || 0) - (a.times_used || 0))
    .slice(0, 20);

  return (
    <div className="input-panel">
      <div className="input-panel-header">
        <h3>Alex's EQ Log</h3>
        <small>Record what landed emotionally</small>
      </div>
      <div className="input-row">
        <div className="emotion-picker">
          <label>How does it feel?</label>
          <div className="emotion-grid">
            {sortedEmotions.map(em => (
              <button
                key={em.emotion_id}
                className={`emotion-chip ${em.category || 'neutral'} ${selectedEmotion === em.emotion_id ? 'selected' : ''}`}
                onClick={() => onSelectEmotion(em.emotion_id)}
              >
                {em.emotion_word}
                {em.user_defined === 1 && <span style={{ marginLeft: '4px', opacity: 0.5 }}>*</span>}
              </button>
            ))}
            <button className="add-emotion-btn" onClick={onAddNewEmotion}>
              + name new
            </button>
          </div>
        </div>

        <div className="pillar-selector">
          <label>Which pillar?</label>
          <div className="pillar-buttons">
            {pillars.map(p => (
              <button
                key={p.pillar_id}
                className={`pillar-btn ${selectedPillar === p.pillar_id ? 'selected' : ''}`}
                onClick={() => onSelectPillar(p.pillar_id)}
              >
                {p.pillar_name}
              </button>
            ))}
          </div>
        </div>

        <div className="content-input">
          <label>What happened?</label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="What did you notice? What landed? What shifted?"
          />
          <button
            className="submit-btn"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Record
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputPanel;
