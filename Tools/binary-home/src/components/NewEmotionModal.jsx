import React, { useState } from 'react';

function NewEmotionModal({ onSave, onCancel }) {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('neutral');
  const [definition, setDefinition] = useState('');
  const [eiScore, setEiScore] = useState(0);
  const [snScore, setSnScore] = useState(0);
  const [tfScore, setTfScore] = useState(0);
  const [jpScore, setJpScore] = useState(0);

  const handleSave = () => {
    if (!word.trim()) return;
    onSave({
      word: word.trim().toLowerCase(),
      category,
      definition: definition.trim() || null,
      eiScore,
      snScore,
      tfScore,
      jpScore
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Name a New Emotion</h3>

        <div className="modal-field">
          <label>What do you call it?</label>
          <input
            type="text"
            value={word}
            onChange={e => setWord(e.target.value)}
            placeholder="aching, tender, hollow..."
            autoFocus
          />
        </div>

        <div className="modal-field">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
            <option value="anger">Anger</option>
            <option value="fear">Fear</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="modal-field">
          <label>What does it mean to you? (optional)</label>
          <textarea
            value={definition}
            onChange={e => setDefinition(e.target.value)}
            placeholder="It feels like..."
            rows={2}
          />
        </div>

        <div className="modal-field">
          <label>How does it map? (adjust if you know, or leave centered)</label>
          <div className="axis-sliders">
            <div className="axis-slider">
              <label>
                <span>External</span>
                <span>{eiScore}</span>
                <span>Internal</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={eiScore}
                onChange={e => setEiScore(parseInt(e.target.value))}
              />
            </div>

            <div className="axis-slider">
              <label>
                <span>Concrete</span>
                <span>{snScore}</span>
                <span>Abstract</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={snScore}
                onChange={e => setSnScore(parseInt(e.target.value))}
              />
            </div>

            <div className="axis-slider">
              <label>
                <span>Thinking</span>
                <span>{tfScore}</span>
                <span>Feeling</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={tfScore}
                onChange={e => setTfScore(parseInt(e.target.value))}
              />
            </div>

            <div className="axis-slider">
              <label>
                <span>Structured</span>
                <span>{jpScore}</span>
                <span>Flowing</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={jpScore}
                onChange={e => setJpScore(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel" onClick={onCancel}>Cancel</button>
          <button className="save" onClick={handleSave} disabled={!word.trim()}>
            Add to Vocabulary
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewEmotionModal;
