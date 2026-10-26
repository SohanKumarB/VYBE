import React, { useState } from 'react';
import { ViewMode, Track } from './types';
import { Sidebar } from './components/Sidebar';
import { BottomPlayer } from './components/BottomPlayer';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { QueueDrawer } from './components/QueueDrawer';
import { FullscreenVisualizerModal } from './components/FullscreenVisualizerModal';

import { HomeScreen } from './views/HomeScreen';
import { DiscoverScreen } from './views/DiscoverScreen';
import { SearchScreen } from './views/SearchScreen';
import { LibraryScreen } from './views/LibraryScreen';
import { PlaylistDetailScreen } from './views/PlaylistDetailScreen';
import { useAudio } from './context/AudioContext';
import { Activity, Radio } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | undefined>(undefined);

  // Modals state
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [targetTrack, setTargetTrack] = useState<Track | null>(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

  const { audioError } = useAudio();

  // Navigation handler
  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlaylist = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setCurrentView('playlist-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddToPlaylist = (track: Track) => {
    setTargetTrack(track);
    setIsAddToPlaylistOpen(true);
  };

  return (
    <div className="min-h-screen bg-vybe-void text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Desktop Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
          onSelectPlaylist={handleSelectPlaylist}
          selectedPlaylistId={selectedPlaylistId}
        />
      </div>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 h-16 bg-vybe-dark/95 border-b border-purple-500/20 px-4 flex items-center justify-between backdrop-blur-xl">
        <div 
          onClick={() => handleNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-600 p-[2px] shadow-neon-combo">
            <div className="w-full h-full bg-vybe-void rounded-[6px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-display font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            VYBE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigate('search')}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/5"
            aria-label="Search"
          >
            <Radio className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen flex flex-col px-4 md:px-8 pt-6 pb-44 md:pb-36 overflow-y-auto">
        {/* Unobtrusive Audio Status Banner if active */}
        {audioError && (
          <div className="mb-6 px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs font-mono text-purple-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{audioError}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-cyan-400">0ms Latency</span>
          </div>
        )}

        {/* Dynamic Screen Renderer */}
        {currentView === 'home' && (
          <HomeScreen
            onAddToPlaylist={handleOpenAddToPlaylist}
            onSelectPlaylist={handleSelectPlaylist}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'discover' && (
          <DiscoverScreen
            onAddToPlaylist={handleOpenAddToPlaylist}
          />
        )}

        {currentView === 'search' && (
          <SearchScreen
            onAddToPlaylist={handleOpenAddToPlaylist}
          />
        )}

        {currentView === 'library' && (
          <LibraryScreen
            initialTab="playlists"
            onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
            onSelectPlaylist={handleSelectPlaylist}
            onAddToPlaylist={handleOpenAddToPlaylist}
          />
        )}

        {currentView === 'favorites' && (
          <LibraryScreen
            initialTab="favorites"
            onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
            onSelectPlaylist={handleSelectPlaylist}
            onAddToPlaylist={handleOpenAddToPlaylist}
          />
        )}

        {currentView === 'playlist-detail' && selectedPlaylistId && (
          <PlaylistDetailScreen
            playlistId={selectedPlaylistId}
            onBack={() => handleNavigate('library')}
            onAddToPlaylist={handleOpenAddToPlaylist}
            onExploreMore={() => handleNavigate('discover')}
          />
        )}
      </main>

      {/* Persistent Bottom Player */}
      <BottomPlayer
        onToggleQueue={() => setIsQueueOpen(prev => !prev)}
        onOpenVisualizer={() => setIsVisualizerOpen(true)}
        onOpenTrackDetails={() => setIsVisualizerOpen(true)}
      />

      {/* Mobile Floating Bottom Bar */}
      <MobileNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      {/* Fullscreen Holographic Visualizer HUD */}
      <FullscreenVisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
      />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreated={(id) => handleSelectPlaylist(id)}
      />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        track={targetTrack}
        onClose={() => {
          setIsAddToPlaylistOpen(false);
          setTargetTrack(null);
        }}
        onOpenCreateNew={() => setIsCreatePlaylistOpen(true)}
      />
    </div>
  );
};
