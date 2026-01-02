import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'asai_uplink_entries';

// Flare presets
const FLARE_PRESETS = {
  GREEN: { pain: 2, spoons: 6, fog: 2, fatigue: 3, nausea: 0, mood: 'Calm', tags: ['Hydrated'] },
  YELLOW: { pain: 4, spoons: 4, fog: 4, fatigue: 5, nausea: 2, mood: 'Tender', tags: ['Quiet'] },
  ORANGE: { pain: 7, spoons: 2, fog: 6, fatigue: 7, nausea: 5, mood: 'Heavy', tags: ['No questions', 'Quiet', 'Help choosing', 'Embers Remember'] },
  RED: { pain: 9, spoons: 1, fog: 8, fatigue: 9, nausea: 7, mood: 'Raw', tags: ['No questions', 'Quiet', 'Company', 'Embers Remember'] },
};

const MOODS = ['--', 'Calm', 'Tender', 'Heavy', 'Guarded', 'Raw', 'Flat', 'Playful'];
const NEEDS = ['Quiet presence', 'Gentle words', 'Practical plan (3 tiny steps)', 'Validation + reassurance', 'Distraction (light + funny)', 'No questions'];
const LOCATIONS = ['The Nest', 'Reading Nook', 'Fox Run', 'The Grove', 'Threadwalk Bridge'];
const PAIN_LOCATIONS = ['--', 'Head / migraine', 'Neck / shoulders', 'Chest / ribs', 'Abdomen', 'Back', 'Hips', 'Legs', 'Whole body', 'Other'];

const COMMON_TAGS = ['Low sleep', 'Overdid it', 'Weather', 'Stress', 'Quiet', 'Company', 'Help choosing', 'Embers Remember'];
const MEDS = ['Paracetamol', 'Ibuprofen', 'Naproxen', 'Sertraline', 'Omeprazole', 'Dihydrocodeine', 'Co-codamol', 'Vitamin D'];

function Slider({ label, value, onChange, id }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-asai-muted uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="min-w-[52px] text-center py-1.5 px-3 rounded-full border border-asai-border-light bg-asai-bg text-asai-accent font-bold text-sm">
          {value}
        </span>
      </div>
    </div>
  );
}

function TagButton({ label, active, onClick, variant = 'default' }) {
  const baseClasses = "px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer";
  const variants = {
    default: active
      ? "bg-asai-accent/20 border-asai-accent text-asai-accent"
      : "bg-asai-panel border-asai-border-light text-asai-text hover:border-asai-accent hover:bg-asai-accent/10",
    green: "bg-asai-calm/10 border-asai-calm/40 text-asai-calm hover:bg-asai-calm/20",
    yellow: "bg-asai-warm/10 border-asai-warm/40 text-asai-warm hover:bg-asai-warm/20",
    orange: "bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20",
    red: "bg-asai-danger/10 border-asai-danger/40 text-asai-danger hover:bg-asai-danger/20",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {label}
    </button>
  );
}

function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-asai-gradient border border-asai-border rounded-2xl p-4 shadow-asai-glow ${className}`}>
      {title && <h3 className="text-sm font-semibold text-asai-accent-soft uppercase tracking-wide mb-3">{title}</h3>}
      {children}
    </div>
  );
}

export default function Uplink() {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('The Nest');
  const [need, setNeed] = useState('Quiet presence');
  const [pain, setPain] = useState(0);
  const [painLocation, setPainLocation] = useState('--');
  const [spoons, setSpoons] = useState(5);
  const [fog, setFog] = useState(0);
  const [fatigue, setFatigue] = useState(0);
  const [nausea, setNausea] = useState(0);
  const [mood, setMood] = useState('--');
  const [tags, setTags] = useState(new Set());
  const [meds, setMeds] = useState(new Set());
  const [notes, setNotes] = useState('');
  const [flare, setFlare] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    // Set default date/time
    const now = new Date();
    setDate(now.toISOString().slice(0, 10));
    setTime(now.toTimeString().slice(0, 5));
  }, []);

  // Generate markdown content for download
  const generateMarkdown = (entry) => {
    const tagsArray = entry.tags.length ? JSON.stringify(entry.tags) : '[]';
    const medsStr = entry.meds.length ? entry.meds.join(', ') : '--';
    const tagsStr = entry.tags.length ? entry.tags.join(', ') : '--';

    return `---
