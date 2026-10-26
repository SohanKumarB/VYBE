import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { formatDuration } from '../utils/audioSynth';
import { AudioVisualizer } from './AudioVisualizer';
import { 
  Minimize2, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  Activity, 
  Disc, 
  Radio
} from 'lucide-react';

interface FullscreenVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VisualizerStyle = 'neon-bars' | 'wave-oscilloscope' | 'circular-reactor';

export const FullscreenVisualizerModal: React.FC<FullscreenVisualizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    repeatMode,
    isShuffle,
    analyserNode,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleShuffle,
    cycleRepeatMode,
  } = useAudio();

  const { isFavorite, toggleFavorite } = useLibrary();
  const [visualizerStyle, setVisualizerStyle] = useState<VisualizerStyle>('neon-bars');
  const [activeTab, setActiveTab] = useState<'visualizer' | 'lyrics'>('visualizer');

  // Keyboard shortcut: Esc to close, Space to toggle
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, togglePlay]);

  if (!isOpen || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = isFavorite(currentTrack.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#06040c]/95 backdrop-blur-2xl text-slate-100 flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden animate-fade-in">
      {/* Background ambient lighting radiating from track accent color */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-25 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${currentTrack.accentColor || '#a855f7'} 0%, transparent 70%)`
        }}
      />

      {/* TOP HEADER: Branding, Style Switcher, Minimize */}
      <div className="relative z-10 flex items-center justify-between border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              VYBE // HOLOGRAPHIC HUD
            </h2>
            <p className="text-xs font-mono text-slate-400">
              {currentTrack.bpm} BPM &bull; {currentTrack.genre} &bull; FREQ 96kHz
            </p>
          </div>
        </div>

        {/* Tab switch: Visualizer vs Lyrics */}
        <div className="flex items-center gap-2 bg-vybe-surface/80 p-1 rounded-xl border border-purple-500/30">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'visualizer'
                ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/40 shadow-neon-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Spectrum HUD
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'lyrics'
                ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/40 shadow-neon-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Neural Lyrics
          </button>
        </div>

        {/* Minimize Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Minimize HUD"
          aria-label="Minimize HUD"
        >
          <Minimize2 className="w-6 h-6" />
        </button>
      </div>

      {/* CENTER: Main Visualizer Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 overflow-hidden">
        {activeTab === 'visualizer' ? (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Holographic Artwork Disc */}
            <div className="relative mb-6">
              <div 
                className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full p-2.5 bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 shadow-neon-combo ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              >
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full rounded-full object-cover shadow-2xl"
                />
                {/* Center spindle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-vybe-void border-2 border-cyan-400 shadow-neon-cyan flex items-center justify-center">
                  <Disc className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-5">
              <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-wide">
                {currentTrack.title}
              </h1>
              <p className="text-base text-cyan-300 mt-1 font-medium">
                {currentTrack.artist} &bull; <span className="text-slate-400">{currentTrack.album}</span>
              </p>
            </div>

            {/* Audio Waveform Canvas */}
            <div className="w-full flex justify-center py-2">
              <AudioVisualizer
                analyserNode={analyserNode}
                isPlaying={isPlaying}
                accentColor={currentTrack.accentColor || '#00f5ff'}
                style={visualizerStyle}
                width={visualizerStyle === 'circular-reactor' ? 320 : 640}
                height={visualizerStyle === 'circular-reactor' ? 240 : 110}
                className="max-w-full drop-shadow-[0_0_15px_rgba(0,245,255,0.4)]"
              />
            </div>

            {/* Visualizer Style Switcher */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setVisualizerStyle('neon-bars')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  visualizerStyle === 'neon-bars'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                Neon Bars
              </button>
              <button
                onClick={() => setVisualizerStyle('wave-oscilloscope')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  visualizerStyle === 'wave-oscilloscope'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                Oscilloscope
              </button>
              <button
                onClick={() => setVisualizerStyle('circular-reactor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  visualizerStyle === 'circular-reactor'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                Circular Reactor
              </button>
            </div>
          </div>
        ) : (
          /* Lyrics View */
          <div className="w-full max-w-2xl h-96 overflow-y-auto px-6 py-4 flex flex-col items-center justify-center text-center space-y-4">
            {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
              currentTrack.lyrics.map((line, idx) => (
                <p
                  key={idx}
                  className={`text-lg md:text-xl font-medium transition-all duration-300 ${
                    idx === 1
                      ? 'text-cyan-300 font-bold scale-105 neon-text-glow'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {line}
                </p>
              ))
            ) : (
              <div className="text-center text-slate-500 font-mono text-sm py-12">
                <Radio className="w-8 h-8 mx-auto mb-2 text-purple-400/50 animate-pulse" />
                <p>Instrumental Neural Transmission</p>
                <p className="text-xs text-slate-600 mt-1">No lyrical data encoded in this stream</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS: Scrub Bar and Transport Controls */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Seekbar */}
        <div className="flex items-center gap-3 w-full mb-4">
          <span className="text-xs font-mono text-slate-400 w-12 text-right">
            {formatDuration(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.5"
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, #00f5ff 0%, #a855f7 ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%, rgba(255,255,255,0.1) 100%)`
            }}
            aria-label="Seek time in track"
          />

          <span className="text-xs font-mono text-slate-400 w-12 text-left">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-6 md:gap-8">
          <button
            onClick={toggleShuffle}
            className={`p-2.5 rounded-xl transition-all ${
              isShuffle ? 'text-cyan-300 bg-cyan-500/20 shadow-neon-cyan' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
            aria-label="Toggle Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:scale-110 transition-all"
            title="Previous track"
            aria-label="Previous track"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-[3px] shadow-neon-combo hover:scale-105 active:scale-95 transition-all group"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className="w-full h-full bg-vybe-void rounded-full flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-7 h-7 text-cyan-300 fill-cyan-300" />
              ) : (
                <Play className="w-7 h-7 text-cyan-300 fill-cyan-300 translate-x-0.5" />
              )}
            </div>
          </button>

          <button
            onClick={nextTrack}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:scale-110 transition-all"
            title="Next track"
            aria-label="Next track"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={cycleRepeatMode}
            className={`p-2.5 rounded-xl transition-all ${
              repeatMode !== 'off' ? 'text-purple-300 bg-purple-500/20 shadow-neon-purple' : 'text-slate-400 hover:text-white'
            }`}
            title="Repeat mode"
            aria-label="Repeat mode"
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>

          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className={`p-2.5 rounded-xl transition-all ${
              isLiked ? 'text-pink-400 bg-pink-500/20' : 'text-slate-400 hover:text-white'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
