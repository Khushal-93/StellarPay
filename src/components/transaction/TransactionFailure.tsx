import React from 'react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface TransactionFailureProps {
  error: string | null;
  onRetry: () => void;
  onBack?: () => void;
  className?: string;
}

export const TransactionFailure: React.FC<TransactionFailureProps> = ({
  error,
  onRetry,
  onBack,
  className = '',
}) => {
  const displayError =
    error ||
    "We couldn't submit the transaction. Please check your balance and try again.";

  return (
    <div
      className={`bg-white rounded-xl border border-rose-200 p-6 shadow-card space-y-6 animate-in fade-in duration-300 ${className}`}
    >
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-rose-50 rounded-full text-rose-600 border border-rose-100 mb-1">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Transaction Failed</h2>
        <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed font-medium">
          {displayError}
        </p>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-md font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-600 rounded-md font-medium text-sm transition-colors border border-slate-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Back to Payment Form</span>
          </button>
        )}
      </div>
    </div>
  );
};
