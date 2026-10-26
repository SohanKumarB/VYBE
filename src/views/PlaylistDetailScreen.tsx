import React from 'react';
import { Track } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import { TrackRow } from '../components/TrackRow';
import { formatDuration } from '../utils/audioSynth';
import { 
  Play, 
  Shuffle, 
  Trash2, 
  ArrowLeft, 
  Sparkles, 
  Layers 
} from 'lucide-react';

interface PlaylistDetailScreenProps {
  playlistId: string;
  onBack: () => void;
  onAddToPlaylist: (track: Track) => void;
  onExploreMore: () => void;
}

export const PlaylistDetailScreen: React.FC<PlaylistDetailScreenProps> = ({
  playlistId,
  onBack,
  onAddToPlaylist,
  onExploreMore,
}) => {
  const { playlists, getTrackById, removeTrackFromPlaylist, deletePlaylist } = useLibrary();
  const { playTrack, toggleShuffle } = useAudio();

  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="p-12 text-center select-none">
        <p className="text-slate-400 font-mono text-sm mb-4">Neural playlist not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-purple-600/30 text-cyan-300 border border-purple-500/40 text-xs font-mono"
        >
          &larr; Return to Library
        </button>
      </div>
    );
  }

  // Gather tracks in playlist
  const tracks = playlist.trackIds
    .map(id => getTrackById(id))
    .filter((t): t is Track => t !== undefined);

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handleShuffleAll = () => {
    if (tracks.length > 0) {
      toggleShuffle();
      const randIdx = Math.floor(Math.random() * tracks.length);
      playTrack(tracks[randIdx], tracks);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      onBack();
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in select-none">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>
      </div>

      {/* Playlist Hero Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-purple-950/50 via-vybe-card to-cyan-950/30 border border-purple-500/30 overflow-hidden shadow-neon-combo">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Cover gradient icon */}
          <div className={`w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-tr ${playlist.coverGradient} p-1 shadow-2xl flex items-center justify-center shrink-0`}>
            <div className="w-full h-full bg-vybe-void/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-16 h-16 text-cyan-300 animate-pulse" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              {playlist.isCustom ? 'CUSTOM NEURAL COMPILATION' : 'CURATED MATRIX MIX'}
            </span>
            <h1 className="text-2xl md:text-4xl font-display font-black text-white mt-1">
              {playlist.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              {playlist.description}
            </p>

            <div className="mt-3 flex items-center justify-center md:justify-start gap-3 text-xs font-mono text-slate-400">
              <span>{tracks.length} {tracks.length === 1 ? 'stream' : 'streams'}</span>
              <span>&bull;</span>
              <span>{formatDuration(totalDuration)} total</span>
              <span>&bull;</span>
              <span>Created {playlist.createdAt}</span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {tracks.length > 0 && (
                <>
                  <button
                    onClick={handlePlayAll}
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold text-xs font-mono shadow-neon-cyan hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Play Transmission</span>
                  </button>

                  <button
                    onClick={handleShuffleAll}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono transition-all"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Shuffle</span>
                  </button>
                </>
              )}

              {playlist.isCustom && (
                <button
                  onClick={handleDelete}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-colors"
                  title="Delete playlist"
                  aria-label="Delete playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">
            Track Sequences
          </span>
        </div>

        {tracks.length > 0 ? (
          <div className="glass-panel rounded-2xl p-2 border border-purple-500/20 divide-y divide-white/5">
            {tracks.map((track, idx) => (
              <div key={track.id} className="py-1">
                <TrackRow
                  track={track}
                  index={idx}
                  onAddToPlaylist={onAddToPlaylist}
                  onRemoveFromPlaylist={(t) => removeTrackFromPlaylist(playlist.id, t.id)}
                  playlistContext={tracks}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl glass-card border border-white/5">
            <Layers className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-white">Empty Playlist</h3>
            <p className="text-xs text-slate-400 font-mono mt-1 mb-4">
              This neural sequence has no tracks yet. Add tracks by clicking '+' anywhere in VYBE.
            </p>
            <button
              onClick={onExploreMore}
              className="px-4 py-2 rounded-xl bg-purple-600/30 text-cyan-300 border border-purple-500/40 text-xs font-mono hover:bg-purple-600/50 transition-colors"
            >
              Explore Tracks &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
