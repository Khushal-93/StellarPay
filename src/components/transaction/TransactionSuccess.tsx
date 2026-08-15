import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';
import { ExplorerLink } from './ExplorerLink';

interface TransactionSuccessProps {
  amount: string;
  txHash: string;
  onReset: () => void;
  className?: string;
}

export const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
  amount,
  txHash,
  onReset,
  className = '',
}) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  const shortenedHash =
    txHash.length > 16 ? `${txHash.slice(0, 8)}...${txHash.slice(-8)}` : txHash;

  return (
    <div
      className={`bg-white rounded-xl border border-emerald-200 p-6 shadow-card space-y-6 animate-in fade-in duration-300 ${className}`}
    >
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100 mb-1">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Payment Successful</h2>
        <p className="text-2xl font-extrabold text-emerald-700 tracking-tight">
          {formattedAmount} <span className="text-base font-semibold text-emerald-800">XLM sent</span>
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-500 uppercase">Transaction</span>
          <div className="inline-flex items-center gap-2">
            <span
              title={txHash}
              className="font-mono text-xs font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200"
            >
              {shortenedHash}
            </span>
            <CopyButton textToCopy={txHash} label="Copy Hash" />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-semibold uppercase">Network</span>
          <span className="font-medium text-slate-800">Stellar Testnet</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <ExplorerLink transactionHash={txHash} className="w-full" />

        <button
          type="button"
          onClick={onReset}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-md font-semibold text-sm transition-colors border border-slate-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Send Another Payment</span>
        </button>
      </div>
    </div>
  );
};
