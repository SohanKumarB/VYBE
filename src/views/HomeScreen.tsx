import React, { useState } from 'react';
import { SAMPLE_TRACKS } from '../data/mockTracks';
import { Mood, Track } from '../types';
import { TrackCard } from '../components/TrackCard';
import { TrackRow } from '../components/TrackRow';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { 
  Play, 
  Sparkles, 
  Radio, 
  Flame, 
  Clock, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Volume2
} from 'lucide-react';

interface HomeScreenProps {
  onAddToPlaylist: (track: Track) => void;
  onSelectPlaylist: (playlistId: string) => void;
  onNavigate: (view: 'discover' | 'search' | 'library') => void;
}

const MOODS: Mood[] = [
  'Cyberpunk',
  'Synthwave',
  'Midnight Chill',
  'Hyperdrive',
  'Deep Focus',
  'Stargaze'
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onAddToPlaylist,
  onSelectPlaylist,
  onNavigate,
}) => {
  const { playTrack, currentTrack, isPlaying, analyserNode } = useAudio();
  const { recentlyPlayed, getTrackById, playlists } = useLibrary();
  const [selectedMood, setSelectedMood] = useState<Mood | 'All'>('All');

  // Hero Featured Track (trk-1 Cybernetic Pulse)
  const heroTrack = SAMPLE_TRACKS[0];

  // Filtered tracks by mood
  const filteredTracks = selectedMood === 'All' 
    ? SAMPLE_TRACKS 
    : SAMPLE_TRACKS.filter(t => t.mood === selectedMood);

  // Trending tracks
  const trendingTracks = SAMPLE_TRACKS.filter(t => t.trending);

  // Recently played tracks list
  const recentTracks = recentlyPlayed
    .map(id => getTrackById(id))
    .filter((t): t is Track => t !== undefined)
    .slice(0, 5);

  // Dynamic greeting by hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return { time: 'VOID HOURS', text: 'Midnight Frequency Transmissions' };
    if (hour < 12) return { time: 'CYBER DAWN', text: 'System Initialized. Synchronize Your Mind.' };
    if (hour < 18) return { time: 'SOLAR PEAK', text: 'High Velocity Quantum Streams Active' };
    return { time: 'NEON DUSK', text: 'Sub-Level Synthetics & Midnight Frequencies' };
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Top Cyber Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-vybe-card to-cyan-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
              {greeting.time} // ONLINE
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-wide">
            {greeting.text}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NEURAL MATRIX 2099</span>
          </div>
        </div>
      </div>

      {/* HERO SPOTLIGHT: Featured Cyber Album / Track */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-purple-500/30 p-6 md:p-8 bg-gradient-to-br from-purple-900/40 via-vybe-dark to-cyan-950/30 shadow-neon-combo group">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-8">
          {/* Album artwork */}
          <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 border-2 border-purple-500/40 group-hover:border-cyan-400 transition-colors duration-500">
            <img
              src={heroTrack.coverUrl}
              alt={heroTrack.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-400/40 uppercase">
              Spotlight
            </div>
          </div>

          {/* Details & Play CTA */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-mono text-purple-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>FEATURED RELEASE // ALBUM OF THE CYCLE</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-display font-black text-white tracking-wide">
              {heroTrack.title}
            </h2>
            <p className="text-base text-cyan-300 font-medium mt-1">
              {heroTrack.artist} &bull; <span className="text-slate-400">{heroTrack.album}</span>
            </p>

            <p className="text-sm text-slate-300 mt-3 max-w-xl line-clamp-2 leading-relaxed">
              Immerse yourself into subterranean synthwave basslines, crisp cyber-arpeggios, and atmospheric vocal projections designed for deep consciousness sync.
            </p>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => playTrack(heroTrack, SAMPLE_TRACKS)}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-semibold text-sm hover:opacity-95 shadow-neon-cyan hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 translate-x-0.5" />
                </div>
                <span>STREAM SPOTLIGHT</span>
              </button>

              <button
                onClick={() => onAddToPlaylist(heroTrack)}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-sm font-medium transition-all"
              >
                + Add to Playlist
              </button>

              {currentTrack?.id === heroTrack.id && isPlaying && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-cyan-400/30">
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <AudioVisualizer
                    analyserNode={analyserNode}
                    isPlaying={true}
                    accentColor="#00f5ff"
                    style="neon-bars"
                    width={60}
                    height={20}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOOD FILTERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white">Sonic Mood Selector</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredTracks.length} {filteredTracks.length === 1 ? 'track' : 'tracks'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedMood('All')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              selectedMood === 'All'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold shadow-neon-cyan'
                : 'bg-vybe-surface/80 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
            }`}
          >
            All Moods
          </button>

          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
                selectedMood === mood
                  ? 'bg-purple-600 text-white font-bold border border-cyan-400/50 shadow-neon-purple'
                  : 'bg-vybe-surface/80 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Tracks Grid under selected mood */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredTracks.slice(0, 6).map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onAddToPlaylist={onAddToPlaylist}
              playlistContext={filteredTracks}
            />
          ))}
        </div>
      </div>

      {/* TRENDING NOW & RECENTLY PLAYED (Split Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Tracks (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="font-display font-bold text-lg text-white">Trending on The Grid</h3>
            </div>
            <button
              onClick={() => onNavigate('discover')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              <span>Explore Charts</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-1 rounded-2xl glass-panel p-2 border border-purple-500/20">
            {trendingTracks.slice(0, 5).map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                onAddToPlaylist={onAddToPlaylist}
                playlistContext={trendingTracks}
              />
            ))}
          </div>
        </div>

        {/* Recently Played / User History (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-lg text-white">Recent Echoes</h3>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-mono text-purple-400 hover:text-purple-300"
            >
              History
            </button>
          </div>

          <div className="rounded-2xl glass-panel p-3 border border-purple-500/20 space-y-2">
            {recentTracks.length > 0 ? (
              recentTracks.map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-300">
                      {track.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {track.artist}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    #{idx + 1}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-slate-500 py-6 text-center">
                Play a track to record your frequency history
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CURATED NEURAL PLAYLISTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-pink-400" />
            <h3 className="font-display font-bold text-lg text-white">Curated Neural Mixes</h3>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
          >
            <span>All Playlists</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.slice(0, 4).map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl.id)}
              className="group relative p-5 rounded-2xl glass-card border border-purple-500/20 cursor-pointer overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:scale-[1.02]"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${pl.coverGradient} p-[2px] shadow-neon-combo mb-4`}>
                <div className="w-full h-full bg-vybe-void rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                </div>
              </div>

              <h4 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                {pl.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {pl.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs font-mono text-purple-400/80">
                <span>{pl.trackIds.length} tracks</span>
                <span className="group-hover:translate-x-1 transition-transform text-cyan-400">
                  Play Mix &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
