import React from 'react';
import { ViewMode } from '../types';
import { Radio, Compass, Search, Library, Heart } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

interface MobileNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const { favorites } = useLibrary();

  const navItems = [
    { id: 'home' as ViewMode, label: 'Home', icon: Radio },
    { id: 'discover' as ViewMode, label: 'Discover', icon: Compass },
    { id: 'search' as ViewMode, label: 'Search', icon: Search },
    { id: 'library' as ViewMode, label: 'Library', icon: Library },
    { id: 'favorites' as ViewMode, label: 'Liked', icon: Heart, badge: favorites.length },
  ];

  return (
    <nav className="md:hidden fixed bottom-24 left-3 right-3 h-14 bg-vybe-dark/95 border border-purple-500/25 rounded-2xl backdrop-blur-2xl z-30 px-3 flex items-center justify-around shadow-2xl">
      {navItems.map(({ id, label, icon: Icon, badge }) => {
        const isActive = currentView === id;

        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-label={label}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-pink-500 text-[9px] font-mono font-bold flex items-center justify-center text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{label}</span>

            {isActive && (
              <span className="absolute -bottom-1 w-4 h-[2px] bg-cyan-400 rounded-full shadow-neon-cyan" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
