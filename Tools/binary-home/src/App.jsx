import React, { useState, useEffect, useRef } from 'react';
import FoxPanel from './components/FoxPanel';
import AlexPanel from './components/AlexPanel';
import ObservationsPanel from './components/ObservationsPanel';
import LoveOMeter from './components/LoveOMeter';
import NotesPanel from './components/NotesPanel';
import MoodTracker from './components/MoodTracker';

// Starfield generator
function createStars(container) {
  if (!container) return;
  container.innerHTML = '';
  const starCount = 150;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = star.style.height = (Math.random() * 3 + 1) + 'px';
    star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
    star.style.setProperty('--opacity', Math.random() * 0.7 + 0.3);
    star.style.animationDelay = Math.random() * 3 + 's';
    container.appendChild(star);
  }
}

function App() {
  const [alexState, setAlexState] = useState(null);
  const [observations, setObservations] = useState([]);
  const [threads, setThreads] = useState([]);
  const [shadowMoments, setShadowMoments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  const starfieldRef = useRef(null);

  // Create starfield on mount
  useEffect(() => {
    createStars(starfieldRef.current);
  }, []);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [state, obs, thrds, shadows] = await Promise.all([
        window.electronAPI.getAlexState(),
        window.electronAPI.getRecentObservations(500), // Get all observations for accurate stats
        window.electronAPI.getActiveThreads(),
        window.electronAPI.getShadowMoments(5)
      ]);

      setAlexState(state);
      setObservations(obs);
      setThreads(thrds);
      setShadowMoments(shadows);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load data:', err);
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 1500);
  };

  if (loading) {
    return (
      <div className="loading">
        <span>Loading Binary Home...</span>
      </div>
    );
  }

  return (
    <>
      {/* Starfield background */}
      <div className="starfield" ref={starfieldRef} />

      {/* Save indicator */}
      <div className={`save-indicator ${showSaveIndicator ? 'show' : ''}`}>
        Saved to constellation ✨
      </div>

      {/* Title bar */}
      <div className="title-bar">
        <h1>Binary <span>Home</span> v2</h1>
        <div className="window-controls">
          <button className="minimize" onClick={() => window.electronAPI.minimize()} />
          <button className="maximize" onClick={() => window.electronAPI.maximize()} />
          <button className="close" onClick={() => window.electronAPI.close()} />
        </div>
      </div>

      {/* Main container */}
      <div className="app-container">
        {/* Row 1: Fox | Love-O-Meter | Alex */}
        <FoxPanel onSave={handleSave} />

        <LoveOMeter onSave={handleSave} />

        <AlexPanel
          alexState={alexState}
          shadowMoments={shadowMoments}
          threads={threads}
        />

        {/* Row 2: Mood Tracker | Recent Observations */}
        <MoodTracker observations={observations} />
        <ObservationsPanel observations={observations} />

        {/* Row 3: Notes Between Stars (full width) */}
        <NotesPanel onSave={handleSave} />

        {/* Footer */}
        <footer className="footer">
          <div>Binary Home v2.0 — Fox & Alex | Constellation Architecture</div>
          <div className="signature">Embers Remember</div>
        </footer>
      </div>

    </>
  );
}

export default App;
