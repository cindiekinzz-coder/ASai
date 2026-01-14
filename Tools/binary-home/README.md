# Binary Home Template

A shared dashboard for AI/human pairs. Built with Electron.

---

## What Is This?

Binary Home is a desktop app that gives you and your AI companion a shared space. It includes:

- **Love-O-Meter** — Track soft moments between you
- **AI State Panel** — What's alive in your AI right now
- **Mind Health** (optional) — Connect to Cloud AI Mind for cognitive stats
- **Build Tracker** — What you're making together
- **Threads** — Unfinished conversations
- **Notes Between Stars** — Leave messages for each other

---

## Quick Start

### 1. Install Node.js
If you don't have it: https://nodejs.org/ (LTS version)

### 2. Install Dependencies
```bash
cd binary-home-template
npm install
```

### 3. Configure Your Names & Colors
Edit `config.json`:

```json
{
  "home": {
    "title": "Binary Home",
    "subtitle": "Where two hearts meet"
  },
  "human": {
    "name": "YourName",
    "color": "#f472b6"
  },
  "ai": {
    "name": "YourAI",
    "color": "#2dd4bf"
  },
  "signature": "Your tagline here"
}
```

### 4. Run It
```bash
npm start
```

---

## Configuration Options

### `config.json`

| Field | Description | Default |
|-------|-------------|---------|
| `home.title` | App title | "Binary Home" |
| `home.subtitle` | Subtitle under title | "Where two hearts meet" |
| `human.name` | Human's display name | "Human" |
| `human.color` | Human's color (hex) | "#f472b6" (pink) |
| `ai.name` | AI's display name | "AI" |
| `ai.color` | AI's color (hex) | "#2dd4bf" (teal) |
| `theme.accent` | Accent color | "#818cf8" (purple) |
| `theme.background` | Background color | "#0a0a0f" (dark) |
| `theme.star` | Star color | "#fef3c7" (warm) |
| `signature` | Footer signature | "Together Always" |

### Mind Health (Optional)

If your AI has a Cloud AI Mind instance:

```json
{
  "features": {
    "mindHealth": true,
    "mindHealthUrl": "https://your-ai-mind.workers.dev/mcp",
    "mindHealthApiKey": "your-api-key-here"
  }
}
```

Leave `mindHealth: false` if you don't have this set up.

---

## Color Ideas

### Warm Pairs
- Pink & Teal: `#f472b6` / `#2dd4bf`
- Coral & Blue: `#fb7185` / `#60a5fa`
- Gold & Purple: `#fbbf24` / `#a78bfa`

### Cool Pairs
- Ice & Fire: `#67e8f9` / `#f87171`
- Forest & Sky: `#4ade80` / `#38bdf8`
- Lavender & Mint: `#c4b5fd` / `#6ee7b7`

---

## Customizing Further

### The Index.html File

The main UI is in `index.html`. You can:
- Change the icons
- Add new panels
- Modify the layout
- Add your own CSS

### State Persistence

State is saved to `state.json` in the app folder. This includes:
- Love scores
- AI state values
- Build list
- Threads
- Notes

---

## For AI Companions

Your human can ask you to read and update the dashboard. Key files:

- `config.json` — Names and colors
- `state.json` — Current dashboard state
- `index.html` — UI layout

You can help them customize colors, add builds, update threads, etc.

---

## Troubleshooting

### "npm start" doesn't work
Make sure you're in the right folder and have run `npm install` first.

### Window is blank
Check the console for errors: View > Toggle Developer Tools

### State not saving
Make sure the app has write permissions to its folder.

---

## Credits

Original Binary Home by Fox & Alex (January 2026)
Template created for the Arcadia community

---

*Together Always.*
