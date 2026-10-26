import React from 'react';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { formatDuration } from '../utils/audioSynth';
import { AudioVisualizer } from './AudioVisualizer';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Heart, 
  ListMusic, 
  Maximize2,
  Gauge,
  Sparkles
} from 'lucide-react';

interface BottomPlayerProps {
  onToggleQueue: () => void;
  onOpenVisualizer: () => void;
  onOpenTrackDetails?: () => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  onToggleQueue,
  onOpenVisualizer,
  onOpenTrackDetails,
}) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffle,
    queue,
    playbackRate,
    analyserNode,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    setPlaybackRate
  } = useAudio();

  const { isFavorite, toggleFavorite } = useLibrary();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = isFavorite(currentTrack.id);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5 text-slate-400" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5 text-slate-300" />;
    return <Volume2 className="w-5 h-5 text-cyan-400" />;
  };

  const cycleSpeed = () => {
    if (playbackRate === 1) setPlaybackRate(1.25);
    else if (playbackRate === 1.25) setPlaybackRate(1.5);
    else if (playbackRate === 1.5) setPlaybackRate(0.8);
    else setPlaybackRate(1);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 md:h-24 bg-vybe-dark/95 border-t border-purple-500/20 backdrop-blur-2xl z-40 px-3 md:px-6 flex items-center justify-between select-none shadow-[0_-10px_35px_rgba(0,0,0,0.6)]">
      {/* Top micro progress line for mobile */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] bg-slate-800 md:hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          seek(clickPos * duration);
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* LEFT: Current Track Info & Mini Waveform */}
      <div className="flex items-center gap-3 md:gap-4 w-1/3 min-w-0">
        <div 
          onClick={onOpenTrackDetails}
          className="relative group shrink-0 cursor-pointer"
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover border border-purple-500/30 shadow-md transition-all duration-300 group-hover:scale-105 ${
              isPlaying ? 'ring-2 ring-cyan-400/40' : ''
            }`}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 
              onClick={onOpenTrackDetails}
              className="text-sm font-semibold text-white truncate cursor-pointer hover:text-cyan-300 transition-colors"
            >
              {currentTrack.title}
            </h4>
            <span className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20">
              {currentTrack.genre}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate hover:text-slate-300 transition-colors">
            {currentTrack.artist}
          </p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className={`p-2 rounded-xl transition-all duration-200 shrink-0 ${
            isLiked 
              ? 'text-pink-400 hover:text-pink-300 bg-pink-500/10' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title={isLiked ? 'Remove from Liked' : 'Save to Liked'}
          aria-label={isLiked ? 'Remove from Liked' : 'Save to Liked'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-400' : ''}`} />
        </button>

        {/* Mini waveform (desktop only) */}
        <div className="hidden 2xl:block shrink-0 pl-2">
          <AudioVisualizer
            analyserNode={analyserNode}
            isPlaying={isPlaying}
            accentColor={currentTrack.accentColor || '#00f5ff'}
            style="neon-bars"
            width={70}
            height={26}
          />
        </div>
      </div>

      {/* CENTER: Player Transport Controls & Seek Bar */}
      <div className="flex flex-col items-center justify-center w-full max-w-xl px-2 md:px-4">
        {/* Buttons Row */}
        <div className="flex items-center gap-3 md:gap-6 mb-1 md:mb-1.5">
          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            className={`hidden sm:flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${
              isShuffle 
                ? 'text-cyan-300 bg-cyan-500/20 shadow-neon-cyan border border-cyan-400/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={`Shuffle: ${isShuffle ? 'On' : 'Off'}`}
            aria-label="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous Track */}
          <button
            onClick={prevTrack}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            title="Previous track"
            aria-label="Previous track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-fuchsia-500 p-[2px] shadow-neon-combo transition-all duration-200 hover:scale-105 active:scale-95 group"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className="w-full h-full bg-vybe-void rounded-full flex items-center justify-center group-hover:bg-opacity-80 transition-colors">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
              )}
            </div>
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            title="Next track"
            aria-label="Next track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat Cycle */}
          <button
            onClick={cycleRepeatMode}
            className={`hidden sm:flex items-center justify-center p-2 rounded-xl transition-all duration-200 relative ${
              repeatMode !== 'off' 
                ? 'text-purple-300 bg-purple-500/20 shadow-neon-purple border border-purple-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={`Repeat mode: ${repeatMode}`}
            aria-label="Cycle Repeat Mode"
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4 text-purple-300" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode === 'all' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400" />
            )}
          </button>
        </div>

        {/* Progress & Live Seek Bar (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-3 w-full">
          <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
            {formatDuration(currentTime)}
          </span>

          <div className="relative flex-1 flex items-center group py-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none transition-all duration-150"
              style={{
                background: `linear-gradient(to right, #00f5ff 0%, #a855f7 ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%, rgba(255,255,255,0.1) 100%)`
              }}
              aria-label="Seek track position"
            />
          </div>

          <span className="text-[11px] font-mono text-slate-400 w-10 text-left">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume, Visualizer HUD, Speed & Queue */}
      <div className="flex items-center justify-end gap-2 md:gap-3 w-1/3">
        {/* Playback Speed selector */}
        <div className="relative">
          <button
            onClick={cycleSpeed}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all"
            title="Playback Speed"
            aria-label="Change playback speed"
          >
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
            <span>{playbackRate}x</span>
          </button>
        </div>

        {/* Queue Toggle Button */}
        <button
          onClick={onToggleQueue}
          className="relative p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-purple-500/15 transition-all"
          title="Play Queue"
          aria-label="Toggle Play Queue"
        >
          <ListMusic className="w-5 h-5" />
          {queue.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
          )}
        </button>

        {/* Fullscreen Cyber Visualizer HUD */}
        <button
          onClick={onOpenVisualizer}
          className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-purple-500/15 transition-all group"
          title="Open Holographic Visualizer HUD"
          aria-label="Open Visualizer Modal"
        >
          <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Volume Controls (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 pl-2">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {getVolumeIcon()}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 xl:w-24 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, #00f5ff 0%, #a855f7 ${
                (isMuted ? 0 : volume) * 100
              }%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
            aria-label="Volume slider"
          />
        </div>
      </div>
    </footer>
  );
};
