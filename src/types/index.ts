export type Mood = 
  | 'Cyberpunk' 
  | 'Synthwave' 
  | 'Midnight Chill' 
  | 'Hyperdrive' 
  | 'Deep Focus' 
  | 'Stargaze';

export type Genre = 
  | 'Synthwave' 
  | 'Cyber Bass' 
  | 'Chillwave' 
  | 'Darkwave' 
  | 'Future Synth' 
  | 'Ambient Synth' 
  | 'Lo-Fi Neon' 
  | 'D&B'
  | 'Electronic';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  genre: Genre;
  mood: Mood;
  bpm: number;
  featured?: boolean;
  trending?: boolean;
  plays: number;
  releaseYear: number;
  accentColor: string; // for dynamic background glow e.g. '#a855f7' or '#00f5ff'
  lyrics?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverGradient: string;
  coverIcon: string;
  trackIds: string[];
  createdAt: string;
  isCustom?: boolean;
}

export type ViewMode = 'home' | 'discover' | 'search' | 'library' | 'favorites' | 'playlist-detail';

export type RepeatMode = 'off' | 'all' | 'one';

export interface AudioVisualizerStyle {
  id: 'neon-bars' | 'wave-oscilloscope' | 'circular-reactor' | 'matrix-spectrum';
  name: string;
}
