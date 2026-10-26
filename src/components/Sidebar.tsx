import React from 'react';
import { ViewMode } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import { 
  Radio, 
  Compass, 
  Search, 
  Library, 
  Heart, 
  Plus, 
  Flame, 
  Moon, 
  Zap, 
  Cpu, 
  Music,
  Activity,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenCreatePlaylist: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  selectedPlaylistId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenCreatePlaylist,
  onSelectPlaylist,
  selectedPlaylistId,
}) => {
  const { playlists, favorites } = useLibrary();
  const { isPlaying, isUsingSynth } = useAudio();

  const getPlaylistIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'Moon': return <Moon className="w-4 h-4 text-cyan-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-pink-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-emerald-400" />;
      default: return <Music className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-vybe-dark/95 border-r border-purple-500/15 backdrop-blur-xl z-30 select-none">
      {/* VYBE Brand Header */}
      <div className="p-6 pb-4">
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center p-[2px] shadow-neon-combo transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-vybe-void rounded-[10px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400">
                VYBE
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wider uppercase bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider">HOLOGRAPHIC STREAM</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="px-3 py-2 space-y-1">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentView === 'home'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30 shadow-neon-purple'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Radio className={`w-5 h-5 ${currentView === 'home' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Home Matrix</span>
        </button>

        <button
          onClick={() => onNavigate('discover')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentView === 'discover'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30 shadow-neon-purple'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentView === 'discover' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Discover</span>
        </button>

        <button
          onClick={() => onNavigate('search')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentView === 'search'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30 shadow-neon-purple'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className={`w-5 h-5 ${currentView === 'search' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Search & Filters</span>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentView === 'library'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30 shadow-neon-purple'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Library className={`w-5 h-5 ${currentView === 'library' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Your Library</span>
        </button>

        <button
          onClick={() => onNavigate('favorites')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentView === 'favorites'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30 shadow-neon-purple'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'text-pink-400 fill-pink-400' : 'text-slate-400'}`} />
            <span>Liked Songs</span>
          </div>
          {favorites.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {favorites.length}
            </span>
          )}
        </button>
      </nav>

      {/* Playlists Divider & Quick Create */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Neural Playlists
          </span>
        </div>
        <button
          onClick={onOpenCreatePlaylist}
          className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-purple-500/20 transition-colors"
          title="Create Playlist"
          aria-label="Create Playlist"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Playlist List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        {playlists.map((playlist) => {
          const isSelected = currentView === 'playlist-detail' && selectedPlaylistId === playlist.id;
          return (
            <button
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-all duration-200 group ${
                isSelected
                  ? 'bg-purple-500/20 text-cyan-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-900/80 to-slate-900 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-cyan-400/40">
                {getPlaylistIcon(playlist.coverIcon)}
              </div>
              <div className="truncate flex-1">
                <p className="truncate text-sm font-medium">{playlist.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'track' : 'tracks'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Audio Engine Status Card */}
      <div className="p-4 border-t border-purple-500/15">
        <div className="p-3 rounded-xl bg-vybe-surface/80 border border-purple-500/20 backdrop-blur">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
              {isUsingSynth ? 'SYNTH ENGINE' : 'AUDIO CORE'}
            </span>
            <span className="text-[10px] font-mono text-cyan-400">96 kHz</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 ${
                isPlaying ? 'w-full animate-pulse' : 'w-1/3'
              }`} 
            />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-2 truncate">
            {isPlaying ? 'ACTIVE FREQUENCY SYNC' : 'STANDBY MODE'}
          </p>
        </div>
      </div>
    </aside>
  );
};
