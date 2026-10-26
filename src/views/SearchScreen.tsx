import React, { useState, useMemo } from 'react';
import { SAMPLE_TRACKS, GENRE_LIST } from '../data/mockTracks';
import { Track } from '../types';
import { TrackRow } from '../components/TrackRow';
import { TrackCard } from '../components/TrackCard';
import { useLibrary } from '../context/LibraryContext';
import { 
  Search as SearchIcon, 
  X, 
  Clock, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Radio
} from 'lucide-react';

interface SearchScreenProps {
  onAddToPlaylist: (track: Track) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onAddToPlaylist }) => {
  const { searchHistory, addSearchHistory, clearSearchHistory } = useLibrary();
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter logic
  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return SAMPLE_TRACKS.filter((track) => {
      // Genre filter
      if (selectedGenre !== 'All' && track.genre !== selectedGenre) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const titleMatch = track.title.toLowerCase().includes(q);
      const artistMatch = track.artist.toLowerCase().includes(q);
      const albumMatch = track.album.toLowerCase().includes(q);
      const genreMatch = track.genre.toLowerCase().includes(q);
      const moodMatch = track.mood.toLowerCase().includes(q);

      return titleMatch || artistMatch || albumMatch || genreMatch || moodMatch;
    });
  }, [query, selectedGenre]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addSearchHistory(query.trim());
    }
  };

  const handleHistoryClick = (item: string) => {
    setQuery(item);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in select-none">
      {/* Search Header and Search Input */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-wide">
            Search Neural Streams
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Search through tracks, holographic artists, albums, or cyber genres
          </p>
        </div>

        {/* Input box */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 w-5 h-5 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, artist, genre (e.g. 'Cybernetic', 'Synthwave', 'Aethelgard')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-vybe-surface/90 border border-purple-500/30 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-neon-purple transition-all"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Recent Search History Chips */}
        {searchHistory.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Recent:</span>
            </div>

            {searchHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleHistoryClick(item)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-500/10 text-slate-300 hover:text-cyan-300 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
              >
                {item}
              </button>
            ))}

            <button
              onClick={clearSearchHistory}
              className="text-[11px] font-mono text-slate-500 hover:text-red-400 ml-1 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* GENRE FILTER PILLS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Filter by Genre
            </span>
          </div>

          {/* Toggle View (List vs Grid) */}
          <div className="flex items-center gap-1 bg-vybe-surface p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600/30 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-600/30 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GENRE_LIST.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider shrink-0 transition-all ${
                selectedGenre === genre
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan font-bold'
                  : 'bg-vybe-surface/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH RESULTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            {filteredTracks.length} {filteredTracks.length === 1 ? 'result' : 'results'} found
            {query && ` for "${query}"`}
          </span>
        </div>

        {filteredTracks.length > 0 ? (
          viewMode === 'list' ? (
            <div className="rounded-2xl glass-panel p-2 border border-purple-500/20 divide-y divide-white/5">
              {filteredTracks.map((track, idx) => (
                <div key={track.id} className="py-1">
                  <TrackRow
                    track={track}
                    index={idx}
                    onAddToPlaylist={onAddToPlaylist}
                    playlistContext={filteredTracks}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onAddToPlaylist={onAddToPlaylist}
                  playlistContext={filteredTracks}
                />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="p-12 text-center rounded-3xl glass-card border border-purple-500/20 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Radio className="w-7 h-7 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">No Neural Streams Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed font-mono">
              No matching frequencies located for "{query}". Try adjusting your keywords or selecting another cyber genre.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedGenre('All');
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-purple-600/30 text-cyan-300 border border-purple-500/40 hover:bg-purple-600/50 transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
