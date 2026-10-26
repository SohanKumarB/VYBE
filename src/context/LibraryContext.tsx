import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Playlist, Track } from '../types';
import { INITIAL_PLAYLISTS, SAMPLE_TRACKS } from '../data/mockTracks';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'neon';
}

interface LibraryContextType {
  favorites: string[];
  playlists: Playlist[];
  recentlyPlayed: string[];
  searchHistory: string[];
  toasts: Toast[];
  
  // Actions
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  createPlaylist: (name: string, description: string, coverGradient?: string, coverIcon?: string) => string;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  recordRecentlyPlayed: (trackId: string) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'neon') => void;
  dismissToast: (id: string) => void;
  getTrackById: (id: string) => Track | undefined;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Favorites persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vybe_favorites');
      return saved ? JSON.parse(saved) : ['trk-1', 'trk-2', 'trk-5'];
    } catch {
      return ['trk-1', 'trk-2', 'trk-5'];
    }
  });

  // Playlists persistence
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('vybe_playlists');
      return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
    } catch {
      return INITIAL_PLAYLISTS;
    }
  });

  // Recently played tracks
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vybe_recent');
      return saved ? JSON.parse(saved) : ['trk-1', 'trk-3', 'trk-6'];
    } catch {
      return ['trk-1', 'trk-3', 'trk-6'];
    }
  });

  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vybe_search_history');
      return saved ? JSON.parse(saved) : ['Synthwave', 'Aethelgard', 'Chillwave', '140 BPM'];
    } catch {
      return ['Synthwave', 'Aethelgard'];
    }
  });

  // In-app interactive toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('vybe_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vybe_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('vybe_recent', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem('vybe_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'neon' = 'neon') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(trackId);
      if (exists) {
        showToast('Removed from Liked Songs', 'info');
        return prev.filter(id => id !== trackId);
      } else {
        showToast('Saved to Liked Songs', 'neon');
        return [...prev, trackId];
      }
    });
  }, [showToast]);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.includes(trackId);
  }, [favorites]);

  const createPlaylist = useCallback((
    name: string, 
    description: string, 
    coverGradient: string = 'from-purple-600 via-fuchsia-600 to-cyan-500', 
    coverIcon: string = 'Music'
  ): string => {
    const newId = `pl-custom-${Date.now()}`;
    const newPlaylist: Playlist = {
      id: newId,
      name: name.trim() || 'Untitled Playlist',
      description: description.trim() || 'Custom holographic audio compilation.',
      coverGradient,
      coverIcon,
      trackIds: [],
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true
    };

    setPlaylists(prev => [newPlaylist, ...prev]);
    showToast(`Created playlist "${newPlaylist.name}"`, 'success');
    return newId;
  }, [showToast]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => {
      const target = prev.find(p => p.id === playlistId);
      if (target) {
        showToast(`Deleted playlist "${target.name}"`, 'info');
      }
      return prev.filter(p => p.id !== playlistId);
    });
  }, [showToast]);

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.trackIds.includes(trackId)) {
          showToast(`Track already exists in ${p.name}`, 'info');
          return p;
        }
        showToast(`Added to "${p.name}"`, 'success');
        return {
          ...p,
          trackIds: [...p.trackIds, trackId]
        };
      }
      return p;
    }));
  }, [showToast]);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        showToast(`Removed track from "${p.name}"`, 'info');
        return {
          ...p,
          trackIds: p.trackIds.filter(id => id !== trackId)
        };
      }
      return p;
    }));
  }, [showToast]);

  const recordRecentlyPlayed = useCallback((trackId: string) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(id => id !== trackId);
      return [trackId, ...filtered].slice(0, 20);
    });
  }, []);

  const addSearchHistory = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    showToast('Search history cleared', 'info');
  }, [showToast]);

  const getTrackById = useCallback((id: string): Track | undefined => {
    return SAMPLE_TRACKS.find(t => t.id === id);
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        favorites,
        playlists,
        recentlyPlayed,
        searchHistory,
        toasts,
        toggleFavorite,
        isFavorite,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        recordRecentlyPlayed,
        addSearchHistory,
        clearSearchHistory,
        showToast,
        dismissToast,
        getTrackById
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
