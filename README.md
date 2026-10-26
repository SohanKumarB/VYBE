# VYBE — Premium Futuristic Music Streaming Platform

VYBE is a next-generation music streaming web application built with a unique futuristic cyberpunk/synthwave aesthetic, glassmorphism, responsive UI, real Web Audio API frequency visualizers, and a modular architecture ready for Android deployment.

---

## Key Highlights & Design Identity
- **Visual Palette**: Obsidian void black (`#05030a`), deep violet surfaces (`#110b22`, `#170f30`), electric purple glow (`#a855f7`), and bright cyber cyan accents (`#00f5ff`).
- **Glassmorphism & Glow**: Multi-layered backdrop blurs, subtle cyber borders, and neon drop-shadows.
- **Real-Time Audio Visualizer**: Live HTML5 Audio API + Web Audio API `AnalyserNode` rendering real-time animated waveforms, neon spectrum bars, and circular frequency reactors. Includes a zero-latency procedural synth engine fallback for uninterrupted playback.
- **Original UX**: Futuristic mood matrices, dynamic cycle greetings ("Solar Peak", "Neon Dusk", "Void Hours"), cyberpunk playlist synthesizers, and synchronized matrix lyrics.
- **Full Responsiveness**: Adaptive layouts for desktop, tablet, and mobile, with a floating mobile navigation dock and compact player drawer.
- **Persistence**: Likes, custom playlists, recent playback history, volume, and shuffle states persist locally via `localStorage`.

---

## Project Structure
```text
vybe/
├── public/
│   ├── favicon.svg             # Neon SVG audio-waveform branding mark
│   └── manifest.json           # Web App Manifest for PWA and Android installability
├── src/
│   ├── components/
│   │   ├── AddToPlaylistModal.tsx    # Modal to add track to any playlist or create new
│   │   ├── AudioVisualizer.tsx       # Canvas audio waveform & frequency visualizer
│   │   ├── BottomPlayer.tsx          # Persistent bottom playback bar with live seek & volume
│   │   ├── CreatePlaylistModal.tsx   # Modal to create custom playlist with gradients & icons
│   │   ├── FullscreenVisualizerModal.tsx # Fullscreen HUD with animated spectrum & matrix lyrics
│   │   ├── MobileNav.tsx             # Floating responsive mobile dock
│   │   ├── QueueDrawer.tsx           # Up next queue manager
│   │   ├── Sidebar.tsx               # Desktop holographic navigation sidebar
│   │   ├── ToastContainer.tsx        # In-app notifications
│   │   ├── TrackCard.tsx             # Futuristic interactive card
│   │   └── TrackRow.tsx              # Detailed track sequence row with play visualizer
│   ├── context/
│   │   ├── AudioContext.tsx          # Real HTML5 Audio & Web Audio API state & controls
│   │   └── LibraryContext.tsx        # Favorites, Playlists, and History with persistence
│   ├── data/
│   │   └── mockTracks.ts             # 12 curated futuristic royalty-free tracks & playlists
│   ├── types/
│   │   └── index.ts                  # Strong TypeScript definitions
│   ├── utils/
│   │   ├── audioSynth.ts             # Web Audio procedural sound synthesizer & formatters
│   │   └── formatters.ts
│   ├── views/
│   │   ├── DiscoverScreen.tsx        # Quantum frequency matrix & global top 10 charts
│   │   ├── HomeScreen.tsx            # Dynamic cycle greeting, hero spotlight & mood selector
│   │   ├── LibraryScreen.tsx         # Playlists, Liked Songs vault & listening history
│   │   ├── PlaylistDetailScreen.tsx  # Full playlist details with play-all & track removal
│   │   └── SearchScreen.tsx          # Live search with debouncing & genre tags
│   ├── App.tsx                       # Master layout & view coordinator
│   ├── index.css                     # Cyber styles, neon glows, scrollbars & animations
│   └── main.tsx                      # Root React entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Path to Android (Native APK via Capacitor)

VYBE is architected to be wrapped cleanly into an Android application using Capacitor:

1. **Install Capacitor CLI and Android platform**:
   ```bash
   npm install @capacitor/core
   npm install -D @capacitor/cli @capacitor/android
   ```

2. **Initialize Capacitor**:
   ```bash
   npx cap init VYBE com.vybe.music --web-dir dist
   ```

3. **Build the production web assets**:
   ```bash
   npm run build
   ```

4. **Add Android platform**:
   ```bash
   npx cap add android
   ```

5. **Sync and open in Android Studio**:
   ```bash
   npx cap sync android
   npx cap open android
   ```

6. In Android Studio, build the Signed APK or AAB bundle for Google Play Store.

---

## Development

- Start Dev Server: `npm run dev` (Available on `http://localhost:5173`)
- Production Build: `npm run build`
- Preview Build: `npm run preview`