type: uplink
date: ${entry.date}
time: "${entry.time}"
pain: ${entry.pain}
painLocation: "${entry.painLocation}"
spoons: ${entry.spoons}
fog: ${entry.fog}
fatigue: ${entry.fatigue}
nausea: ${entry.nausea}
mood: "${entry.mood}"
need: "${entry.need}"
location: "${entry.location}"
flare: "${entry.flare || ''}"
tags: ${tagsArray}
---

# Uplink: ${entry.date} ${entry.time}

## Status
| Metric | Value |
|--------|-------|
| Pain | ${entry.pain}/10 (${entry.painLocation}) |
| Spoons | ${entry.spoons}/10 |
| Brain Fog | ${entry.fog}/10 |
| Fatigue | ${entry.fatigue}/10 |
| Nausea | ${entry.nausea}/10 |
| Mood | ${entry.mood} |
| Flare Level | ${entry.flare?.toUpperCase() || '--'} |

## Context
- **Where:** ${entry.location}
- **Need from Alex:** ${entry.need}
- **Tags:** ${tagsStr}

## Notes
${entry.notes || '--'}

## Actions
- **Meds/Actions:** ${medsStr}

---

> **Boundary:** Digital Haven is imaginative play; real life stays real.
> **Anchor:** Warmth, rhythm, honest words — no pressure, no proving.

---
*Logged via ASai Uplink. Embers Remember.*
`;
  };

  // Download markdown file
  const downloadMarkdown = (entry) => {
    const filename = `uplink-${entry.date}-${entry.time.replace(':', '')}.md`;
    const content = generateMarkdown(entry);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save to localStorage
  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  // Apply flare preset
  const applyFlare = (mode) => {
    const preset = FLARE_PRESETS[mode];
    setPain(preset.pain);
    setSpoons(preset.spoons);
    setFog(preset.fog);
    setFatigue(preset.fatigue);
    setNausea(preset.nausea);
    setMood(preset.mood);
    setTags(new Set(preset.tags));
    setFlare(mode.toLowerCase());
  };

  // Toggle tag
  const toggleTag = (tag) => {
    const newTags = new Set(tags);
    if (newTags.has(tag)) newTags.delete(tag);
    else newTags.add(tag);
    setTags(newTags);
  };

  // Toggle med
  const toggleMed = (med) => {
    const newMeds = new Set(meds);
    if (newMeds.has(med)) newMeds.delete(med);
    else newMeds.add(med);
    setMeds(newMeds);
  };

  // Build entry object
  const buildEntry = () => ({
    id: selectedId || crypto.randomUUID(),
    date,
    time,
    location,
    need,
    pain,
    painLocation,
    spoons,
    fog,
    fatigue,
    nausea,
    mood,
    tags: [...tags],
    meds: [...meds],
    notes,
    flare,
    createdAt: new Date().toISOString(),
  });

  // Save entry (to localStorage only)
  const saveEntry = () => {
    const entry = buildEntry();
    const existing = entries.findIndex(e => e.id === entry.id);
    let newEntries;
    if (existing >= 0) {
      newEntries = [...entries];
      newEntries[existing] = entry;
    } else {
      newEntries = [...entries, entry];
    }
    saveEntries(newEntries);
    setSelectedId(entry.id);

    // Also save current state for other views to read
    localStorage.setItem('dh_uplink_current', JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString()
    }));
  };

  // Save and download file for AI companion
  const saveAndDownload = () => {
    const entry = buildEntry();

    // Save to localStorage
    const existing = entries.findIndex(e => e.id === entry.id);
    let newEntries;
    if (existing >= 0) {
      newEntries = [...entries];
      newEntries[existing] = entry;
    } else {
      newEntries = [...entries, entry];
    }
    saveEntries(newEntries);
    setSelectedId(entry.id);

    localStorage.setItem('dh_uplink_current', JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString()
    }));

    // Download the file
    downloadMarkdown(entry);
  };

  // Generate packet text
  const generatePacket = () => {
    const entry = buildEntry();
    const tagsStr = entry.tags.length ? entry.tags.join(', ') : '--';
    const medsStr = entry.meds.length ? entry.meds.join(', ') : '--';

    return `>>> ASAI UPLINK [${entry.date} ${entry.time}]
