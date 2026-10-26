import React from 'react';
import { Track } from '../types';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { formatDuration } from '../utils/audioSynth';
import { Play, Pause, Heart, Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface TrackRowProps {
  track: Track;
  index: number;
  onAddToPlaylist?: (track: Track) => void;
  onRemoveFromPlaylist?: (track: Track) => void;
  playlistContext?: Track[];
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  playlistContext,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, analyserNode, playNextInQueue } = useAudio();
  const { isFavorite, toggleFavorite } = useLibrary();
  const [showMenu, setShowMenu] = React.useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = isFavorite(track.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, playlistContext);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group relative flex items-center justify-between px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none ${
        isCurrent
          ? 'bg-purple-900/30 border border-purple-500/30 text-cyan-300 shadow-sm'
          : 'hover:bg-white/[0.04] text-slate-300 hover:text-white border border-transparent'
      }`}
    >
      {/* LEFT: Index / Play Icon & Track Details */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        {/* Index or Live Play Button */}
        <div className="w-7 text-center shrink-0 flex items-center justify-center">
          {isThisPlaying ? (
            <div className="flex items-center justify-center">
              <AudioVisualizer
                analyserNode={analyserNode}
                isPlaying={true}
                accentColor={track.accentColor || '#00f5ff'}
                style="neon-bars"
                width={20}
                height={16}
              />
            </div>
          ) : (
            <>
              <span className="group-hover:hidden text-xs font-mono text-slate-400">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick();
                }}
                className="hidden group-hover:flex items-center justify-center text-cyan-400 hover:scale-110 transition-transform"
                aria-label="Play track"
              >
                {isCurrent && isPlaying ? (
                  <Pause className="w-4 h-4 fill-cyan-400" />
                ) : (
                  <Play className="w-4 h-4 fill-cyan-400" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Artwork Thumbnail */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-white/10">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Title and Artist */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold truncate ${
              isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-100 group-hover:text-white'
            }`}>
              {track.title}
            </p>
            <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono uppercase bg-purple-500/10 text-purple-300 rounded border border-purple-500/20">
              {track.genre}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {track.artist}
          </p>
        </div>
      </div>

      {/* CENTER: Album & BPM (Desktop) */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400 px-4 w-1/3 truncate">
        <span className="truncate flex-1">{track.album}</span>
        <span className="text-purple-400/80 shrink-0">{track.bpm} BPM</span>
      </div>

      {/* RIGHT: Actions & Duration */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(track.id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            isLiked 
              ? 'text-pink-400 hover:text-pink-300' 
              : 'text-slate-400 hover:text-white group-hover:opacity-100 opacity-60'
          }`}
          title={isLiked ? 'Unlike' : 'Like'}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-400' : ''}`} />
        </button>

        {/* Duration */}
        <span className="text-xs font-mono text-slate-400 w-10 text-right">
          {formatDuration(track.duration)}
        </span>

        {/* More Actions Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(prev => !prev);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="More Options"
            aria-label="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 w-44 rounded-xl bg-vybe-card border border-purple-500/30 shadow-neon-purple backdrop-blur-xl z-50 py-1.5 text-xs text-slate-200"
            >
              {onAddToPlaylist && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onAddToPlaylist(track);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-purple-600/20 hover:text-cyan-300 text-left transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Add to Playlist</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowMenu(false);
                  playNextInQueue(track);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-purple-600/20 hover:text-cyan-300 text-left transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Play Next in Queue</span>
              </button>

              {onRemoveFromPlaylist && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onRemoveFromPlaylist(track);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-500/20 text-red-300 text-left transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Remove from Playlist</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
