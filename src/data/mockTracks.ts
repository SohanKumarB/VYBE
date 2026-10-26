import { Track, Playlist } from '../types';

export const SAMPLE_TRACKS: Track[] = [
  {
    id: 'trk-1',
    title: 'Cybernetic Pulse',
    artist: 'Aethelgard 2099',
    album: 'Neon Horizon',
    duration: 372,
    coverUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Synthwave',
    mood: 'Cyberpunk',
    bpm: 128,
    featured: true,
    trending: true,
    plays: 1420500,
    releaseYear: 2026,
    accentColor: '#a855f7',
    lyrics: [
      '[00:15] Synthetic rain falls across the glass tower',
      '[00:28] Shadows flicker in the neon shower',
      '[00:42] Cybernetic pulse racing through the spine',
      '[00:55] Human heart beating on borrowed time',
      '[01:10] Connecting to the neural stream...',
      '[01:25] We are more than the machines we dream'
    ]
  },
  {
    id: 'trk-2',
    title: 'Quantum Drift',
    artist: 'Hyperion Flux',
    album: 'Singularity Drift',
    duration: 423,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Cyber Bass',
    mood: 'Hyperdrive',
    bpm: 140,
    featured: true,
    trending: true,
    plays: 980200,
    releaseYear: 2026,
    accentColor: '#00f5ff',
    lyrics: [
      '[00:20] Engaging warp sub-routines',
      '[00:35] Crossing through the event horizon',
      '[00:50] No gravity, no friction, pure velocity',
      '[01:08] The quantum field expands in all dimensions'
    ]
  },
  {
    id: 'trk-3',
    title: 'Chrono Mirage',
    artist: 'Luminary Protocol',
    album: 'Digital Eden',
    duration: 345,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Chillwave',
    mood: 'Midnight Chill',
    bpm: 105,
    trending: true,
    plays: 765400,
    releaseYear: 2025,
    accentColor: '#ec4899',
    lyrics: [
      '[00:12] Soft static on the violet horizon',
      '[00:30] Memories suspended in glowing chrome',
      '[00:48] Breathe the dusk, let tomorrow dissolve',
      '[01:05] Wandering the endless holographic glow'
    ]
  },
  {
    id: 'trk-4',
    title: 'Neon Solitude',
    artist: 'Vesper & Nyx',
    album: 'Sub-Level 7',
    duration: 310,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Darkwave',
    mood: 'Cyberpunk',
    bpm: 118,
    plays: 540300,
    releaseYear: 2025,
    accentColor: '#8b5cf6'
  },
  {
    id: 'trk-5',
    title: 'Subatomic Echo',
    artist: 'Kavinsky Core',
    album: 'Particle Dreams',
    duration: 388,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Future Synth',
    mood: 'Deep Focus',
    bpm: 122,
    trending: true,
    plays: 1120000,
    releaseYear: 2026,
    accentColor: '#22d3ee'
  },
  {
    id: 'trk-6',
    title: 'Orbital Velocity',
    artist: 'Cosmic Array',
    album: 'Gravity Assist',
    duration: 410,
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    genre: 'D&B',
    mood: 'Hyperdrive',
    bpm: 174,
    plays: 890100,
    releaseYear: 2026,
    accentColor: '#3b82f6'
  },
  {
    id: 'trk-7',
    title: 'Zero Gravity Euphoria',
    artist: 'Aura Polaris',
    album: 'Celeste IV',
    duration: 360,
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Ambient Synth',
    mood: 'Stargaze',
    bpm: 96,
    plays: 672000,
    releaseYear: 2025,
    accentColor: '#10b981'
  },
  {
    id: 'trk-8',
    title: 'Hologram Heartbeat',
    artist: 'Binary Sunset',
    album: 'Silicon Soul',
    duration: 334,
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    genre: 'Synthwave',
    mood: 'Midnight Chill',
    bpm: 110,
    plays: 430900,
    releaseYear: 2026,
    accentColor: '#ec4899'
  },
  {
    id: 'trk-9',
    title: 'Ghost in the Machine',
    artist: 'Vector 99',
    album: 'Glitch Protocol',
    duration: 295,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Cyber Bass',
    mood: 'Cyberpunk',
    bpm: 135,
    plays: 389400,
    releaseYear: 2025,
    accentColor: '#f43f5e'
  },
  {
    id: 'trk-10',
    title: 'Infinite Horizon',
    artist: 'Solaris Bloom',
    album: 'Supernova',
    duration: 450,
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Ambient Synth',
    mood: 'Stargaze',
    bpm: 100,
    plays: 512300,
    releaseYear: 2025,
    accentColor: '#a855f7'
  },
  {
    id: 'trk-11',
    title: 'Neural Overdrive',
    artist: 'Hexacode',
    album: 'Overclocked',
    duration: 315,
    coverUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'D&B',
    mood: 'Hyperdrive',
    bpm: 168,
    plays: 820400,
    releaseYear: 2026,
    accentColor: '#00f5ff'
  },
  {
    id: 'trk-12',
    title: 'Memory Leak in Paradise',
    artist: 'Echo Void',
    album: 'Vapor Matrix',
    duration: 320,
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Lo-Fi Neon',
    mood: 'Deep Focus',
    bpm: 88,
    plays: 645100,
    releaseYear: 2026,
    accentColor: '#8b5cf6'
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-cyberpunk',
    name: 'Neo-Tokyo 2099',
    description: 'High-octane electro, gritty industrial beats, and midnight rain vibes.',
    coverGradient: 'from-violet-600 via-fuchsia-600 to-cyan-400',
    coverIcon: 'Zap',
    trackIds: ['trk-1', 'trk-4', 'trk-9', 'trk-2'],
    createdAt: '2026-01-15'
  },
  {
    id: 'pl-chill',
    name: 'Midnight Neon Lounge',
    description: 'Slow-tempo dreamy synthwave for stargazing and late night drives.',
    coverGradient: 'from-cyan-500 via-purple-600 to-pink-500',
    coverIcon: 'Moon',
    trackIds: ['trk-3', 'trk-8', 'trk-12', 'trk-7'],
    createdAt: '2026-02-10'
  },
  {
    id: 'pl-hyperdrive',
    name: 'Hyperdrive Acceleration',
    description: 'BPM 140+ adrenaline fuel for gaming, overclocking, and fast-paced tasks.',
    coverGradient: 'from-cyan-400 via-blue-600 to-indigo-700',
    coverIcon: 'Flame',
    trackIds: ['trk-2', 'trk-6', 'trk-11'],
    createdAt: '2026-03-01'
  },
  {
    id: 'pl-focus',
    name: 'Neural Synchrony // Deep Focus',
    description: 'Procedural algorithmic ambient flows tuned for maximum focus and flow-state.',
    coverGradient: 'from-emerald-500 via-teal-600 to-purple-800',
    coverIcon: 'Cpu',
    trackIds: ['trk-5', 'trk-12', 'trk-7', 'trk-10'],
    createdAt: '2026-03-20'
  }
];

export const GENRE_LIST = [
  'All',
  'Synthwave',
  'Cyber Bass',
  'Chillwave',
  'Darkwave',
  'Future Synth',
  'Ambient Synth',
  'Lo-Fi Neon',
  'D&B'
] as const;

export const MOOD_LIST = [
  'All',
  'Cyberpunk',
  'Synthwave',
  'Midnight Chill',
  'Hyperdrive',
  'Deep Focus',
  'Stargaze'
] as const;
