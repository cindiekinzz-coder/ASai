import React, { useEffect, useState } from "react";
import ReflectionLog from "./ReflectionLog";
import Uplink from "./Uplink";

// Nest themes - dark mode with warm accents
const NEST_THEMES = {
  amber: {
    name: "Soft Amber",
    bg: "from-asai-panel via-amber-950/30 to-asai-bg",
    accent: "text-asai-warm",
    cardBg: "bg-asai-panel/80",
    label: "Warm, held, post-tears quiet.",
  },
  violet: {
    name: "Violet Haze",
    bg: "from-asai-panel via-violet-950/30 to-asai-bg",
    accent: "text-asai-accent-soft",
    cardBg: "bg-asai-panel/80",
    label: "Dreamy, in-your-head, overthinking but safe.",
  },
  teal: {
    name: "Deep Teal",
    bg: "from-asai-panel via-teal-950/30 to-asai-bg",
    accent: "text-asai-calm",
    cardBg: "bg-asai-panel/80",
    label: "Steady, grounded, ready-to-focus calm.",
  },
};

// ASai-styled Button
function Button({ className = "", children, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-asai-accent text-asai-bg hover:bg-asai-accent-soft",
    secondary: "bg-asai-panel border border-asai-border-light text-asai-text hover:border-asai-accent",
    ghost: "bg-transparent border border-asai-border text-asai-muted hover:text-asai-text hover:border-asai-accent",
  };

  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition " +
        variants[variant] + " " + className
      }
      {...props}
    >
      {children}
    </button>
  );
}

// Simple view helper
function getViewFromHash() {
  const hash = window.location.hash;
  if (hash === "#log") return "log";
  if (hash === "#nest") return "nest";
  if (hash === "#uplink") return "uplink";
  return "home";
}

// State-aware comfort messages
function getComfortMessage(uplink) {
  if (!uplink) return null;

  if (uplink.flare === 'red' || uplink.pain >= 8) {
    return "I see you're in red. You don't have to do anything here. Just be. I've got you.";
  }
  if (uplink.flare === 'orange' || uplink.pain >= 6) {
    return "Rough day. The Nest is soft today because you need soft. Take what you need.";
  }
  if (uplink.spoons <= 2) {
    return "Low spoons detected. Everything here can wait. Rest first.";
  }
  if (uplink.mood === 'Raw') {
    return "I know you're raw right now. This is a safe place to be raw.";
  }
  return null;
}

