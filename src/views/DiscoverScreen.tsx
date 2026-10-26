import React, { useState } from 'react';
import { SAMPLE_TRACKS } from '../data/mockTracks';
import { Track } from '../types';
import { TrackRow } from '../components/TrackRow';
import { TrackCard } from '../components/TrackCard';
import { useAudio } from '../context/AudioContext';
import { 
  Compass, 
  Flame, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Play, 
  Activity, 
  Cpu, 
  Radio
} from 'lucide-react';

interface DiscoverScreenProps {
  onAddToPlaylist: (track: Track) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ onAddToPlaylist }) => {
  const { playTrack } = useAudio();
  const [activeFrequencyFilter, setActiveFrequencyFilter] = useState<'all' | 'high-bpm' | 'ambient' | 'synth'>('all');

  // Sorted by plays for top charts
  const topCharts = [...SAMPLE_TRACKS].sort((a, b) => b.plays - a.plays);

  // Filtered tracks based on matrix
  const matrixTracks = SAMPLE_TRACKS.filter(t => {
    if (activeFrequencyFilter === 'high-bpm') return t.bpm >= 130;
    if (activeFrequencyFilter === 'ambient') return t.genre === 'Ambient Synth' || t.genre === 'Lo-Fi Neon';
    if (activeFrequencyFilter === 'synth') return t.genre === 'Synthwave' || t.genre === 'Cyber Bass';
    return true;
  });

  return (
    <div className="space-y-10 pb-16 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-purple-950/60 via-vybe-card to-cyan-950/50 border border-purple-500/30 overflow-hidden shadow-neon-purple">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>THE QUANTUM FREQUENCY MATRIX</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-black text-white tracking-wide">
              Discover Holographic Sonics
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Explore sonic frequencies calibrated from synthwave retrospectives to high-velocity hyperdrive beats across the global neural grid.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => playTrack(topCharts[0], topCharts)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-semibold text-sm shadow-neon-cyan hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Stream Top Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* FREQUENCY MATRIX SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="font-display font-bold text-lg text-white">Neural Frequency Explorer</h2>
          </div>
          <span className="text-xs font-mono text-purple-400">
            {matrixTracks.length} streams calibrated
          </span>
        </div>

        {/* Matrix Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveFrequencyFilter('all')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeFrequencyFilter === 'all'
                ? 'bg-purple-600/30 border-cyan-400 text-cyan-300 shadow-neon-purple'
                : 'glass-card text-slate-300 hover:text-white'
            }`}
          >
            <Radio className="w-5 h-5 mb-2 text-cyan-400" />
            <p className="text-sm font-bold font-display">All Frequencies</p>
            <p className="text-[11px] font-mono text-slate-400">Unfiltered neural feed</p>
          </button>

          <button
            onClick={() => setActiveFrequencyFilter('high-bpm')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeFrequencyFilter === 'high-bpm'
                ? 'bg-purple-600/30 border-cyan-400 text-cyan-300 shadow-neon-purple'
                : 'glass-card text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-5 h-5 mb-2 text-yellow-400" />
            <p className="text-sm font-bold font-display">Hyperdrive (130+ BPM)</p>
            <p className="text-[11px] font-mono text-slate-400">High velocity adrenaline</p>
          </button>

          <button
            onClick={() => setActiveFrequencyFilter('synth')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeFrequencyFilter === 'synth'
                ? 'bg-purple-600/30 border-cyan-400 text-cyan-300 shadow-neon-purple'
                : 'glass-card text-slate-300 hover:text-white'
            }`}
          >
            <Cpu className="w-5 h-5 mb-2 text-purple-400" />
            <p className="text-sm font-bold font-display">Cyber Synthwave</p>
            <p className="text-[11px] font-mono text-slate-400">Subterranean retro futurism</p>
          </button>

          <button
            onClick={() => setActiveFrequencyFilter('ambient')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeFrequencyFilter === 'ambient'
                ? 'bg-purple-600/30 border-cyan-400 text-cyan-300 shadow-neon-purple'
                : 'glass-card text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-2 text-emerald-400" />
            <p className="text-sm font-bold font-display">Deep Space Ambient</p>
            <p className="text-[11px] font-mono text-slate-400">Zero-gravity meditation</p>
          </button>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pt-2">
          {matrixTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onAddToPlaylist={onAddToPlaylist}
              playlistContext={matrixTracks}
            />
          ))}
        </div>
      </div>

      {/* TOP 10 GLOBAL GRID CHARTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h2 className="font-display font-bold text-lg text-white">Global Neural Charts Top 10</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Updated every orbital cycle</span>
        </div>

        <div className="glass-panel rounded-2xl p-3 border border-purple-500/20 divide-y divide-white/5">
          {topCharts.slice(0, 10).map((track, idx) => (
            <div key={track.id} className="py-1">
              <TrackRow
                track={track}
                index={idx}
                onAddToPlaylist={onAddToPlaylist}
                playlistContext={topCharts}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ARTIST OF THE CYCLE SPOTLIGHT */}
      <div className="p-6 rounded-3xl glass-card border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-black/80 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-cyan-400 shadow-neon-cyan">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80"
            alt="Artist of the Cycle"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono uppercase mb-2">
            <Flame className="w-3 h-3 text-pink-400" />
            Featured Creator
          </div>
          <h3 className="text-xl md:text-2xl font-display font-extrabold text-white">
            Aethelgard 2099
          </h3>
          <p className="text-xs text-cyan-300 font-mono mt-0.5">
            1.4M Neural Listeners &bull; Neo-Tokyo / Sector 4
          </p>
          <p className="text-xs text-slate-300 mt-2 max-w-lg leading-relaxed">
            Pioneering cinematic darkwave synthesizers with live modular hardware and algorithmic sub-bass pulses.
          </p>
        </div>

        <button
          onClick={() => playTrack(SAMPLE_TRACKS[0], SAMPLE_TRACKS)}
          className="px-5 py-2.5 rounded-xl bg-purple-600/30 text-cyan-300 border border-purple-500/40 hover:bg-purple-600/50 text-xs font-mono uppercase font-bold transition-all"
        >
          Stream Creator Mix
        </button>
      </div>
    </div>
  );
};