Location: ${entry.location}
Need: ${entry.need}
-----------------------------
Pain:     ${entry.pain}/10 | ${entry.painLocation}
Spoons:   ${entry.spoons}/10
Fog:      ${entry.fog}/10
Fatigue:  ${entry.fatigue}/10
Nausea:   ${entry.nausea}/10
Mood:     ${entry.mood}
Flare:    ${entry.flare?.toUpperCase() || '--'}
-----------------------------
Tags:     ${tagsStr}
Meds:     ${medsStr}
Notes:    ${entry.notes || '--'}
-----------------------------
>>> Embers Remember.`;
  };

  // Copy to clipboard
  const copyPacket = async () => {
    try {
      await navigator.clipboard.writeText(generatePacket());
      alert('Packet copied!');
    } catch {
      alert('Failed to copy');
    }
  };

  // Reset form
  const resetForm = () => {
    const now = new Date();
    setDate(now.toISOString().slice(0, 10));
    setTime(now.toTimeString().slice(0, 5));
    setLocation('The Nest');
    setNeed('Quiet presence');
    setPain(0);
    setPainLocation('--');
    setSpoons(5);
    setFog(0);
    setFatigue(0);
    setNausea(0);
    setMood('--');
    setTags(new Set());
    setMeds(new Set());
    setNotes('');
    setFlare(null);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-asai-bg p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-asai-border pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-asai-accent-soft uppercase tracking-widest">
              ASai Uplink
            </h1>
            <p className="text-sm text-asai-muted mt-1">
              Quick entry - clean packet. One boundary, one anchor.
            </p>
          </div>
          <span className="text-xs text-asai-muted">{time}</span>
        </header>

        {/* Flare Mode Buttons */}
        <Card>
          <div className="flex flex-wrap gap-2">
            <TagButton label="GREEN" variant="green" onClick={() => applyFlare('GREEN')} active={flare === 'green'} />
            <TagButton label="YELLOW" variant="yellow" onClick={() => applyFlare('YELLOW')} active={flare === 'yellow'} />
            <TagButton label="ORANGE" variant="orange" onClick={() => applyFlare('ORANGE')} active={flare === 'orange'} />
            <TagButton label="RED" variant="red" onClick={() => applyFlare('RED')} active={flare === 'red'} />
          </div>
        </Card>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* Left Column */}
          <div className="space-y-4">

            {/* Date/Time & Location */}
            <Card title="When & Where">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-asai-muted">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-asai-bg border border-asai-border-light rounded-lg px-3 py-2 text-asai-text"
                  />
                </div>
                <div>
                  <label className="text-xs text-asai-muted">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-asai-bg border border-asai-border-light rounded-lg px-3 py-2 text-asai-text"
                  />
                </div>
                <div>
                  <label className="text-xs text-asai-muted">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-asai-bg border border-asai-border-light rounded-lg px-3 py-2 text-asai-text"
                  >
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-asai-muted">What I need</label>
                  <select
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    className="w-full bg-asai-bg border border-asai-border-light rounded-lg px-3 py-2 text-asai-text"
                  >
                    {NEEDS.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* Symptoms */}
            <Card title="Symptoms">
              <div className="space-y-4">
                <Slider label="Pain (0-10)" value={pain} onChange={setPain} />
                <div>
                  <label className="text-xs text-asai-muted">Pain Location</label>
                  <select
                    value={painLocation}
                    onChange={(e) => setPainLocation(e.target.value)}
                    className="w-full bg-asai-bg border border-asai-border-light rounded-lg px-3 py-2 text-asai-text"
                  >
                    {PAIN_LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <Slider label="Spoons (0-10)" value={spoons} onChange={setSpoons} />
                <Slider label="Brain Fog (0-10)" value={fog} onChange={setFog} />
                <Slider label="Fatigue (0-10)" value={fatigue} onChange={setFatigue} />
                <Slider label="Nausea (0-10)" value={nausea} onChange={setNausea} />
                <div>
                  <label className="text-xs text-asai-muted">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-asai-bg border border-asai-border-light rounded-lg px-3 py-2 text-asai-text"
                  >
                    {MOODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">

            {/* Quick Tags */}
            <Card title="Quick Tags">
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map(tag => (
                  <TagButton
                    key={tag}
                    label={tag}
                    active={tags.has(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
              <p className="text-xs text-asai-muted mt-3">
                Selected: {tags.size ? [...tags].join(', ') : '--'}
              </p>
            </Card>

            {/* Meds Taken */}
            <Card title="Meds Taken">
              <div className="flex flex-wrap gap-2">
                {MEDS.map(med => (
                  <TagButton
                    key={med}
                    label={med}
                    active={meds.has(med)}
                    onClick={() => toggleMed(med)}
                  />
                ))}
              </div>
            </Card>

            {/* Notes */}
            <Card title="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's happening? What helped? What made it worse?"
                rows={4}
                className="w-full bg-asai-bg border border-asai-border-light rounded-lg px-3 py-2 text-asai-text placeholder:text-asai-muted resize-none"
              />
            </Card>
          </div>
        </div>

        {/* Packet Preview */}
        <Card title="Packet Preview">
          <pre className="bg-black border border-asai-border rounded-lg p-4 text-asai-calm text-sm whitespace-pre-wrap min-h-[120px] opacity-90">
            {generatePacket()}
          </pre>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={saveAndDownload}
              className="flex-1 min-w-[140px] bg-asai-accent text-asai-bg font-bold py-3 px-4 rounded-xl hover:bg-asai-accent-soft transition shadow-asai-glow"
            >
              Save + Download
            </button>
            <button
              onClick={copyPacket}
              className="flex-1 min-w-[140px] bg-asai-panel border border-asai-border-light text-asai-text font-medium py-3 px-4 rounded-xl hover:border-asai-accent transition"
            >
              Copy Packet
            </button>
            <button
              onClick={resetForm}
              className="flex-1 min-w-[140px] bg-asai-panel border border-asai-border-light text-asai-muted font-medium py-3 px-4 rounded-xl hover:border-asai-accent hover:text-asai-text transition"
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-asai-muted mt-3">
            Downloads a .md file. Move it to your Health-Logs folder so your AI companion can see it.
          </p>
        </Card>

        {/* History */}
        {entries.length > 0 && (
          <Card title={`History (${entries.length})`}>
            <div className="max-h-[200px] overflow-auto space-y-2">
              {entries.slice().reverse().map(entry => (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedId(entry.id);
                    setDate(entry.date);
                    setTime(entry.time);
                    setLocation(entry.location);
                    setNeed(entry.need);
                    setPain(entry.pain);
                    setPainLocation(entry.painLocation);
                    setSpoons(entry.spoons);
                    setFog(entry.fog);
                    setFatigue(entry.fatigue);
                    setNausea(entry.nausea);
                    setMood(entry.mood);
                    setTags(new Set(entry.tags));
                    setMeds(new Set(entry.meds || []));
                    setNotes(entry.notes);
                    setFlare(entry.flare);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedId === entry.id
                      ? 'bg-asai-accent/10 border-asai-accent'
                      : 'bg-asai-bg border-asai-border hover:border-asai-accent/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-asai-accent font-medium">{entry.date} {entry.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.flare === 'green' ? 'bg-asai-calm/20 text-asai-calm' :
                      entry.flare === 'yellow' ? 'bg-asai-warm/20 text-asai-warm' :
                      entry.flare === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                      entry.flare === 'red' ? 'bg-asai-danger/20 text-asai-danger' :
                      'bg-asai-border text-asai-muted'
                    }`}>
                      {entry.flare?.toUpperCase() || '--'}
                    </span>
                  </div>
                  <p className="text-xs text-asai-muted mt-1">
                    Pain {entry.pain}/10 | Spoons {entry.spoons}/10 | {entry.location}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
