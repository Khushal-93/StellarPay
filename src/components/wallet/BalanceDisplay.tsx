import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface BalanceDisplayProps {
  balance: number | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
  className?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  loading,
  error,
  onRefresh,
  className = '',
}) => {
  if (loading && balance === null) {
    return (
      <div className={`flex items-center gap-3 py-2 ${className}`}>
        <LoadingSpinner size="md" />
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-rose-600 text-sm font-medium py-1 ${className}`}>
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="ml-auto text-xs text-blue-600 hover:text-blue-800 underline font-normal"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const formattedBalance =
    balance !== null
      ? balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        })
      : '0.00';

  return (
    <div className={`flex items-baseline justify-between ${className}`}>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-slate-900">
            {formattedBalance}
          </span>
          <span className="text-sm font-semibold text-slate-500">XLM</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Available balance
        </p>
      </div>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Balance"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span className="sr-only">Refresh balance</span>
        </button>
      )}
    </div>
  );
};
