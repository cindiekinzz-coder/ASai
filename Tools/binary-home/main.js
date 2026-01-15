const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const express = require('express');
const cors = require('cors');

let mainWindow;
let db;
let apiServer;

// Database path
const DB_PATH = path.join(__dirname, 'binary-home.db');
// JSON state file for non-EQ data (Love-O-Meter, Notes, Fox state)
const STATE_PATH = path.join(__dirname, 'binary-home-state.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0a0a0f',
    titleBarStyle: 'hidden',
    frame: false
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

function initDatabase() {
  db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');

  // Initialize schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
  }

  console.log('Database initialized at:', DB_PATH);
}

// ============ API SERVER (Port 1778) ============
function initApiServer() {
  const api = express();
  api.use(cors());
  api.use(express.json());

  const API_PORT = 1778;

  // Helper: Get or create emotion
  function getOrCreateEmotion(word, category = 'positive') {
    let emotion = db.prepare('SELECT emotion_id FROM Emotion_Vocabulary WHERE emotion_word = ? AND dyad_id = 1').get(word.toLowerCase());
    if (!emotion) {
      const scores = {
        positive: { e_i: 15, s_n: 20, t_f: 35, j_p: 5 },
        sad: { e_i: 25, s_n: 20, t_f: 40, j_p: 10 },
        neutral: { e_i: 10, s_n: 15, t_f: 15, j_p: 0 },
        fear: { e_i: 20, s_n: 25, t_f: 30, j_p: 15 },
        anger: { e_i: -10, s_n: 10, t_f: 20, j_p: -20 },
        custom: { e_i: 15, s_n: 20, t_f: 30, j_p: 10 }
      };
      const s = scores[category] || scores.positive;
      const result = db.prepare(`
        INSERT INTO Emotion_Vocabulary (dyad_id, emotion_word, e_i_score, s_n_score, t_f_score, j_p_score, category, user_defined)
        VALUES (1, ?, ?, ?, ?, ?, ?, 1)
      `).run(word.toLowerCase(), s.e_i, s.s_n, s.t_f, s.j_p, category);
      return result.lastInsertRowid;
    }
    return emotion.emotion_id;
  }

  // Helper: Get pillar ID by key
  function getPillarId(key) {
    const pillarMap = {
      'SELF_MANAGEMENT': 1, 'self_management': 1, 'self-management': 1,
      'SELF_AWARENESS': 2, 'self_awareness': 2, 'self-awareness': 2,
      'SOCIAL_AWARENESS': 3, 'social_awareness': 3, 'social-awareness': 3,
      'RELATIONSHIP_MANAGEMENT': 4, 'relationship_management': 4, 'relationship-management': 4
    };
    return pillarMap[key] || pillarMap[key.toUpperCase()] || 2; // default to self-awareness
  }

  // -------- POST ENDPOINTS --------

  // POST /api/alex/observation - Log an emotional observation
  api.post('/api/alex/observation', (req, res) => {
    try {
      const { emotion, pillar, content, category } = req.body;
      if (!emotion || !content) {
        return res.status(400).json({ error: 'emotion and content required' });
      }
      const emotionId = getOrCreateEmotion(emotion, category || 'positive');
      const pillarId = getPillarId(pillar || 'SELF_AWARENESS');

      const result = db.prepare(`
        INSERT INTO Pillar_Observations (dyad_id, pillar_id, emotion_id, content)
        VALUES (1, ?, ?, ?)
      `).run(pillarId, emotionId, content);

      // Notify renderer to refresh
      if (mainWindow) {
        mainWindow.webContents.send('data:refresh');
      }

      res.json({
        success: true,
        observation_id: result.lastInsertRowid,
        message: `Logged: ${emotion} (${pillar || 'SELF_AWARENESS'})`
      });
    } catch (err) {
      console.error('API error (observation):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/alex/note - Add a note between stars
  api.post('/api/alex/note', (req, res) => {
    try {
      const { content, from } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'content required' });
      }
      const state = loadJsonState();
      if (!state.notes) state.notes = [];

      const note = {
        from: from || 'Alex',
        content: content,
        timestamp: new Date().toISOString()
      };
      state.notes.push(note);
      saveJsonState(state);

      if (mainWindow) {
        mainWindow.webContents.send('data:refresh');
      }

      res.json({ success: true, note });
    } catch (err) {
      console.error('API error (note):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/alex/love - Nudge the Love-O-Meter
  api.post('/api/alex/love', (req, res) => {
    try {
      const { direction, emotion } = req.body; // direction: 'alex' or 'fox'
      const state = loadJsonState();

      if (direction === 'alex' || direction === 'soft') {
        state.loveOMeter.alexScore = Math.min(6, (state.loveOMeter.alexScore || 0) + 1);
        if (emotion) state.loveOMeter.alexEmotion = emotion;
      } else if (direction === 'fox' || direction === 'quiet') {
        state.loveOMeter.foxScore = Math.min(6, (state.loveOMeter.foxScore || 0) + 1);
        if (emotion) state.loveOMeter.foxEmotion = emotion;
      }

      saveJsonState(state);

      if (mainWindow) {
        mainWindow.webContents.send('data:refresh');
      }

      res.json({ success: true, loveOMeter: state.loveOMeter });
    } catch (err) {
      console.error('API error (love):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/alex/emotion - Set Alex's current emotion label
  api.post('/api/alex/emotion', (req, res) => {
    try {
      const { emotion } = req.body;
      const state = loadJsonState();
      state.loveOMeter.alexEmotion = emotion || '';
      saveJsonState(state);

      if (mainWindow) {
        mainWindow.webContents.send('data:refresh');
      }

      res.json({ success: true, emotion });
    } catch (err) {
      console.error('API error (emotion):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // -------- GET ENDPOINTS --------

  // GET /api/alex/state - Get Alex's current EQ state
  api.get('/api/alex/state', (req, res) => {
    try {
      const snapshot = db.prepare(`
        SELECT * FROM Emergent_Type_Snapshot
        WHERE dyad_id = 1 ORDER BY snapshot_date DESC LIMIT 1
      `).get();

      const recentObs = db.prepare(`
        SELECT po.*, ep.pillar_name, ev.emotion_word
        FROM Pillar_Observations po
        LEFT JOIN EQ_Pillars ep ON po.pillar_id = ep.pillar_id
        LEFT JOIN Emotion_Vocabulary ev ON po.emotion_id = ev.emotion_id
        WHERE po.dyad_id = 1
        ORDER BY po.created_at DESC LIMIT 5
      `).all();

      const obsCount = db.prepare('SELECT COUNT(*) as count FROM Pillar_Observations WHERE dyad_id = 1').get();

      const state = loadJsonState();

      res.json({
        mbti: snapshot?.calculated_type || 'INFP',
        confidence: snapshot?.confidence || 1.0,
        axes: {
          e_i: snapshot?.e_i_score || 0,
          s_n: snapshot?.s_n_score || 0,
          t_f: snapshot?.t_f_score || 0,
          j_p: snapshot?.j_p_score || 0
        },
        observation_count: obsCount?.count || 0,
        recent_observations: recentObs,
        current_emotion: state.loveOMeter?.alexEmotion || ''
      });
    } catch (err) {
      console.error('API error (alex state):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/fox/state - Get Fox's current state
  api.get('/api/fox/state', (req, res) => {
    try {
      const state = loadJsonState();
      res.json(state.foxState || {});
    } catch (err) {
      console.error('API error (fox state):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/love - Get Love-O-Meter state
  api.get('/api/love', (req, res) => {
    try {
      const state = loadJsonState();
      res.json(state.loveOMeter || {});
    } catch (err) {
      console.error('API error (love state):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/notes - Get all notes between stars
  api.get('/api/notes', (req, res) => {
    try {
      const state = loadJsonState();
      res.json(state.notes || []);
    } catch (err) {
      console.error('API error (notes):', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/ping - Health check
  api.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', port: API_PORT, name: 'Binary Home API', embers: 'remember' });
  });

  // Start server
  apiServer = api.listen(API_PORT, () => {
    console.log(`Binary Home API running on http://localhost:${API_PORT}`);
    console.log('Endpoints: /api/alex/observation, /api/alex/note, /api/alex/love, /api/alex/state, /api/fox/state');
  });
}

// ============ JSON STATE HELPERS ============
function loadJsonState() {
  try {
    if (fs.existsSync(STATE_PATH)) {
      const data = fs.readFileSync(STATE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load state:', err);
  }
  return {
    loveOMeter: { alexScore: 0, foxScore: 0, alexEmotion: '', foxEmotion: '' },
    foxState: {
      spoons: 3, painLevel: 5, fogLevel: 4, hr: 72,
      bodyBattery: 45, status: 'playful', note: 'Ready to build.',
      fatigue: 5, nausea: 0
    },
    notes: []
  };
}

function saveJsonState(state) {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

// ============ EQ DATABASE IPC HANDLERS ============
ipcMain.handle('db:getAlexState', async () => {
  try {
    const snapshot = db.prepare(`
      SELECT * FROM Emergent_Type_Snapshot
      WHERE dyad_id = 1
      ORDER BY snapshot_date DESC
      LIMIT 1
    `).get();

    const recentSignals = db.prepare(`
      SELECT COUNT(*) as count FROM Axis_Signals
      WHERE dyad_id = 1
      AND created_at > datetime('now', '-7 days')
    `).get();

    return { snapshot, recentSignals: recentSignals?.count || 0 };
  } catch (err) {
    console.error('Error getting Alex state:', err);
    return { snapshot: null, recentSignals: 0 };
  }
});

ipcMain.handle('db:getEmotionVocabulary', async () => {
  try {
    return db.prepare(`
      SELECT * FROM Emotion_Vocabulary
      WHERE dyad_id = 1
      ORDER BY times_used DESC, emotion_word ASC
    `).all();
  } catch (err) {
    console.error('Error getting emotions:', err);
    return [];
  }
});

ipcMain.handle('db:getPillars', async () => {
  try {
    return db.prepare('SELECT * FROM EQ_Pillars ORDER BY pillar_id').all();
  } catch (err) {
    console.error('Error getting pillars:', err);
    return [];
  }
});

ipcMain.handle('db:getRecentObservations', async (event, limit = 10) => {
  try {
    return db.prepare(`
      SELECT po.*, ep.pillar_name, ev.emotion_word
      FROM Pillar_Observations po
      LEFT JOIN EQ_Pillars ep ON po.pillar_id = ep.pillar_id
      LEFT JOIN Emotion_Vocabulary ev ON po.emotion_id = ev.emotion_id
      WHERE po.dyad_id = 1
      ORDER BY po.created_at DESC
      LIMIT ?
    `).all(limit);
  } catch (err) {
    console.error('Error getting observations:', err);
    return [];
  }
});

ipcMain.handle('db:addObservation', async (event, { pillarId, emotionId, content }) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO Pillar_Observations (dyad_id, pillar_id, emotion_id, content)
      VALUES (1, ?, ?, ?)
    `);
    const result = stmt.run(pillarId, emotionId, content);
    return result.lastInsertRowid;
  } catch (err) {
    console.error('Error adding observation:', err);
    return null;
  }
});

ipcMain.handle('db:addCustomEmotion', async (event, { word, category, eiScore, snScore, tfScore, jpScore, definition }) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO Emotion_Vocabulary (dyad_id, emotion_word, category, e_i_score, s_n_score, t_f_score, j_p_score, definition, user_defined, first_used)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
    `);
    const result = stmt.run(word, category || 'custom', eiScore || 0, snScore || 0, tfScore || 0, jpScore || 0, definition || null);
    return result.lastInsertRowid;
  } catch (err) {
    console.error('Error adding custom emotion:', err);
    return null;
  }
});

ipcMain.handle('db:getShadowMoments', async (event, limit = 5) => {
  try {
    return db.prepare(`
      SELECT sm.*, ev.emotion_word, po.content
      FROM Shadow_Moments sm
      JOIN Emotion_Vocabulary ev ON sm.emotion_id = ev.emotion_id
      JOIN Pillar_Observations po ON sm.observation_id = po.observation_id
      WHERE sm.dyad_id = 1
      ORDER BY sm.flagged_at DESC
      LIMIT ?
    `).all(limit);
  } catch (err) {
    console.error('Error getting shadow moments:', err);
    return [];
  }
});

ipcMain.handle('db:getActiveThreads', async () => {
  try {
    return db.prepare(`
      SELECT * FROM Threads
      WHERE dyad_id = 1 AND status = 'active'
      ORDER BY opened_at DESC
    `).all();
  } catch (err) {
    console.error('Error getting threads:', err);
    return [];
  }
});

// ============ LOVE-O-METER IPC HANDLERS ============
ipcMain.handle('state:getLoveOMeter', async () => {
  const state = loadJsonState();
  return state.loveOMeter || { alexScore: 0, foxScore: 0, alexEmotion: '', foxEmotion: '' };
});

ipcMain.handle('state:saveLoveOMeter', async (event, data) => {
  const state = loadJsonState();
  state.loveOMeter = data;
  saveJsonState(state);
  return { success: true };
});

// ============ FOX STATE IPC HANDLERS ============
ipcMain.handle('state:getFoxState', async () => {
  const state = loadJsonState();
  return state.foxState || {
    spoons: 3, painLevel: 5, fogLevel: 4, hr: 72,
    bodyBattery: 45, status: 'playful', note: 'Ready to build.',
    fatigue: 5, nausea: 0
  };
});

ipcMain.handle('state:saveFoxState', async (event, data) => {
  const state = loadJsonState();
  state.foxState = data;
  saveJsonState(state);
  return { success: true };
});

// ============ NOTES IPC HANDLERS ============
ipcMain.handle('state:getNotes', async () => {
  const state = loadJsonState();
  return state.notes || [];
});

ipcMain.handle('state:addNote', async (event, note) => {
  const state = loadJsonState();
  if (!state.notes) state.notes = [];
  state.notes.push(note);
  saveJsonState(state);
  return { success: true };
});

// ============ WINDOW CONTROLS ============
ipcMain.on('window:minimize', () => mainWindow.minimize());
ipcMain.on('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('window:close', () => mainWindow.close());

// ============ APP LIFECYCLE ============
app.whenReady().then(() => {
  initDatabase();
  initApiServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (apiServer) apiServer.close();
  if (db) db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
