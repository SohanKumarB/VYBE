import React, { useState } from 'react';
import { Track } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import { TrackRow } from '../components/TrackRow';
import { formatDuration } from '../utils/audioSynth';
import { 
  Heart, 
  Layers, 
  Plus, 
  Play, 
  Clock, 
  Sparkles, 
  Trash2, 
  Shuffle 
} from 'lucide-react';

interface LibraryScreenProps {
  initialTab?: 'playlists' | 'favorites' | 'history';
  onOpenCreatePlaylist: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  onAddToPlaylist: (track: Track) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  initialTab = 'playlists',
  onOpenCreatePlaylist,
  onSelectPlaylist,
  onAddToPlaylist,
}) => {
  const { playlists, favorites, recentlyPlayed, getTrackById, deletePlaylist } = useLibrary();
  const { playTrack, toggleShuffle } = useAudio();
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites' | 'history'>(initialTab);

  // Liked tracks objects
  const likedTracks = favorites
    .map(id => getTrackById(id))
    .filter((t): t is Track => t !== undefined);

  // Total duration of liked songs
  const totalLikedDuration = likedTracks.reduce((acc, t) => acc + t.duration, 0);

  // Recent tracks objects
  const recentTracks = recentlyPlayed
    .map(id => getTrackById(id))
    .filter((t): t is Track => t !== undefined);

  // Play entire list of liked songs
  const handlePlayLikedAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  const handleShuffleLikedAll = () => {
    if (likedTracks.length > 0) {
      toggleShuffle();
      const randomIndex = Math.floor(Math.random() * likedTracks.length);
      playTrack(likedTracks[randomIndex], likedTracks);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in select-none">
      {/* Library Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-wide">
            Neural Audio Library
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Synchronized collections, liked transmissions & listening history
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vybe-surface/90 border border-purple-500/30">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'playlists'
                ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/40 shadow-neon-purple font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Playlists ({playlists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'favorites'
                ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-neon-purple font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Liked ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'history'
                ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/40 shadow-neon-purple font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PLAYLISTS */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">
              Active Playlists ({playlists.length})
            </span>

            <button
              onClick={onOpenCreatePlaylist}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-black text-xs font-bold font-mono shadow-neon-cyan hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Playlist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Create New Playlist Card Shortcut */}
            <div
              onClick={onOpenCreatePlaylist}
              className="group p-6 rounded-2xl border-2 border-dashed border-purple-500/30 hover:border-cyan-400/60 bg-purple-950/10 hover:bg-purple-900/20 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 shadow-neon-cyan transition-all mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-300">
                New Neural Playlist
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Click to synthesize audio list
              </p>
            </div>

            {/* List of existing playlists */}
            {playlists.map((playlist) => {
              const playlistTracks = playlist.trackIds
                .map(id => getTrackById(id))
                .filter((t): t is Track => t !== undefined);

              return (
                <div
                  key={playlist.id}
                  onClick={() => onSelectPlaylist(playlist.id)}
                  className="group relative p-5 rounded-2xl glass-card border border-purple-500/20 hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
                >
                  <div>
                    {/* Cover Gradient Banner */}
                    <div className={`w-full h-32 rounded-xl bg-gradient-to-tr ${playlist.coverGradient} p-4 flex items-end justify-between shadow-neon-combo mb-4 relative overflow-hidden`}>
                      <div className="absolute top-3 left-3 p-2 rounded-lg bg-black/40 backdrop-blur-md text-white">
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                      </div>

                      {/* Play entire playlist floating button */}
                      {playlistTracks.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(playlistTracks[0], playlistTracks);
                          }}
                          className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-neon-cyan hover:scale-110 active:scale-95 transition-all"
                          title="Play playlist now"
                          aria-label="Play playlist now"
                        >
                          <Play className="w-4 h-4 fill-black translate-x-0.5" />
                        </button>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                      {playlist.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {playlist.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-400">
                    <span>{playlist.trackIds.length} tracks</span>

                    {playlist.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlaylist(playlist.id);
                        }}
                        className="p-1 rounded-md text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete playlist"
                        aria-label="Delete playlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIKED SONGS */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          {/* Liked Hero Header */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-pink-950/40 via-vybe-card to-purple-950/40 border border-pink-500/30 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-neon-purple shrink-0">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>

            <div className="text-center sm:text-left flex-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">
                FREQUENCY VAULT
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black text-white mt-1">
                Liked Songs
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                {likedTracks.length} saved streams &bull; Total duration: {formatDuration(totalLikedDuration)}
              </p>

              {likedTracks.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={handlePlayLikedAll}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs font-mono hover:bg-pink-600 shadow-neon-purple transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Play Liked</span>
                  </button>
                  <button
                    onClick={handleShuffleLikedAll}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono transition-all"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Shuffle</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List of Liked tracks */}
          {likedTracks.length > 0 ? (
            <div className="glass-panel rounded-2xl p-2 border border-purple-500/20 divide-y divide-white/5">
              {likedTracks.map((track, idx) => (
                <div key={track.id} className="py-1">
                  <TrackRow
                    track={track}
                    index={idx}
                    onAddToPlaylist={onAddToPlaylist}
                    playlistContext={likedTracks}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl glass-card border border-white/5">
              <Heart className="w-10 h-10 text-pink-500/40 mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-white">No Liked Songs Yet</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Tap the heart on any stream to store it in your frequency vault.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LISTENING HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">
              Recent Transmissions ({recentTracks.length})
            </span>
          </div>

          {recentTracks.length > 0 ? (
            <div className="glass-panel rounded-2xl p-2 border border-purple-500/20 divide-y divide-white/5">
              {recentTracks.map((track, idx) => (
                <div key={track.id} className="py-1">
                  <TrackRow
                    track={track}
                    index={idx}
                    onAddToPlaylist={onAddToPlaylist}
                    playlistContext={recentTracks}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl glass-card border border-white/5">
              <Clock className="w-10 h-10 text-cyan-400/40 mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-white">History Empty</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Your neural transmissions history will appear here once audio begins playing.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
