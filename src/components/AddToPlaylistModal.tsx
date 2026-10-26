import React from 'react';
import { Track } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { X, Check, Plus, Layers } from 'lucide-react';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  track: Track | null;
  onClose: () => void;
  onOpenCreateNew: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  track,
  onClose,
  onOpenCreateNew,
}) => {
  const { playlists, addTrackToPlaylist, removeTrackFromPlaylist } = useLibrary();

  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-sm rounded-2xl bg-vybe-card border border-purple-500/30 p-5 shadow-neon-combo text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div>
            <h3 className="font-display font-bold text-base text-white">Add to Playlist</h3>
            <p className="text-xs text-slate-400 truncate max-w-[220px]">
              {track.title} &bull; {track.artist}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Playlist selector list */}
        <div className="my-4 max-h-60 overflow-y-auto space-y-1.5">
          {playlists.map((playlist) => {
            const isAlreadyIn = playlist.trackIds.includes(track.id);

            return (
              <button
                key={playlist.id}
                onClick={() => {
                  if (isAlreadyIn) {
                    removeTrackFromPlaylist(playlist.id, track.id);
                  } else {
                    addTrackToPlaylist(playlist.id, track.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left border ${
                  isAlreadyIn
                    ? 'bg-purple-600/20 border-cyan-400/40 text-cyan-300'
                    : 'bg-vybe-surface/60 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-800 to-slate-900 flex items-center justify-center shrink-0 border border-white/10">
                    <Layers className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{playlist.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">
                      {playlist.trackIds.length} tracks
                    </p>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                  isAlreadyIn
                    ? 'bg-cyan-400 border-cyan-400 text-black'
                    : 'border-slate-600 text-transparent'
                }`}>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Create new playlist shortcut */}
        <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenCreateNew();
            }}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border border-purple-500/40 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
