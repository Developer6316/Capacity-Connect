import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2, HardDrive } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const { isOnline, offlineSyncCount } = useOnlineStatus();

  if (isOnline && offlineSyncCount === 0) return null;

  return (
    <aside aria-label="Offline Mode Notification" className="fixed bottom-4 left-4 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-amber-500/40 text-slate-100 shadow-2xl backdrop-blur-md">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
          {!isOnline ? (
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-white">
              {!isOnline ? 'Offline Access Mode Active' : 'Synchronizing Progress...'}
            </p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HardDrive className="w-2.5 h-2.5" />
              Cached
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {!isOnline 
              ? 'Local study paths, formula sheets & flashcards available offline.' 
              : `Syncing ${offlineSyncCount} pending study session activities to cloud.`}
          </p>
        </div>
        {!isOnline && (
          <div className="flex items-center text-emerald-400 text-xs font-semibold shrink-0 gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ready</span>
          </div>
        )}
      </div>
    </aside>
  );
};
