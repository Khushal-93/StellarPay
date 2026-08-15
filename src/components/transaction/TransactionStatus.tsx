import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { TransactionState } from '../../types/transaction';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface TransactionStatusProps {
  status: TransactionState;
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  className = '',
}) => {
  const isAwaitingSignature = status === 'AWAITING_SIGNATURE';
  const isSigned = status === 'SIGNED';
  const isSubmitting = status === 'SUBMITTING';

  const title = isAwaitingSignature
    ? 'Waiting for wallet confirmation...'
    : isSigned
      ? 'Transaction signed successfully...'
      : isSubmitting
        ? 'Submitting to Stellar Testnet...'
        : 'Processing transaction...';

  const description = isAwaitingSignature
    ? 'Please check your Freighter wallet extension popup and approve the signature request.'
    : isSigned
      ? 'Your transaction has been signed. Preparing it for submission to the Stellar Testnet.'
      : 'Communicating with Horizon server to validate and submit transaction XDR to the ledger.';

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-8 shadow-card text-center space-y-5 animate-in fade-in duration-200 ${className}`}
    >
      <div className="flex justify-center">
        <div className="p-4 bg-blue-50 rounded-full border border-blue-100">
          <LoadingSpinner size="lg" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">
          {title}
        </h3>

        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

        <span>Stellar Testnet • Freighter Security</span>

        {isAwaitingSignature && (
          <span className="inline-flex items-center gap-1 text-blue-600 font-semibold animate-pulse ml-1">
            <ExternalLink className="w-3 h-3" />
            Check Wallet Popup
          </span>
        )}
      </div>
    </div>
  );
};