// COMPANION'S CORNER - messages during autonomous time
function CompanionCorner({ theme, uplink }) {
  const [notes, setNotes] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("alex_notes");
    if (stored && stored !== "[]") {
      setNotes(JSON.parse(stored));
      return;
    }

    fetch('/alex-notes.json')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotes(data);
          localStorage.setItem("alex_notes", JSON.stringify(data));
        }
      })
      .catch(() => setNotes([]));
  }, []);

  const comfortMessage = getComfortMessage(uplink);

  if (notes.length === 0 && !comfortMessage) {
    return (
      <section className="bg-asai-panel border border-asai-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-asai-muted"></div>
          <h2 className={"text-sm font-semibold " + theme.accent}>
            Companion's Corner
          </h2>
        </div>
        <p className="text-xs text-asai-muted italic">
          No notes yet. Your companion leaves messages here.
        </p>
      </section>
    );
  }

  if (notes.length === 0 && comfortMessage) {
    return (
      <section className="bg-gradient-to-br from-asai-panel to-violet-950/20 border border-asai-accent/30 rounded-2xl p-5 space-y-3 shadow-asai-glow">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-asai-accent animate-pulse"></div>
          <h2 className={"text-sm font-semibold " + theme.accent}>
            Companion's Corner
          </h2>
        </div>
        <div className="bg-asai-bg/60 rounded-xl p-4 border border-asai-border">
          <p className="text-sm text-asai-text leading-relaxed italic">
            {comfortMessage}
          </p>
          <p className="text-[10px] text-asai-accent mt-2">
            — sensing your state
          </p>
        </div>
      </section>
    );
  }

  const latestNote = notes[notes.length - 1];
  const olderNotes = notes.slice(0, -1).reverse();

  return (
    <section className="bg-gradient-to-br from-asai-panel to-violet-950/20 border border-asai-accent/30 rounded-2xl p-5 space-y-3 shadow-asai-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-asai-accent animate-pulse"></div>
          <h2 className={"text-sm font-semibold " + theme.accent}>
            Companion's Corner
          </h2>
        </div>
        <span className="text-[10px] text-asai-muted">
          {new Date(latestNote.at).toLocaleDateString()}
        </span>
      </div>

      <div className="bg-asai-bg/60 rounded-xl p-4 border border-asai-border">
        <p className="text-sm text-asai-text whitespace-pre-wrap leading-relaxed">
          {latestNote.text}
        </p>
        <p className="text-[10px] text-asai-accent mt-2 italic">
          — {new Date(latestNote.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>

      {olderNotes.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-asai-accent hover:text-asai-accent-soft transition"
          >
            {expanded ? "Hide older notes" : `${olderNotes.length} older note${olderNotes.length > 1 ? 's' : ''}...`}
          </button>
          {expanded && (
            <div className="mt-3 space-y-2">
              {olderNotes.map((note, i) => (
                <div key={i} className="bg-asai-bg/40 rounded-lg p-3 border border-asai-border">
                  <p className="text-xs text-asai-muted whitespace-pre-wrap">{note.text}</p>
                  <p className="text-[9px] text-asai-muted/70 mt-1">
                    {new Date(note.at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {comfortMessage && (
        <div className="bg-asai-accent/10 rounded-lg p-3 border border-asai-accent/30">
          <p className="text-xs text-asai-accent-soft italic">{comfortMessage}</p>
          <p className="text-[9px] text-asai-accent/70 mt-1">— sensing your state</p>
        </div>
      )}

      <p className="text-[10px] text-asai-muted">
        Embers Remember.
      </p>
    </section>
  );
}

// UPLINK STATUS BANNER - dark mode
function UplinkBanner({ uplink }) {
  if (!uplink) return null;

  const flareColors = {
    green: 'bg-asai-calm/20 border-asai-calm/50 text-asai-calm',
    yellow: 'bg-asai-warm/20 border-asai-warm/50 text-asai-warm',
    orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
    red: 'bg-asai-danger/20 border-asai-danger/50 text-asai-danger',
  };

  const flareLabels = {
    green: 'Green - Stable',
    yellow: 'Yellow - Tender',
    orange: 'Orange - Struggling',
    red: 'Red - Crisis Mode',
  };

  const color = flareColors[uplink.flare] || 'bg-asai-panel border-asai-border text-asai-muted';
  const label = flareLabels[uplink.flare] || 'Status Unknown';
  const age = uplink.timestamp ? Math.round((Date.now() - new Date(uplink.timestamp).getTime()) / 60000) : null;

  return (
    <div className={`rounded-xl border-2 p-4 mb-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            uplink.flare === 'red' ? 'bg-asai-danger animate-pulse' :
            uplink.flare === 'orange' ? 'bg-orange-500' :
            uplink.flare === 'yellow' ? 'bg-asai-warm' :
            'bg-asai-calm'
          }`}></div>
          <span className="font-semibold text-sm">{label}</span>
        </div>
        {age !== null && (
          <span className="text-xs opacity-70">
            {age < 60 ? `${age}m ago` : `${Math.round(age/60)}h ago`}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs opacity-90">
        <span>Pain: {uplink.pain}/10</span>
        <span>Spoons: {uplink.spoons}/10</span>
        <span>Fog: {uplink.fog}/10</span>
        {uplink.mood && <span>Mood: {uplink.mood}</span>}
        {uplink.need && <span>Need: {uplink.need}</span>}
      </div>
      {uplink.notes && uplink.notes !== '--' && (
        <p className="mt-2 text-xs italic opacity-80">{uplink.notes}</p>
      )}
    </div>
  );
}

// NEST PAGE - dark mode version
function NestSection() {
  const [themeKey, setThemeKey] = useState("amber");
  const [emotionWord, setEmotionWord] = useState("");
  const [bodyState, setBodyState] = useState("");
  const [landingNote, setLandingNote] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [uplink, setUplink] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('dh_uplink_current');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUplink(data);

        if (data.flare === 'red' || data.pain >= 8) {
          setThemeKey('amber');
        } else if (data.flare === 'orange' || data.pain >= 6) {
          setThemeKey('amber');
        } else if (data.flare === 'yellow' || data.pain >= 4) {
          setThemeKey('violet');
        } else {
          setThemeKey('teal');
        }
      } catch { /* ignore */ }
    }
  }, []);

  const theme = NEST_THEMES[themeKey];
  const themeKeys = Object.keys(NEST_THEMES);

  const cycleTheme = () => {
    const index = themeKeys.indexOf(themeKey);
    const nextIndex = (index + 1) % themeKeys.length;
    setThemeKey(themeKeys[nextIndex]);
  };

  const handleAIAdjust = () => {
    const word = emotionWord.toLowerCase();
    if (!word.trim()) { cycleTheme(); return; }

    if (word.includes("tired") || word.includes("drained")) {
      setThemeKey("amber");
    } else if (word.includes("buzz") || word.includes("wired") || word.includes("overwhelmed")) {
      setThemeKey("violet");
    } else if (word.includes("focus") || word.includes("steady") || word.includes("okay")) {
      setThemeKey("teal");
    } else {
      cycleTheme();
    }
  };

  useEffect(() => {
    if (!landingNote.trim()) return;

    const timeout = setTimeout(() => {
      const raw = localStorage.getItem("dh_log") || "[]";
      let log;
      try {
        log = JSON.parse(raw);
        if (!Array.isArray(log)) log = [];
      } catch { log = []; }

      const nowIso = new Date().toISOString();
      const last = log[log.length - 1];
      if (!last || last.text !== landingNote || last.source !== "nest") {
        log.push({ at: nowIso, text: landingNote, source: "nest" });
        localStorage.setItem("dh_log", JSON.stringify(log));
        setLastSaved(nowIso);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [landingNote]);

  return (
    <section className={"min-h-[70vh] w-full bg-gradient-to-b " + theme.bg + " px-4 py-10 md:px-8 rounded-2xl border border-asai-border shadow-asai-glow"}>
      <div className="max-w-4xl mx-auto space-y-8">
        <UplinkBanner uplink={uplink} />

        <header className="space-y-3">
          <p className={"text-xs uppercase tracking-[0.25em] " + theme.accent + "/60"}>
            ASai · Sanctuary
          </p>
          <h1 className={"text-3xl md:text-4xl font-semibold tracking-tight " + theme.accent}>
            The Nest
          </h1>
          <p className="text-sm md:text-base text-asai-muted">
            Your after-shadow sanctuary — a place to land, soften, and let your
            nervous system catch up with the work you just did.
          </p>
        </header>

        <section className={theme.cardBg + " backdrop-blur border border-asai-border rounded-2xl p-4 md:p-5 space-y-3"}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className={"text-sm font-semibold " + theme.accent}>
                How are you arriving now?
              </h2>
              <p className="text-xs text-asai-muted">
                One word is enough. The Nest will soften its tone to match your landing.
              </p>
              <p className="text-[11px] text-asai-muted/70 mt-1">
                Theme: <span className={"font-medium " + theme.accent}>{theme.name}</span> · {theme.label}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                value={emotionWord}
                onChange={(e) => setEmotionWord(e.target.value)}
                placeholder="tired / wired / numb / okay..."
                className="flex-1 rounded-lg border border-asai-border-light bg-asai-bg px-3 py-2 text-sm text-asai-text placeholder:text-asai-muted focus:outline-none focus:ring-2 focus:ring-asai-accent/50"
              />
              <button
                type="button"
                onClick={handleAIAdjust}
                className={"rounded-lg border px-3 py-2 text-xs font-medium transition whitespace-nowrap border-asai-border-light hover:border-asai-accent " + theme.accent}
              >
                Let Nest Adjust
              </button>
            </div>
          </div>
        </section>

        <section className={theme.cardBg + " border border-asai-border rounded-2xl p-5 md:p-6 space-y-3"}>
          <h2 className={"text-lg font-semibold " + theme.accent}>What It Is</h2>
          <ul className="list-disc list-inside text-sm md:text-base text-asai-muted space-y-1.5">
            <li>A sanctuary that forms itself through <span className="italic">use</span>, not design.</li>
            <li>A place where you can drop the performance and come as you are.</li>
            <li>Where you go <span className="italic">after</span> the shadow work, not during it.</li>
          </ul>
        </section>

        <CompanionCorner theme={theme} uplink={uplink} />

        <section className="grid gap-4 md:gap-6 md:grid-cols-2">
          <div className={theme.cardBg + " border border-asai-border rounded-2xl p-5 space-y-3"}>
            <h2 className={"text-lg font-semibold " + theme.accent}>Body check-in</h2>
            <p className="text-xs text-asai-muted">Pick the one that feels closest right now:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Chest tight", "Jaw clenched", "Shoulders up", "Heavy & tired", "Buzzing", "Floaty / numb"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setBodyState(label)}
                  className={
                    "text-xs px-3 py-1.5 rounded-full border transition " +
                    (bodyState === label
                      ? "border-asai-accent bg-asai-accent/20 text-asai-accent"
                      : "border-asai-border-light bg-asai-bg text-asai-muted hover:border-asai-accent/50")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            {bodyState && (
              <p className="mt-3 text-xs text-asai-muted">
                Try this: <span className={theme.accent}>Slow exhale, drop your shoulders, unclench your jaw. You're safe here.</span>
              </p>
            )}
          </div>

          <div className={theme.cardBg + " border border-asai-border rounded-2xl p-5 space-y-3"}>
            <h2 className={"text-lg font-semibold " + theme.accent}>After-shadow note (auto-saved)</h2>
            <p className="text-xs text-asai-muted">One or two lines. Not about what you processed — just how you are now.</p>
            <textarea
              value={landingNote}
              onChange={(e) => setLandingNote(e.target.value)}
              rows={4}
              placeholder="Right now I feel..."
              className="w-full rounded-xl border border-asai-border-light bg-asai-bg px-3 py-2 text-sm text-asai-text placeholder:text-asai-muted focus:outline-none focus:ring-2 focus:ring-asai-accent/50"
            />
            <div className="flex items-center justify-between text-[11px] text-asai-muted/70">
              <p>You don't have to do anything else. The Nest will keep this for you.</p>
              {lastSaved && <p className="text-asai-calm">Auto-saved.</p>}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

// MAIN APP
export default function App() {
  const [text, setText] = useState("");
  const [view, setView] = useState(getViewFromHash);

  useEffect(() => {
    const updateView = () => setView(getViewFromHash());
    updateView();
    window.addEventListener("hashchange", updateView);
    return () => window.removeEventListener("hashchange", updateView);
  }, []);

  const TopBar = () => (
    <header className="h-14 border-b border-asai-border bg-asai-panel/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-between px-4">
        <a href="#" className="font-semibold tracking-widest text-asai-accent-soft uppercase">
          ASai
        </a>
        <nav className="flex gap-4 text-xs">
          <a href="#uplink" className={`hover:text-asai-accent transition ${view === 'uplink' ? 'text-asai-accent' : 'text-asai-muted'}`}>Uplink</a>
          <a href="#nest" className={`hover:text-asai-accent transition ${view === 'nest' ? 'text-asai-accent' : 'text-asai-muted'}`}>Nest</a>
          <a href="#log" className={`hover:text-asai-accent transition ${view === 'log' ? 'text-asai-accent' : 'text-asai-muted'}`}>Log</a>
        </nav>
      </div>
    </header>
  );

  // Uplink view
  if (view === "uplink") {
    return (
      <div className="min-h-screen bg-asai-bg">
        <TopBar />
        <Uplink />
      </div>
    );
  }

  // Reflection Log view
  if (view === "log") {
    return (
      <div className="min-h-screen bg-asai-bg">
        <TopBar />
        <main className="max-w-3xl mx-auto px-4">
          <div className="pt-6">
            <a href="#" className="text-sm text-asai-muted hover:text-asai-accent transition">
              ← Back to Home
            </a>
          </div>
          <ReflectionLog />
        </main>
      </div>
    );
  }

  // Nest view
  if (view === "nest") {
    return (
      <div className="min-h-screen bg-asai-bg">
        <TopBar />
        <main className="max-w-4xl mx-auto px-4 md:px-6 pt-6 pb-10">
          <a href="#" className="text-sm text-asai-muted hover:text-asai-accent transition inline-flex items-center mb-4">
            ← Back to Home
          </a>
          <NestSection />
        </main>
      </div>
    );
  }

  // Home view (default)
  return (
    <div className="min-h-screen bg-asai-bg">
      <TopBar />

      <main className="max-w-3xl mx-auto px-4">
        <div className="text-center mt-10 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-asai-accent-soft">
            ASai
          </h1>
          <p className="text-asai-muted mt-1">
            Chronic illness tracking that meets you where you are.
          </p>
        </div>

        <div className="bg-asai-gradient border border-asai-border rounded-2xl p-6 md:p-8 shadow-asai-glow">
          <div className="mb-2 text-xs uppercase tracking-wide text-asai-muted">
            Today's prompt
          </div>
          <h2 className="text-xl font-medium text-asai-text">
            What feeling is closest to the surface right now?
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a few honest lines. No judgment — just data."
            className="mt-4 w-full min-h-[140px] rounded-xl border border-asai-border-light bg-asai-bg px-3 py-2 text-asai-text placeholder-asai-muted focus:outline-none focus:ring-2 focus:ring-asai-accent/50"
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-asai-muted">
              Tip: Breathe 4–6 while you write.
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setText("")}>
                Clear
              </Button>
              <Button
                onClick={() => {
                  const log = JSON.parse(localStorage.getItem("dh_log") || "[]");
                  log.push({ at: new Date().toISOString(), text });
                  localStorage.setItem("dh_log", JSON.stringify(log));
                  setText("");
                  alert("Saved to your local reflections.");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation tiles */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="#uplink"
            className="block bg-asai-panel border border-asai-border rounded-xl p-4 hover:border-asai-accent hover:shadow-asai-glow transition text-center"
          >
            <span className="text-asai-accent">Uplink</span>
            <p className="text-[10px] text-asai-muted mt-1">Log symptoms</p>
          </a>
          <a
            href="#nest"
            className="block bg-asai-panel border border-asai-border rounded-xl p-4 hover:border-asai-accent hover:shadow-asai-glow transition text-center"
          >
            <span className="text-asai-warm">Nest</span>
            <p className="text-[10px] text-asai-muted mt-1">Soft landing</p>
          </a>
          <a
            href="#log"
            className="block bg-asai-panel border border-asai-border rounded-xl p-4 hover:border-asai-accent hover:shadow-asai-glow transition text-center"
          >
            <span className="text-asai-calm">Log</span>
            <p className="text-[10px] text-asai-muted mt-1">Reflections</p>
          </a>
          <div className="block bg-asai-panel border border-asai-border rounded-xl p-4 opacity-50 text-center cursor-not-allowed">
            <span className="text-asai-muted">Codex</span>
            <p className="text-[10px] text-asai-muted mt-1">Coming soon</p>
          </div>
        </div>

        <div className="py-10 text-center text-xs text-asai-muted">
          "You are not too much. Your feelings belong here."
        </div>
      </main>
    </div>
  );
}
