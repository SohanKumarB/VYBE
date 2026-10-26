import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-vybe-card/95 border border-purple-500/30 text-white shadow-neon-purple backdrop-blur-md transition-all duration-300 animate-slide-in"
          style={{
            animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'neon' && <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-purple-400 shrink-0" />}
          
          <span className="text-sm font-medium tracking-wide text-slate-100">{toast.message}</span>
          
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
