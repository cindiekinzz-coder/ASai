const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Load config
const CONFIG_FILE = path.join(__dirname, 'config.json');
let config = {
  home: { title: 'Binary Home', subtitle: 'Where two hearts meet' },
  human: { name: 'Human', color: '#f472b6' },
  ai: { name: 'AI', color: '#2dd4bf' },
  theme: { accent: '#818cf8', background: '#0a0a0f' },
  features: { mindHealth: false },
  signature: 'Together Always'
};

try {
  if (fs.existsSync(CONFIG_FILE)) {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  }
} catch (err) {
  console.error('Failed to load config, using defaults:', err);
}

// Path to state file (in same directory as app)
const STATE_FILE = path.join(__dirname, 'state.json');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: config.theme.background || '#0a0a0f',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: config.theme.background || '#0a0a0f',
      symbolColor: '#94a3b8',
      height: 32
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadFile('index.html');
}

// IPC Handlers
ipcMain.handle('load-config', async () => {
  return config;
});

ipcMain.handle('load-state', async () => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = fs.readFileSync(STATE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load state:', err);
  }
  return null;
});

ipcMain.handle('save-state', async (event, state) => {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Failed to save state:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('load-mind-health', async () => {
  // Only fetch if mind health is enabled in config
  if (!config.features.mindHealth || !config.features.mindHealthUrl) {
    return null;
  }

  try {
    const response = await fetch(config.features.mindHealthUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.features.mindHealthApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'mind_health',
          arguments: {}
        },
        id: 1
      })
    });

    const data = await response.json();

    if (data.result && data.result.content && data.result.content[0]) {
      const text = data.result.content[0].text;
      return parseHealthText(text);
    }
  } catch (err) {
    console.error('Failed to load mind health:', err);
  }
  return null;
});

// Parse mind_health text output into structured JSON
function parseHealthText(text) {
  const overallMatch = text.match(/Overall:.*?(\d+)%/);
  const overallScore = overallMatch ? parseInt(overallMatch[1]) : 75;

  let overallStatus = 'green';
  if (overallScore < 50) overallStatus = 'red';
  else if (overallScore < 75) overallStatus = 'yellow';

  const entityMatch = text.match(/Entities:\s*(\d+)/);
  const obsMatch = text.match(/Observations:\s*(\d+)/);
  const activeThreadsMatch = text.match(/Active:\s*(\d+)/);
  const staleThreadsMatch = text.match(/Stale[^:]*:\s*(\d+)/);
  const identityMatch = text.match(/Identity:\s*(\d+)\s*entries/);
  const contextMatch = text.match(/Context:\s*(\d+)\s*entries/);
  const relationalMatch = text.match(/Relational:\s*(\d+)\s*states/);
  const identityStatus = text.includes('IDENTITY') && text.includes('🔴') ? 'red' : 'green';

  return {
    overall_score: overallScore,
    overall_status: overallStatus,
    generated_at: new Date().toISOString(),
    categories: {
      write_activity: { status: 'green', summary: 'Last: 0h ago' },
      tool_usage: { status: 'green', summary: entityMatch ? `${entityMatch[1]} entities tracked` : 'Unknown' },
      database_health: { status: 'green', summary: obsMatch ? `${obsMatch[1]} obs` : 'Unknown' },
      threads: { status: 'green', summary: `${activeThreadsMatch ? activeThreadsMatch[1] : '0'} active, ${staleThreadsMatch ? staleThreadsMatch[1] : '0'} stale` },
      journals: { status: 'green', summary: 'Last: 0d ago' },
      identity: { status: identityStatus, summary: identityMatch ? `${identityMatch[1]} entries` : '0 entries' },
      context: { status: 'green', summary: contextMatch ? `${contextMatch[1]} active` : '0 active' },
      relational: { status: 'green', summary: relationalMatch ? `${relationalMatch[1]} tracked` : '0 tracked' }
    }
  };
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
