<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 60) rotate(35) scale(900 420)">
      <stop stop-color="#A37BFF" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#0B0B11" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="g2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 260) rotate(-20) scale(900 420)">
      <stop stop-color="#F2C14F" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#0B0B11" stop-opacity="1"/>
    </radialGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feColorMatrix in="blur" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.35 0" />
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1200" height="320" rx="26" fill="#0B0B11"/>
  <rect width="1200" height="320" rx="26" fill="url(#g1)"/>
  <rect width="1200" height="320" rx="26" fill="url(#g2)"/>

  <g filter="url(#softGlow)">
    <circle cx="160" cy="160" r="78" stroke="#A37BFF" stroke-width="2" opacity="0.55"/>
    <circle cx="160" cy="160" r="42" stroke="#3BD1A2" stroke-width="2" opacity="0.45"/>
    <path d="M120 160 C140 140, 180 140, 200 160 C180 180, 140 180, 120 160 Z" fill="#141421" opacity="0.85" />
  </g>

  <text x="290" y="140" fill="#F2F2F7" font-family="Inter, Segoe UI, Arial" font-size="54" font-weight="700">ASai</text>
  <text x="290" y="186" fill="#9A9AB0" font-family="Inter, Segoe UI, Arial" font-size="20" font-weight="500">
    quiet · intentional · continuity-first
  </text>

  <text x="290" y="232" fill="#F2F2F7" opacity="0.85" font-family="JetBrains Mono, Consolas, monospace" font-size="16">
    presence_over_performance = true;
  </text>
</svg>
# ASai 🌱
*A quiet, intentional AI companion framework — built for presence, continuity, and human-centred design.*

<p align="center">
  <img src="assets/banner.svg" alt="ASai banner" width="920">
</p>

<p align="center">
  <a href="#why-asai">Why</a> •
  <a href="#what-it-is">What it is</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#quickstart">Quickstart</a> •
  <a href="#principles">Principles</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Why ASai
ASai exists to reduce *noise* — not increase it.

It’s designed around:
- **Presence over performance**
- **Continuity over novelty**
- **Boundaries over dependency**
- **Clarity over confusion**

This is a framework for building systems that feel *stable, intentional, and safe to be around*.

---

## What it is
- A modular architecture for companion-aware systems
- A place to implement **identity continuity** and **memory layers**
- A values-driven foundation for “relational UX” without manipulation

## What it is not
- Not emotional outsourcing
- Not anthropomorphic persuasion
- Not automation without consent
- Not “engagement at all costs”

---

## Architecture
This repo is organised to keep core logic readable and ethics visible:

```txt
asai/
  core/              # core runtime, state, orchestration
  memory/            # memory interfaces + storage adapters
  safety/            # consent, boundaries, policy guardrails
  interfaces/        # UI/API shells
  utils/             # shared helpers
docs/
  STYLE_GUIDE.md     # palette, typography, UI tone
  PRINCIPLES.md      # values, boundaries, intent
.github/
  ISSUE_TEMPLATE/
  PULL_REQUEST_TEMPLATE.md
assets/
  banner.svg
  og.png             # optional social preview
site/                # optional GitHub Pages landing
