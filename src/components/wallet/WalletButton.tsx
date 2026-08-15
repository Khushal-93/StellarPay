import React from 'react';
import { Wallet, LogOut, Download, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface WalletButtonProps {
  connected: boolean;
  address: string | null;
  loading: boolean;
  isInstalled: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  connected,
  address,
  loading,
  isInstalled,
  onConnect,
  onDisconnect,
  className = '',
}) => {
  if (!isInstalled) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-md text-xs font-medium transition-colors ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-amber-600" />
        <span>Install Freighter</span>
      </a>
    );
  }

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-md text-xs font-medium cursor-not-allowed border border-slate-200 ${className}`}
      >
        <LoadingSpinner size="sm" />
        <span>Connecting...</span>
      </button>
    );
  }

  if (connected && address) {
    const shortened = `${address.slice(0, 4)}...${address.slice(-4)}`;
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono font-medium text-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{shortened}</span>
        </div>
        <button
          type="button"
          onClick={onDisconnect}
          title="Disconnect Wallet"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-md text-xs font-medium transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onConnect}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md text-xs font-semibold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${className}`}
    >
      <Wallet className="w-3.5 h-3.5" />
      <span>Connect Freighter</span>
    </button>
  );
};
