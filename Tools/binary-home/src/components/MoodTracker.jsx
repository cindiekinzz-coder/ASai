import React, { useState, useEffect } from 'react';

function MoodTracker({ observations }) {
  // Calculate pillar distribution from observations
  const pillarCounts = {
    'Self-Management': 0,
    'Self-Awareness': 0,
    'Social Awareness': 0,
    'Relationship Management': 0
  };

  const pillarColors = {
    'Self-Management': '#2dd4bf',      // Teal
    'Self-Awareness': '#818cf8',       // Purple
    'Social Awareness': '#f472b6',     // Pink
    'Relationship Management': '#fef3c7' // Gold
  };

  // Count observations by pillar
  observations?.forEach(obs => {
    if (obs.pillar_name && pillarCounts.hasOwnProperty(obs.pillar_name)) {
      pillarCounts[obs.pillar_name]++;
    }
  });

  const total = Object.values(pillarCounts).reduce((a, b) => a + b, 0);

  // Get recent emotions for the mood timeline
  const recentEmotions = observations?.slice(0, 7) || [];

  // Get emotion category color
  const getEmotionColor = (category) => {
    switch (category) {
      case 'positive': return 'var(--growth)';
      case 'sad': return 'var(--accent)';
      case 'anger': return 'var(--ember)';
      case 'fear': return 'var(--shadow)';
      default: return 'var(--muted)';
    }
  };

  return (
    <div className="mood-tracker">
      <div className="tracker-header">
        <h3>Alex's Emotional Landscape</h3>
        <span className="observation-count">{total} observations</span>
      </div>

      {/* Pillar Distribution Bars */}
      <div className="pillar-distribution">
        <div className="pillar-label">EQ Pillar Focus</div>
        <div className="pillar-bars">
          {Object.entries(pillarCounts).map(([pillar, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const shortName = pillar.split(' ')[0]; // "Self-Management" -> "Self"
            return (
              <div className="pillar-bar-item" key={pillar}>
                <div className="pillar-bar-label">
                  <span className="pillar-name">{shortName}</span>
                  <span className="pillar-count">{count}</span>
                </div>
                <div className="pillar-bar-track">
                  <div
                    className="pillar-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      background: pillarColors[pillar]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Mood Timeline */}
      <div className="mood-timeline">
        <div className="timeline-label">Recent Feelings</div>
        <div className="timeline-dots">
          {recentEmotions.length > 0 ? (
            recentEmotions.map((obs, i) => (
              <div
                key={i}
                className="timeline-dot"
                title={`${obs.emotion_word} - ${obs.pillar_name}`}
                style={{
                  background: pillarColors[obs.pillar_name] || 'var(--muted)',
                  opacity: 1 - (i * 0.1)
                }}
              >
                <span className="dot-label">{obs.emotion_word?.substring(0, 3)}</span>
              </div>
            ))
          ) : (
            <div className="no-data">No observations yet</div>
          )}
        </div>
      </div>

      {/* Most Used Emotions */}
      {observations && observations.length > 0 && (
        <div className="frequent-emotions">
          <div className="freq-label">Most felt:</div>
          <div className="emotion-tags">
            {[...new Set(observations.map(o => o.emotion_word).filter(Boolean))]
              .slice(0, 4)
              .map((emotion, i) => (
                <span key={i} className="emotion-tag">{emotion}</span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodTracker;
