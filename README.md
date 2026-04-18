# Telepromptr

A tiny macOS teleprompter that **stays invisible on screen share**. Built for recording Loom / QuickTime / OBS videos where you need a script visible to you but not to your viewers.

![platform](https://img.shields.io/badge/platform-macOS-black) ![electron](https://img.shields.io/badge/electron-33-47848F)

## Why

Most teleprompter apps show up in your recording because they're normal windows. This one uses macOS's `NSWindowSharingNone` flag (via Electron's `setContentProtection`) so the window is excluded from every screen-capture API on the system. You see it. Your recording doesn't.

## Features

- **Invisible to screen recorders** — Loom, QuickTime, OBS, Zoom share, screenshots all skip it.
- **Always on top** — floats above fullscreen apps too.
- **Translucent + resizable** — drag to size, slider for opacity.
- **Auto-scroll** — adjustable speed (10–300 px/s), play/pause with Space.
- **Font size control** — 16–96 px.
- **Global minimize** — `⌘⇧T` to hide/show from anywhere.
- **Persistent** — your script and settings stay across launches.
- **No tracking, no network calls, no accounts.**

## Install

1. Download the latest `.dmg` from [Releases](https://github.com/gauravmasand/Teleprompter-Mac/releases).
2. Open the DMG, drag **Telepromptr** to Applications.
3. First launch: **right-click → Open** (the app is unsigned, so Gatekeeper will warn you).
   - Or, if blocked: `xattr -cr /Applications/Telepromptr.app` then launch.

Apple Silicon build. Works on macOS 10.12+.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Play / pause scroll |
| `↑` / `↓` | Nudge scroll |
| `Home` | Jump to top |
| `E` | Enter edit mode |
| `+` / `−` | Font size |
| `⌘⇧T` | Toggle window (global) |

## Controls

- **Drag the top bar** to move the window.
- **Drag the edges** to resize.
- **Edit** button → type or paste your script → **Done** to lock it.
- **Opacity** slider controls background transparency.

## Build from source

```bash
git clone https://github.com/gauravmasand/Teleprompter-Mac.git
cd Teleprompter-Mac
npm install
npm start          # run in dev
npm run dist       # build a DMG to ./dist
```

## Tech

Electron + vanilla HTML/CSS/JS. That's it. ~200 lines of app code.

The one thing that makes it work:
```js
win.setContentProtection(true); // NSWindowSharingNone on macOS
```
