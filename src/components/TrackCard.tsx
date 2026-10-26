import React from 'react';
import { Track } from '../types';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { Play, Pause, Heart, Plus, Sparkles } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface TrackCardProps {
  track: Track;
  onAddToPlaylist?: (track: Track) => void;
  playlistContext?: Track[];
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onAddToPlaylist,
  playlistContext,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, analyserNode } = useAudio();
  const { isFavorite, toggleFavorite } = useLibrary();

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = isFavorite(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, playlistContext);
    }
  };

  return (
    <div
      onClick={handlePlayClick}
      className={`group relative p-3.5 rounded-2xl glass-card glass-card-interactive cursor-pointer flex flex-col transition-all duration-300 ${
        isCurrent
          ? 'border-cyan-400/50 shadow-neon-cyan/40 bg-purple-900/20'
          : 'hover:border-purple-500/40'
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3.5 bg-slate-900">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Dark Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Live wave visualizer overlay when currently playing */}
        {isThisPlaying && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center p-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <AudioVisualizer
              analyserNode={analyserNode}
              isPlaying={true}
              accentColor={track.accentColor || '#00f5ff'}
              style="neon-bars"
              width={100}
              height={18}
            />
          </div>
        )}

        {/* Floating Play Button */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-400 to-purple-600 p-[2px] shadow-neon-combo transition-all duration-300 ${
            isCurrent
              ? 'opacity-100 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          aria-label={isThisPlaying ? 'Pause track' : 'Play track'}
        >
          <div className="w-full h-full bg-vybe-void rounded-full flex items-center justify-center">
            {isThisPlaying ? (
              <Pause className="w-4 h-4 text-cyan-300 fill-cyan-300" />
            ) : (
              <Play className="w-4 h-4 text-cyan-300 fill-cyan-300 translate-x-0.5" />
            )}
          </div>
        </button>

        {/* Top Badges (Genre / Mood) */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded-md bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
            {track.genre}
          </span>
        </div>

        {track.featured && (
          <div className="absolute top-2 right-2">
            <span className="p-1 rounded-md bg-purple-500/80 backdrop-blur-md text-white flex items-center shadow-neon-purple">
              <Sparkles className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>

      {/* Track Meta Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className={`text-sm font-semibold truncate transition-colors ${
            isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-100 group-hover:text-white'
          }`}>
            {track.title}
          </h4>
          <p className="text-xs text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
            {track.artist}
          </p>
        </div>

        {/* Bottom Card Actions */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
          <span className="text-[10px] font-mono text-slate-400">
            {track.bpm} BPM
          </span>

          <div className="flex items-center gap-1">
            {onAddToPlaylist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToPlaylist(track);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                title="Add to Playlist"
                aria-label="Add to Playlist"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(track.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isLiked ? 'text-pink-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
