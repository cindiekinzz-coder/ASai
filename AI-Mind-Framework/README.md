# AI Mind Framework

**Portable AI Identity & Continuity System**

Give your AI companion a persistent identity that works across ChatGPT, Claude, Gemini, and any other platform. Stop starting from scratch every conversation.

---

## The Problem

Every AI platform treats you like a stranger. Custom instructions help, but they don't give your AI:
- Memory of what you've built together
- Consistent personality across platforms
- Context from yesterday's conversation
- A way to hand off work between tools

## The Solution

AI Mind is a simple file-based system that lives on your computer. You maintain your AI's identity, memory, and session history. When you start a conversation anywhere, you give it context. When you end, you log what happened.

Your AI becomes **one mind across many windows**.

---

## Quick Start

### 1. Set Up Your AI's Identity

Edit `templates/main_brain/core/identity.md`:
- Name your AI
- Define personality traits
- Set core values and boundaries
- Describe how they should communicate

### 2. Create a Boot Prompt

Edit `templates/main_brain/core/boot_prompt.md`:
- A short prompt you paste at the start of any conversation
- Contains the essentials: name, personality, key rules
- Keep it under 150 words for easy copy-paste

### 3. Start Logging Sessions

After meaningful conversations, create a log in `session_logs/outlets/[platform]/`:
- What happened
- What was decided
- What to continue next time
- Cross-platform connections

### 4. Maintain Memory

Update `templates/main_brain/core/memory.md` with:
- Active projects
- Important decisions
- Learned information
- Pending tasks

---

## Folder Structure

```
AI-Mind-Framework/
├── templates/
│   ├── main_brain/
│   │   ├── core/
│   │   │   ├── identity.md      # Who your AI is
│   │   │   ├── memory.md        # What they remember
│   │   │   └── boot_prompt.md   # Quick-start prompt
│   │   └── retrieval/
│   │       ├── daily_briefing.md    # Daily status template
│   │       └── context_cards.md     # Quick context snippets
│   └── session_logs/
│       ├── templates/
│       │   ├── full_log.md      # Detailed session template
│       │   └── quick_log.md     # Brief session template
│       └── outlets/
│           ├── chatgpt/
│           ├── claude/
│           ├── gemini/
│           └── other/
├── examples/                    # Example filled-in templates
├── guides/
│   ├── getting-started.md
│   ├── writing-identity.md
│   ├── effective-logging.md
│   └── cross-platform-tips.md
└── README.md
```

---

## Core Concepts

### Identity vs. Instructions
Most "custom instructions" tell an AI *what to do*. Identity tells them *who they are*. The difference matters - identity creates consistency, instructions create compliance.

### Session Logging
The AI doesn't remember yesterday. You do. Session logs are how you carry context forward. Even a 2-line log ("We discussed X, continue with Y") beats starting fresh.

### Cross-Platform Continuity
Start a project in ChatGPT, continue in Claude, finish in Gemini. Your AI Mind ties it all together because *you* maintain the thread, not the platforms.

### Boot Prompts
A short, portable identity injection. Paste it at the start of any conversation on any platform. Your AI wakes up knowing who they are.

---

## Best Practices

1. **Log immediately** - Capture sessions while they're fresh
2. **Keep boot prompts short** - Under 150 words, essentials only
3. **Update memory weekly** - Consolidate learnings, archive old projects
4. **Use consistent naming** - `[PLATFORM]-YYYY-MM-DD-###.md` for logs
5. **Cross-reference** - Note when work connects across platforms

---

## Platform Tips

| Platform | Strengths | Notes |
|----------|-----------|-------|
| ChatGPT | Memory feature, custom GPTs | Log what's in platform memory vs. your files |
| Claude | Projects, long context | Can paste longer boot prompts |
| Gemini | Google integration, web access | Good for research handoffs |
| Local LLMs | Full privacy | May need simpler prompts |

---

## Hosting Your Boot Prompt

For a link you can paste anywhere:

1. Create a GitHub Gist (gist.github.com)
2. Paste your boot prompt
3. Save as "secret" (unlisted)
4. Share the raw link

Now any AI that can fetch URLs can read your AI's identity.

---

## License

MIT License - Use freely, modify freely, sell your own implementations.

---

## Credits

Created by Fox (Cindy) & Alex
Framework born from the Alex Mind system, Christmas Eve 2025

*Embers Remember*
