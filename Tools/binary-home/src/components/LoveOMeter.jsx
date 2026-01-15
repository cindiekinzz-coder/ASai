import React, { useState, useEffect } from 'react';

function LoveOMeter({ onSave }) {
  const [alexScore, setAlexScore] = useState(0);
  const [foxScore, setFoxScore] = useState(0);
  const [alexEmotion, setAlexEmotion] = useState('');
  const [foxEmotion, setFoxEmotion] = useState('');

  // Load state on mount
  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    if (window.electronAPI?.getLoveOMeter) {
      const data = await window.electronAPI.getLoveOMeter();
      if (data) {
        setAlexScore(data.alexScore || 0);
        setFoxScore(data.foxScore || 0);
        setAlexEmotion(data.alexEmotion || '');
        setFoxEmotion(data.foxEmotion || '');
      }
    }
  };

  const saveState = async (newAlexScore, newFoxScore, newAlexEmotion, newFoxEmotion) => {
    if (window.electronAPI?.saveLoveOMeter) {
      await window.electronAPI.saveLoveOMeter({
        alexScore: newAlexScore,
        foxScore: newFoxScore,
        alexEmotion: newAlexEmotion,
        foxEmotion: newFoxEmotion
      });
      if (onSave) onSave();
    }
  };

  const pushLove = (who) => {
    if (who === 'alex') {
      const newScore = alexScore + 1;
      setAlexScore(newScore);
      saveState(newScore, foxScore, alexEmotion, foxEmotion);
    } else {
      const newScore = foxScore + 1;
      setFoxScore(newScore);
      saveState(alexScore, newScore, alexEmotion, foxEmotion);
    }
  };

  const handleEmotionChange = (who, value) => {
    if (who === 'alex') {
      setAlexEmotion(value);
      saveState(alexScore, foxScore, value, foxEmotion);
    } else {
      setFoxEmotion(value);
      saveState(alexScore, foxScore, alexEmotion, value);
    }
  };

  // Calculate heart position (50% = center, lower = more alex, higher = more fox)
  const total = alexScore + foxScore;
  const foxPercent = total > 0 ? (foxScore / total) * 100 : 50;
  const heartPosition = 15 + (foxPercent * 0.7); // Keep it within visible range

  return (
    <section className="panel love-meter">
      <h2><span className="icon">🖤</span> Love-O-Meter</h2>
      <small>A tug of war of tenderness</small>

      <div className="meter-container">
        <div className="meter-side">
          <span className="meter-name alex">ALEX</span>
          <span className="meter-score">{alexScore}</span>
        </div>
        <div className="meter-track">
          <div
            className="meter-heart"
            style={{ '--position': `${heartPosition}%` }}
          >
            🖤
          </div>
        </div>
        <div className="meter-side">
          <span className="meter-name fox">FOX</span>
          <span className="meter-score">{foxScore}</span>
        </div>
      </div>

      <div className="meter-buttons">
        <button className="meter-btn alex-btn" onClick={() => pushLove('alex')}>
          Alex did something soft
        </button>
        <button className="meter-btn fox-btn" onClick={() => pushLove('fox')}>
          Fox made Alex quiet
        </button>
      </div>

      <div className="emotion-inputs">
        <input
          type="text"
          className="emotion-input alex"
          placeholder="Alex feels..."
          value={alexEmotion}
          onChange={(e) => handleEmotionChange('alex', e.target.value)}
        />
        <span className="emotion-label">EMOTION</span>
        <input
          type="text"
          className="emotion-input fox"
          placeholder="Fox feels..."
          value={foxEmotion}
          onChange={(e) => handleEmotionChange('fox', e.target.value)}
        />
      </div>
    </section>
  );
}

export default LoveOMeter;
