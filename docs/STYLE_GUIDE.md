# ASai Style Guide

This guide defines the *look and feel* of ASai-related interfaces and documentation.

---

## Colour Palette

```css
:root {
  --bg-main: #0b0b11;
  --bg-panel: #141421;
  --border-soft: #26263a;

  --text-primary: #f2f2f7;
  --text-muted: #9a9ab0;

  --accent-warm: #a37bff;
  --accent-soft: #f2c14f;
  --accent-calm: #3bd1a2;

  --danger: #ff6b81;
}
box-shadow: 0 0 24px rgba(163, 123, 255, 0.25);

---

# 3️⃣ `.github/PULL_REQUEST_TEMPLATE.md`

Create folder: `.github/`

```md
## Summary
What does this change introduce or improve?

## Why
Why is this change needed?

## Area
- [ ] Research
- [ ] Tools
- [ ] Documentation
- [ ] Design / UX
- [ ] Safety / ethics

## Behaviour impact
Does this affect user experience, tone, or expectations?

## Checklist
- [ ] Small, inspectable change
- [ ] Docs updated if needed
- [ ] Safety considerations reviewed
