import React from 'react';
import { useAudio } from '../context/AudioContext';
import { formatDuration } from '../utils/audioSynth';
import { AudioVisualizer } from './AudioVisualizer';
import { X, Trash2, Play, Volume2 } from 'lucide-react';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentTrack,
    queue,
    isPlaying,
    analyserNode,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = useAudio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-vybe-dark/95 border-l border-purple-500/25 p-6 backdrop-blur-2xl flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Play Queue</h3>
              <p className="text-xs text-slate-400 font-mono">
                {queue.length} {queue.length === 1 ? 'track' : 'tracks'} queued
              </p>
            </div>

            <div className="flex items-center gap-2">
              {queue.length > 1 && (
                <button
                  onClick={clearQueue}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Clear Queue"
                  aria-label="Clear Queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close queue"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Currently Playing Card */}
          {currentTrack && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-cyan-900/20 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  Now Playing
                </span>
                <span className="text-xs font-mono text-purple-300">
                  {formatDuration(currentTrack.duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-xl object-cover border border-cyan-400/30"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {currentTrack.artist}
                  </p>
                </div>

                <div className="shrink-0">
                  <AudioVisualizer
                    analyserNode={analyserNode}
                    isPlaying={isPlaying}
                    accentColor={currentTrack.accentColor || '#00f5ff'}
                    style="neon-bars"
                    width={40}
                    height={20}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div className="mt-6 flex-1 overflow-y-auto">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
              Up Next
            </h4>

            {queue.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Queue is empty
              </div>
            ) : (
              <div className="space-y-1.5">
                {queue.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;

                  return (
                    <div
                      key={`${track.id}-${idx}`}
                      onClick={() => playTrack(track)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        isCurrent
                          ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
                          : 'hover:bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs font-mono text-slate-500 w-4 text-center shrink-0">
                          {idx + 1}
                        </span>

                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{track.title}</p>
                          <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs font-mono text-slate-400">
                          {formatDuration(track.duration)}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(idx);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all"
                          title="Remove from queue"
                          aria-label="Remove from queue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(track);
                          }}
                          className="hidden group-hover:flex p-1.5 rounded-lg text-cyan-400 hover:scale-110 transition-transform"
                          aria-label="Play track"
                        >
                          <Play className="w-3.5 h-3.5 fill-cyan-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
