import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, Sparkles, Zap, Moon, Flame, Cpu, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (playlistId: string) => void;
}

const GRADIENT_PRESETS = [
  { id: 'g1', name: 'Cyber Violet', class: 'from-violet-600 via-fuchsia-600 to-cyan-400' },
  { id: 'g2', name: 'Electric Cyan', class: 'from-cyan-500 via-blue-600 to-purple-600' },
  { id: 'g3', name: 'Neon Hyperdrive', class: 'from-pink-500 via-rose-600 to-violet-800' },
  { id: 'g4', name: 'Matrix Emerald', class: 'from-emerald-500 via-teal-600 to-indigo-800' },
  { id: 'g5', name: 'Solar Amber', class: 'from-amber-500 via-orange-600 to-purple-800' },
];

const ICONS = [
  { id: 'Zap', icon: Zap, label: 'Cyber' },
  { id: 'Moon', icon: Moon, label: 'Night' },
  { id: 'Flame', icon: Flame, label: 'Energy' },
  { id: 'Cpu', icon: Cpu, label: 'Tech' },
  { id: 'Music', icon: Music, label: 'Sonic' },
];

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { createPlaylist } = useLibrary();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].class);
  const [selectedIcon, setSelectedIcon] = useState('Zap');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = createPlaylist(name, description, selectedGradient, selectedIcon);

    // Subtle celebratory confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f5ff', '#a855f7', '#ec4899']
      });
    } catch {
      // Ignore if canvas-confetti fails
    }

    setName('');
    setDescription('');
    if (onCreated) {
      onCreated(id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-vybe-card border border-purple-500/30 p-6 shadow-neon-combo text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Create Neural Playlist</h3>
              <p className="text-xs text-slate-400 font-mono">Synthesize a new audio collection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Playlist Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sub-orbital Flight 2099"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-vybe-surface border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="e.g. High tempo basslines for cyber focus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-vybe-surface border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
            />
          </div>

          {/* Theme Gradient Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              Cyber Gradient Theme
            </label>
            <div className="flex gap-2.5">
              {GRADIENT_PRESETS.map((grad) => (
                <button
                  key={grad.id}
                  type="button"
                  onClick={() => setSelectedGradient(grad.class)}
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${grad.class} p-[2px] transition-transform ${
                    selectedGradient === grad.class ? 'scale-110 ring-2 ring-cyan-400' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={grad.name}
                  aria-label={grad.name}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              Neural Icon
            </label>
            <div className="flex gap-2">
              {ICONS.map(({ id, icon: IconComponent, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedIcon(id)}
                  className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center gap-1 text-xs font-mono transition-all ${
                    selectedIcon === id
                      ? 'bg-purple-600/30 text-cyan-300 border border-cyan-400/40 shadow-neon-purple'
                      : 'bg-vybe-surface text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-400 to-purple-600 text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-neon-cyan transition-all"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
